# AdminWebhooks

Rex webhooks let your systems react to events ("Listing Updated", "Note
Created", …) instead of polling. This package exposes two layers:

| Concern | Where |
| --- | --- |
| Managing subscriptions (create / update / search / health) | generated `AdminWebhooks*` operations in `src/operations/` |
| Decoding the inbound delivery payload Rex `POST`s to you | `decodeWebhookDelivery` from `@smartretraining/rex-effect/Webhooks` |

## The recommended approach

Straight from the Rex docs:

1. **Subscribe** with `AdminWebhooksCreate`, `is_enabled: true`.
2. **React** to deliveries at your callback URL — respond fast (`2xx` within
   10s) or Rex counts it a failure.
3. **Back it up with a nightly e-tag sync.** Deliveries can be missed; if a
   webhook goes unhealthy (≥99% failures over 24h) Rex stops sending, and
   events that occurred while it was unhealthy are *not* replayed after you
   re-enable it. The nightly sync is what makes the system eventually
   consistent.
4. **Recover** an unhealthy subscription with `AdminWebhooksMarkAsHealthy`.

This doc shows it as a **Cloudflare Worker** — a `fetch` handler for live
deliveries and a `scheduled` handler (Cron Trigger) for the nightly backstop.

## Worker setup

### `wrangler.toml`

```toml
name = "rex-webhook-sync"
main = "src/worker.ts"
compatibility_date = "2024-09-23"
# Required so Effect's FetchHttpClient and Node-style APIs resolve.
compatibility_flags = ["nodejs_compat"]

# Nightly e-tag sync at 03:00 UTC — the backstop for missed deliveries.
[triggers]
crons = ["0 3 * * *"]
```

Set the Rex token as a secret (Workers have no `process.env`, so the SDK's
`CredentialsFromEnv` doesn't apply — build the layer from the `env` binding
instead):

```bash
wrangler secret put REX_API_TOKEN
```

### Shared layer

Both handlers need the same `Credentials` + HTTP client layer, built per
request from the Worker `env`.

```typescript
// src/runtime.ts
import { Layer } from "effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { CredentialsFromToken } from "@smartretraining/rex-effect";

export interface Env {
  REX_API_TOKEN: string;
  // ...your KV / D1 / R2 bindings, etc.
}

export const makeRexLayer = (env: Env) =>
  Layer.merge(
    FetchHttpClient.layer,
    CredentialsFromToken(env.REX_API_TOKEN),
  );
```

## 1. Create a subscription

A one-off you run from your machine (or a setup route), pointing Rex at the
deployed Worker URL:

```typescript
import { Effect } from "effect";
import { AdminWebhooksCreate } from "@smartretraining/rex-effect";

const subscribe = AdminWebhooksCreate({
  data: {
    name: "Listing + Property sync",
    url: "https://rex-webhook-sync.<your-subdomain>.workers.dev",
    is_enabled: true, // without this the webhook never fires
    send_format_id: "v1_full_change_detail", // or "v1_context_only"
    events: [
      { event_id: "listings.updated" },
      { event_id: "properties.updated" },
    ],
  },
});
```

Use `AdminWebhooksGetEventsAndCategories` to discover the 50+ available
`event_id`s.

## 2. The delivery handler (`fetch`)

The handler decodes the body, then **acknowledges fast**. Rex only needs a
`2xx` within 10 seconds, so the per-record sync work runs in
`ctx.waitUntil()` — the Worker stays alive for it *after* the response is
sent, instead of blocking the response on your database.

```typescript
// src/worker.ts
import { Effect } from "effect";
import {
  decodeWebhookDelivery,
  type WebhookEvent,
} from "@smartretraining/rex-effect/Webhooks";
import { ListingsRead, PropertiesRead } from "@smartretraining/rex-effect";
import { makeRexLayer, type Env } from "./runtime.ts";

// Your local persistence — swap for a D1 / KV / external DB layer.
declare const upsertRecord: (
  service: string,
  record: Record<string, unknown>,
) => Effect.Effect<void>;
declare const deleteRecord: (
  service: string,
  recordId: number | string,
) => Effect.Effect<void>;

// Dispatch a context-only `record_id` to the right generated `*Read` op.
// Add a case per service as you generate it (see the package README).
const readByService = (
  service: string | undefined,
  recordId: number | string,
) => {
  switch (service) {
    case "Listings":
      return ListingsRead({ id: Number(recordId) });
    case "Properties":
      return PropertiesRead({ id: Number(recordId) });
    default:
      return Effect.succeed(undefined);
  }
};

// Resolve a record for one event, regardless of the subscription's format.
const resolveRecord = (event: WebhookEvent) =>
  Effect.gen(function* () {
    const { payload } = event;

    if (payload.format === "v1_full_change_detail") {
      // Full change set: `post` is the current state, `pre` is the previous
      // state (null for "create" events). Nothing else to fetch.
      const service = payload.context?.service ?? "Unknown";
      return { service, post: payload.data.post };
    }

    // v1_context_only: we only got an id — read the record back ourselves.
    const { service, record_id } = payload.context;
    if (record_id === undefined) return undefined;
    const post = yield* readByService(service, record_id);
    return { service: service ?? "Unknown", post };
  });

// Apply one event to local state.
const applyEvent = (event: WebhookEvent) =>
  Effect.gen(function* () {
    const resolved = yield* resolveRecord(event);
    if (resolved === undefined) return;

    const { service, post } = resolved;
    if (post === null || post === undefined) {
      // No `post` state → the record was removed.
      const id =
        event.payload.format === "v1_context_only"
          ? event.payload.context.record_id
          : undefined;
      if (id !== undefined) yield* deleteRecord(service, id);
      return;
    }
    yield* upsertRecord(service, post as Record<string, unknown>);
  });

// Decode + fan out the sync work. Runs inside `ctx.waitUntil`.
const syncDelivery = (rawBody: unknown) =>
  Effect.gen(function* () {
    const delivery = yield* decodeWebhookDelivery(rawBody);
    yield* Effect.forEach(delivery.data, applyEvent, { concurrency: 4 });
  }).pipe(
    Effect.catchAllCause((cause) =>
      Effect.logError("rex webhook sync failed", cause),
    ),
  );

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response("Bad Request", { status: 400 });
    }

    // Process events after the response is sent — keeps Rex's delivery well
    // under the 10s health threshold.
    ctx.waitUntil(
      Effect.runPromise(syncDelivery(body).pipe(Effect.provide(makeRexLayer(env)))),
    );

    return new Response(null, { status: 202 });
  },

  // Cron Trigger — see section 3.
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      Effect.runPromise(nightlySync.pipe(Effect.provide(makeRexLayer(env)))),
    );
  },
} satisfies ExportedHandler<Env>;
```

> **Verifying signatures:** Rex doesn't sign webhook requests. Protect the
> endpoint with a hard-to-guess path segment or a shared-secret query param
> you set on the subscription `url`, and reject anything that doesn't match
> before calling `ctx.waitUntil`.

## 3. The nightly e-tag sync (`scheduled`)

Webhooks are best-effort. The Cron Trigger re-pulls each service and diffs on
`etag`, so anything a missed/withheld delivery skipped still lands. It also
revives any subscription Rex marked unhealthy.

```typescript
// src/sync.ts
import { Effect } from "effect";
import {
  ListingsSearch,
  AdminWebhooksSearch,
  AdminWebhooksMarkAsHealthy,
} from "@smartretraining/rex-effect";

declare const knownEtag: (
  service: string,
  id: number,
) => Effect.Effect<string | undefined>;
declare const upsertRecord: (
  service: string,
  record: Record<string, unknown>,
) => Effect.Effect<void>;

// Walk a service in pages, upserting only rows whose etag changed.
const syncListings = Effect.gen(function* () {
  let offset = 0;
  const limit = 100;

  while (true) {
    const page = yield* ListingsSearch({ limit, offset });
    const rows = page.rows ?? [];
    if (rows.length === 0) break;

    yield* Effect.forEach(
      rows,
      (row) =>
        Effect.gen(function* () {
          const id = row.id as number;
          const etag = row.etag as string | undefined;
          const seen = yield* knownEtag("Listings", id);
          if (etag !== seen) {
            yield* upsertRecord("Listings", row as Record<string, unknown>);
          }
        }),
      { concurrency: 8 },
    );

    offset += limit;
  }
});

// Re-enable any webhook Rex marked unhealthy. Rex does NOT replay events
// missed while unhealthy — the etag sync above is what fills that gap.
interface WebhookSubscription {
  id: number;
  is_healthy?: boolean;
}

const reviveUnhealthyWebhooks = Effect.gen(function* () {
  // AdminWebhooksSearch ships no response example in Rex's introspection,
  // so its output schema is permissive (`Array<unknown> | null`).
  const rows = (yield* AdminWebhooksSearch({ limit: 100 })) ?? [];
  const subs = rows as WebhookSubscription[];

  yield* Effect.forEach(
    subs.filter((s) => s.is_healthy === false),
    (s) => AdminWebhooksMarkAsHealthy({ webhook_id: s.id }),
    { concurrency: 4 },
  );
});

export const nightlySync = Effect.all([syncListings, reviveUnhealthyWebhooks], {
  concurrency: 1,
});
```

`nightlySync` is wired into the Worker's `scheduled` handler in `worker.ts`
above; `wrangler.toml`'s `crons = ["0 3 * * *"]` fires it at 03:00 UTC.

## Local development

```bash
wrangler dev                       # serves fetch + scheduled locally
curl "http://localhost:8787/__scheduled"   # manually trigger the cron handler
```

## Payload reference

`decodeWebhookDelivery` returns a `WebhookDelivery`:

```
WebhookDelivery
└─ data: WebhookEvent[]
   ├─ id:         string            // delivery id
   ├─ type:       string            // e.g. "listings.updated"
   ├─ created_at: string            // ISO-8601
   └─ payload:    WebhookPayload     // discriminated on `format`
      ├─ format: "v1_full_change_detail"
      │  ├─ data.pre:  record | null  // null for "create" events
      │  ├─ data.post: record | null
      │  └─ context?:  WebhookContext
      └─ format: "v1_context_only"
         └─ context: WebhookContext   // { service, record_id, account_id, triggered_by_user }
```

Narrow on `payload.format` for fully-typed access to either shape. Record
snapshots are intentionally open (`Record<string, unknown>`) — narrow them
against the relevant generated `*Output` schema once you know
`context.service`.
