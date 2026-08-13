# @smartretraining/reapit-effect

Effect-native SDK for the **Reapit Sales API** (Agentbox), with exhaustive error typing.

```bash
bun add @smartretraining/reapit-effect effect
```

## Usage

```ts
import * as Effect from "effect/Effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as Layer from "effect/Layer";
import * as Reapit from "@smartretraining/reapit-effect";

const program = Effect.gen(function* () {
  const page = yield* Reapit.getListings({ limit: 10, filterType: "Sale" });
  return page.listings;
});

Effect.runPromise(
  program.pipe(
    Effect.provide(Layer.merge(Reapit.CredentialsFromEnv, FetchHttpClient.layer)),
  ),
);
```

### Credentials

`REAPIT_CLIENT_ID` and `REAPIT_API_KEY` are required; `REAPIT_API_BASE_URL` and
`REAPIT_API_VERSION` (`"1"` or `"2"`, default `"2"`) are optional.

```ts
Reapit.CredentialsFromEnv;
Reapit.fromApiKey({ clientId: "...", apiKey: "..." });
```

**API keys are IP-restricted.** Reapit only accepts a key from the addresses
registered against it, so a correct key from an unlisted address returns
`401 Unauthorized` with "Api Key does not exists".

### Pagination

Collection operations expose `.pages` (stream of pages) and `.items` (stream of
records) alongside the plain call:

```ts
import * as Stream from "effect/Stream";

// Every contact, one at a time.
Reapit.getContacts.items({ limit: 100 }).pipe(
  Stream.runForEach((contact) => Effect.log(contact.email)),
);
```

Reapit numbers pages with `page`/`limit` and answers with `items` (total record
count), `current`, and `last`. The traversal stops on `last` rather than probing
past the end.

### Errors

Every operation's error channel is typed. Alongside the shared HTTP classes
(`NotFound`, `UnprocessableEntity`, `Unauthorized`, …) there are three
Reapit-specific ones:

| Error | Raised when |
| --- | --- |
| `ReapitApiError` | The API returned a structured `{ code, title, detail }` failure. Carries every error the response listed, not just the first. |
| `ReapitVersionError` | The `version` query parameter was rejected (code 300). |
| `UnknownReapitError` | Nothing else matched. |

```ts
Reapit.getListing({ listingId: "12P0168" }).pipe(
  Effect.catch("NotFound", () => Effect.succeed(null)),
);
```

## A note on types

**Every scalar this API returns is a JSON string.** Not just ids like
`"12P0168"` — the page counters too:

```json
{ "response": { "items": "6894", "current": "1", "last": "2298", "contacts": [ … ] } }
```

The vendor OpenAPI document declares `items`/`current`/`last` as `integer`. A
schema built from that claim does not merely mislead — it **fails to decode**
every real response. So the generated schemas type these as `string`, matching
the wire. Convert at the edge:

```ts
const total = Number(page.items);
```

Booleans are the one exception; they arrive as real JSON booleans.

### Filters

Reapit's filters are bracketed query parameters. They surface as camelCase —
`filter[memberId]` is `filterMemberId` — and the bracketed form is what goes
over the wire:

```ts
Reapit.getListings({ filterType: "Lease", filterMemberId: "1stf0142" });
// GET /listings?version=2&filter[type]=Lease&filter[memberId]=1stf0142
```

One trap worth knowing: `/suburbs` requires a filter and its own 422 message
names them *without* the prefix ("Please specify one of postcode, suburbName,
state or region"), but only the `filter[...]` forms are accepted — so it is
`filterState`, not `state`.

## How this package is generated

The vendor document is strong on the request side — it documents every filter,
and there are many — and unusable on the response side: only 9 of its 141
component schemas are referenced from any path, so payloads type as `unknown[]`.

Rather than trust it, the response schemas are derived from the API itself:

```
scripts/capture-samples.ts   → calls each readable endpoint, records STRUCTURE
                               ONLY into specs/observed.json (no values, no
                               examples — nothing that could carry personal
                               data). Raw bodies land in .samples/, gitignored.
scripts/build-spec.ts        → vendor request side + observed response side
                               → specs/openapi.json
scripts/convert.ts           → OpenAPI → Smithy (.generated-specs/reapit.json)
scripts/generate.ts          → Smithy → src/services/reapit.ts
```

Regenerate without touching the API (`specs/observed.json` is committed):

```bash
bun run convert && bun run generate
```

Re-observe the API when it changes:

```bash
bun run specs:capture
```

## Coverage

26 operations across contacts, listings, enquiries, offices, staff, search
requirements, subscriptions, and the lookup lists. Response schemas for 19 of
them are derived from observed responses; the remaining 7 are the write paths
(`createContact`, `updateContact`, `createEnquiry`, `createSearchRequirement`,
`updateSearchRequirement`, `deleteSearchRequirement`,
`updateContactSubscriptions`), whose schemas come from the vendor document —
they cannot be observed without creating records.

The live API also exposes roughly twenty endpoints absent from the vendor
document entirely (`/tasks`, `/notes`, `/offers`, `/leads`, `/inspections`,
`/projects`, `/appointments`, `/webhook-subscriptions`, …). They answer
`400 "The method GET is not allowed"` rather than `404`, so they exist but are
write-only, and their request shapes are not documented anywhere available.
They are not yet modelled here.

## Testing

The suite runs against a live account:

```bash
REAPIT_CLIENT_ID=... REAPIT_API_KEY=... bun run test
```

The tests are read-only — nothing is created, updated, or deleted.
