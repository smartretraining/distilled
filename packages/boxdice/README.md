# @smartretraining/boxdice-effect

Effect-native SDK for the **Box+Dice AI API** — the CRM MRI Software sells as
[MRI Box and Dice](https://www.mrisoftware.com/au/products/box-and-dice/).

```ts
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import * as BoxDice from "@smartretraining/boxdice-effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";

const listings = Stream.runCollect(
  BoxDice.listSalesListings.pages({}).pipe(
    Stream.flatMap((page) => Stream.fromIterable(page.data ?? [])),
  ),
).pipe(
  Effect.provide(BoxDice.fromToken({ tenant: "acme", token: process.env.TOKEN! })),
  Effect.provide(FetchHttpClient.layer),
  BoxDice.Retry.throttling,
);
```

45 operations. 28 of them paginate.

## ⚠️ The response side is unverified

Read this before trusting a type.

Box+Dice publishes no OpenAPI document. Its documentation is
[API Blueprint](https://boxdiceaiapi.docs.apiary.io/) — Markdown with prose
attribute lists and JSON examples — mirrored here at `specs/boxdice-ai.apib`.
`scripts/build-spec.ts` transcribes it into `specs/openapi.json`, which the
usual distilled pipeline compiles.

**Nothing here has been run against a live tenant.** We have no API key, and
Box+Dice provisions them per agency through a partner arrangement. The request
side is solid — parameters, paths and body wrappers are stated plainly and
consistently. The response side is a careful reading of a document that
contradicts itself in places.

The design rule throughout is **when in doubt, widen**:

- every response member is optional and nullable
- no response enum is closed (documented values live in doc comments instead,
  so Box+Dice adding a 23rd contact-activity type is not our outage)
- outright type contradictions become `unknown` rather than a guess

A schema that decodes a superset of reality is recoverable. One that rejects a
real payload takes down a sync run.

## Getting to verified

Copy `../reapit/scripts/capture-samples.ts`. It calls each readable endpoint,
records response **structure only** — no values, so the output is safe to
commit — into `specs/observed.json`, and `build-spec.ts` merges that over the
transcribed response side. The request side should survive untouched.

### Resolve these first

Every item is a place the blueprint disagrees with itself. `grep UNRESOLVED
src/services/boxdice.ts` finds the two that are currently typed `unknown`.

| Member | Documented | Example sends | Modelled as |
| --- | --- | --- | --- |
| `Voucher.sale_price` | `Number` | `"431000.0"` | `unknown` |
| `CommissionDeduction.fixed_price` | `Number` | `false` | `unknown` |
| `SalesListing.auctioneer_id` | `Number` | `"2021-10-01"` | `integer` — the example is a paste of `auction_date` |
| `Consultant.active` | `Boolean` | `"status": "active"` | both members, both optional |
| `LeadAddress.unit`/`number`/`postcode` | `Number` on the lead-create body, `String` everywhere on the read side | — | as documented on each side, unreconciled |

Also worth a look on first contact:

- **Paths.** The blueprint heads three sections `/contact/{id}/…` (singular)
  while their own `next` URLs say `/contacts/…`. Modelled as plural, on the
  evidence of the URLs.
- **`gross_commission`.** The example shows `inc_gst: 0.11` on a $431,000 sale.
  The type is plausible; the value is not. Check whether these are dollars,
  or a rate.
- **Which API you get.** `/ai_api` is the default. The same host serves
  `/enquiry_api`, `/website_api` and `/plezzel_api` with overlapping surfaces,
  and the blueprint's `next` URLs mention `/aire_api/` and `/rebot_api/` too.
  Set `apiPath` if the key lands somewhere else.

## Things the API does that will surprise you

**Collections are replication feeds, not lists.** Records arrive oldest-first
by last-modified, and a record that changes after you have seen it **appears
again** later in the same traversal. Upsert by id; never insert.

**Deleted contacts arrive as tombstones** — `{ id: 7, status: "deleted" }` with
every other member absent, inline among full records. Branch on `status` before
reading anything else.

**The end of a feed is an HTTP 204, not a missing cursor.** Box+Dice keeps
returning `paging.next` and answers 204 with an empty body once you are caught
up. `src/protocol.ts` turns that into an empty page and `paginateAfter` ends
the stream on it; the API's own advice is to wait and re-request the same URL,
which is how a long-running sync stays live. Resume by passing the last cursor
back as `after`.

**`paging.next` is an absolute URL and is not always trustworthy.** We read the
`after` parameter out of it rather than following it, because the vendor's own
examples return URLs on partner paths a given key may not be provisioned for —
and one that names a different collection than the endpoint that produced it.

**Rate limits are per-endpoint** and `Retry-After` rides on 200s and 204s as
well as 429s (10s and 60s respectively by default). `Retry.throttling` honours
it on failures; the hint on a success is advisory pacing for your sync loop.

**`createTasks` can half-fail with a 200.** It answers with a bare array
positionally matching your request, each entry either `{ id }` or `{ errors }`.

**`createAppraisalLead` may silently create a task instead** — that is what
happens when the lead consultant has no Lead Flow module — and nothing in the
response says which one you got.

**`createContactCategory` with an unknown `name` creates a new category type**
in that office group. A typo becomes permanent. Prefer `type_id` from
`listContactCategoryTypes`.

## Layout

```
specs/boxdice-ai.apib     vendor blueprint, mirrored verbatim
scripts/build-spec.ts     blueprint → specs/openapi.json  (the transcription)
scripts/convert.ts        openapi → .generated-specs/boxdice.json (smithy)
scripts/generate.ts       smithy → src/services/boxdice.ts
src/*.ts                  hand-written: credentials, protocol, errors,
                          pagination, retry, traits
test/                     offline: fixture decoding + cursor traversal
```

```bash
bun run convert && bun run generate && bun run typecheck && bun test
```

## Credentials

Per agency, not per integration — the tenant subdomain is part of the
credential, so a multi-agency sync builds one layer per agency rather than
swapping a token.

```ts
BoxDice.fromToken({ tenant: "acme", token: "..." })          // ordinary case
BoxDice.fromToken({ origin: "https://acme.example", token }) // off-domain
BoxDice.CredentialsFromEnv                                   // BOXDICE_TENANT + BOXDICE_API_TOKEN
```

## Releasing

The `@smartretraining` packages share a single version line and ship together
from `.github/workflows/release-smartretraining.yml`, which refuses to run if
they disagree on the version or if it is already on the registry. That is why
this package never had a `0.1.0` — it joins `rex-effect` and `reapit-effect`
on their existing line.

Publishing uses npm trusted publishing (OIDC), so no npm token exists in the
repository or on any developer machine. A package has to exist on the registry
before a trusted publisher can be configured for it, so `0.7.0` was published
once by hand to bootstrap that; every release since runs from the workflow,
which is why the line's first workflow release including this package is
`0.8.0`. Do not install `0.7.0` — it is the bootstrap, and it is the one
version of this package with no provenance attestation.
