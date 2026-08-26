# @smartretraining/rex-effect

Effect-native SDK for the [Rex Software](https://www.rexsoftware.com/) real-estate API.

Rex ships no static OpenAPI document — it self-describes through introspection
endpoints. This package scrapes that introspection, transforms it into a
standard OpenAPI 3.1 document, and generates Effect operations from it with the
same generator used by the other `@distilled.cloud/*` SDKs.

## Installation

```bash
npm install @smartretraining/rex-effect effect
```

## Quick Start

```typescript
import { Effect, Layer } from "effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { CredentialsFromEnv } from "@smartretraining/rex-effect";
import { listingsSearch } from "@smartretraining/rex-effect";

const RexLive = Layer.merge(FetchHttpClient.layer, CredentialsFromEnv);

const program = Effect.gen(function* () {
  const page = yield* listingsSearch({ limit: 10 });
  return page.rows ?? [];
});

const rows = await Effect.runPromise(program.pipe(Effect.provide(RexLive)));
```

Every operation is a function `Op(input) => Effect<Output, Error, ...>`. The
Rex `{ result, error, correlation }` envelope is unwrapped automatically by the
client — generated output schemas describe just the inner `result` payload.

### Single-import, tree-shakeable client

For one import that exposes every operation, use a namespace import. Bundlers
statically analyse namespace member access, so only the operations you actually
call are kept:

```typescript
import * as rex from "@smartretraining/rex-effect/rex";

rex.listingsSearch({ limit: 10 });
rex.propertiesCreate({ /* ... */ });
```

`import * as rex from "@smartretraining/rex-effect"` works too — same operations, plus
`Category`, `Retry`, the error types, and credentials helpers.

## Configuration

Rex uses session-token auth, not a static API key. Provide credentials one of
three ways:

```bash
# Option A — you already hold a session token
REX_API_TOKEN=your-session-token

# Option B — email + password; the SDK performs the login exchange
REX_EMAIL=you@example.com
REX_PASSWORD=your-password

# Required — X-App-Identifier sent on every request, following Rex's
# "Integration:Company:Service" convention. There is deliberately no
# default: a stable per-integration value is a prerequisite for Rex
# Verified Integrator status, and a fallback would misattribute your
# traffic.
REX_APP_IDENTIFIER=Integration:YourCompany:your-service

# Optional — override the API origin (defaults to https://api.rexsoftware.com)
REX_API_BASE_URL=https://api.rexsoftware.com
```

- `CredentialsFromEnv` — reads the variables above (prefers `REX_API_TOKEN`).
- `CredentialsFromToken(token, { appIdentifier, apiBaseUrl? })` — build a
  layer from a token.
- Construct the `Credentials` service directly.

## Receiving webhooks

The generated `AdminWebhooks*` operations manage webhook *subscriptions*
(create, update, search, `markAsHealthy`, etc.). Decoding the inbound HTTP
`POST` body Rex sends to your callback URL is a separate concern — Rex's
introspection has no schema for it, so the delivery payload is hand-modelled
in `@smartretraining/rex-effect/Webhooks`.

```typescript
import { Effect } from "effect";
import { decodeWebhookDelivery } from "@smartretraining/rex-effect";

// inside your HTTP handler:
const delivery = yield* decodeWebhookDelivery(await req.json());

for (const event of delivery.data) {
  if (event.payload.format === "v1_full_change_detail") {
    event.payload.data.post; // current record state
    event.payload.data.pre;  // previous state, or null on "create" events
  } else {
    // v1_context_only — fetch the record yourself
    const { service, record_id } = event.payload.context;
  }
}
```

`decodeWebhookDelivery` fails with `RexParseError` if the body doesn't match.
The payload is a discriminated union on `payload.format`
(`v1_full_change_detail` vs `v1_context_only`), so narrowing on it gives you
fully-typed access to either shape.

See [`docs/admin-webhooks.md`](./docs/admin-webhooks.md) for a full
Effect-based sync handler on **Cloudflare Workers** — subscribe, a fast-ack
`fetch` delivery handler (`ctx.waitUntil`), a `scheduled` nightly e-tag
backstop (Cron Trigger), and unhealthy-webhook recovery — following Rex's
recommended approach.

## Regenerating the SDK

Operations in `src/services/` are generated. To regenerate or extend them:

### 1. Scrape Rex introspection

```bash
bun run specs:scrape
```

Requires `REX_API_TOKEN`, or `REX_EMAIL` + `REX_PASSWORD`, in the environment.
Writes `specs/rex/{Service}.describe.json`, `specs/rex/{Service}.describeModel.json`,
and `specs/rex/_catalog.json`.

### 2. Generate

```bash
bun run generate
```

This chains three steps:

1. `scripts/build-openapi.ts` — transforms the scraped `specs/rex/*.describe.json`
   files into a single OpenAPI 3.1 document at `specs/openapi.generated.json`.
2. `scripts/generate.ts` — runs the shared `@distilled.cloud/core` OpenAPI
   generator over that document, emitting one module per Rex method into
   `src/services/` and rewriting the `index.ts` barrel.
3. `oxlint --fix` + `oxfmt` — lint and format the generated code.

Re-running `bun run generate` with unchanged specs is idempotent.

### Adding more Rex services

Rex has ~272 services. This package generates **Listings**, **Properties**,
**AdminWebhooks**, **Feedback**, **Contacts**, **Notes**, **Contracts** and
**AdminValueLists**. To add another:

1. Append the service name to the `SERVICES` array in `scripts/scrape-specs.ts`.
2. Run `bun run specs:scrape` then `bun run generate`.

**Diff `specs/rex/` before committing a re-scrape.** Rex's introspection
drifts in both directions and neither direction announces itself. Measured
against a fully-privileged account in August 2026: `Contacts::create` and
`::update` had GAINED fields (4.5KB → 6.5KB of typed parameters), while
`Properties::create` and `::update` had LOST theirs entirely — 13KB of
definition replaced by `"type": "unknown"`, with no error and no deprecation.
Committing that blind would have silently reduced `propertiesCreate` to an
untyped blob for every consumer. Take the additions; leave a service whose
`data` block collapsed at its committed spec until Rex restores it.

`build-openapi.ts` globs every `specs/rex/*.describe.json` file, so new services
flow through automatically. Note: removing a service does not delete its stale
`src/services/*.ts` files — prune those by hand.

## Known limitations

- Output schemas are inferred from the example records embedded in Rex's
  `describe` payloads. Methods that ship no example get a permissive schema.
  Every inferred field is treated as nullable, since one example can't prove a
  field is never `null`.
- `search.criteria` is an opaque `object` in Rex's `openapi` block. The real
  query surface lives in `{Service}.describeModel.json` (`searchable_fields`)
  and is not yet folded into the generated input schemas.
- Rex returns logical failures as HTTP 200 with a non-null envelope `error`.
  These surface as a `RexApiError` defect rather than a typed error channel —
  see the note in `src/client.ts`.

## License

MIT
