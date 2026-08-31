# @smartretraining/vaultre-effect

Effect-native SDK for the **[VaultRE](https://www.vaultre.com.au) API** (v1.3),
generated from the vendor's own published OpenAPI document.

```ts
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import * as Vaultre from "@smartretraining/vaultre-effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";

const listings = Stream.runCollect(
  Vaultre.getPropertiesLifeSale.items({ status: ["listing"], pagesize: 50 }),
).pipe(
  Effect.provide(
    Vaultre.fromApiKey({
      apiKey: process.env.VAULTRE_API_KEY!,
      accessToken: process.env.VAULTRE_ACCESS_TOKEN!,
    }),
  ),
  Effect.provide(FetchHttpClient.layer),
  Vaultre.Retry.throttling,
);
```

453 operations. 146 of them paginate.

## What is verified, and what is not

**The document is the vendor's, and it is a good one.** VaultRE publishes
[Swagger UI](https://docs.api.vaultre.com.au/swagger/index.html) over
[`vaultre.yaml`](https://docs.api.vaultre.com.au/swagger/vaultre.yaml), mirrored
verbatim at `specs/vaultre.yaml`. It is OpenAPI 3.0.1, it declares exactly one
server — the same origin this SDK defaults to — and it holds together where
vendor documents usually do not: 338 of its 356 component schemas are reachable
from a path, every operation carries a unique `operationId`, and 421 of 453
declare a typed JSON body. Nothing had to be transcribed or repaired to build
this package.

**No request in it has ever been made.** VaultRE issues keys to registered
integrators only, so every response schema here is the document's claim rather
than an observation.

Unlike `../boxdice`, the schemas are **not** deliberately widened. There is
nothing to widen: core emits every enum as `S.String` and every optional member
as optional (`codegen/emit.ts`), so an undocumented status or an absent field
already passes through at runtime. The enums are a compile-time hint, and a
value outside one is typed narrower than it is rather than rejected. The
document is passed through untouched — including where it contradicts itself,
which is listed below.

## Getting to verified

`test/live.test.ts` is the day-one checklist, already written. It skips itself
without credentials:

```bash
echo 'VAULTRE_API_KEY=…'      >> .env
echo 'VAULTRE_ACCESS_TOKEN=…' >> .env
bun run test
```

If the response side turns out to need repair rather than confirmation, copy
`../reapit/scripts/capture-samples.ts` — it records response **structure only**,
no values, so its output is safe to commit — and merge it over the document the
way `../reapit/scripts/build-spec.ts` does.

### Check these first

| Doubt | Why it matters |
| --- | --- |
| `status` is declared four ways | 9 values on a property, 9 on `LinkedProperty`, **8 on `SaleHistory`** (no `management`), and a 7-value `?status=` filter that includes `listingOrConditional` and excludes `settled`. At most one describes a real tenant. |
| `pagesize` has no documented maximum | It defaults to 50. A caller asking for 500 may quietly get 50 — count `items`, never assume. |
| The error body | `SuccessOrError` (`{ success, msg, code }`) covers 155 of the 177 declared 400s. `DELETE /properties/{id}/photos` answers something else entirely, so the shape is not universal. |
| 401 vs 403 on a scope failure | Scopes are granted per access token by the customer, so an operation can work for one agency and fail for another. Which status that is decides whether it retries. |
| The 32 operations with no declared JSON body | Mostly file and photo endpoints. They generate as `Unit`; if one of them actually returns JSON, it is being thrown away. |

## Things the API does that will surprise you

**Two secrets, owned by two different parties.** `X-Api-Key` is the
integrator's, issued once to the software. `Authorization: Bearer` is the
agency's, issued per account with the scopes that agency granted. Both go on
every request; one process syncing many agencies holds one key and many tokens.

**A property is not a listing.** A property record persists across every time
it goes to market, and each campaign is a *life*: `saleLifeId` and
`leaseLifeId` on the property point at them. Everything about a sale —
purchasers, owners, solicitors, offer conditions, portals, feedback — hangs off
`/properties/{id}/sale/{lifeid}/…`, not off the property.

**Two path segments are vocabulary, not ids.** `/properties/{class}/{salelease}/…`
takes `residential|commercial|business|rural|land|holidayRental` and
`sale|lease`. They are path labels; the SDK types them as open unions.

**The page envelope is not proof of pagination.** Twelve operations return
`{ items, totalItems, totalPages }` while accepting no `page` parameter —
`/user/teams` and `/properties/{id}/{salelease}/{lifeid}/hazards` among them.
They are complete lists wearing the envelope, and `.pages`/`.items` are
deliberately not generated for them (`scripts/generate.ts`).

**Nothing in a page says which page it is.** There is no `current`, and
`urls.next` is a fully-formed URL rather than a token. `src/pagination.ts`
counts its own pages and stops on `totalPages`.

**The quota is daily and it does not clear by waiting.** 10 requests/second and
10,000/day per key, resetting at 00:00 UTC, both answered with 429.
`Retry.throttling` recovers a burst; nothing recovers the day's quota, so watch
`getUsage` rather than the 429.

**Push exists.** VaultRE sends signed webhooks (`X-VaultRE-Signature`:
`t=<ms>,sha512=<hmac>` over the timestamp, a period and the **raw** body, keyed
with the API key) and also offers `GET /eventStream` for polling. The published
event catalogue names only `property.update` and `user.update`; the rest has to
come from VaultRE. Neither is wired up here.

## Layout

```
specs/vaultre.yaml        vendor OpenAPI document, mirrored verbatim
scripts/fetch-spec.ts     re-download it; the diff IS the vendor's change
scripts/convert.ts        openapi → .generated-specs/vaultre.json (smithy)
scripts/generate.ts       smithy → src/services/vaultre.ts
src/*.ts                  hand-written: credentials, protocol, errors,
                          pagination, retry, traits
test/                     offline: protocol, pagination, spec translation
test/live.test.ts         skipped until credentials exist
```

```bash
bun run specs:fetch   # only when checking for vendor drift
bun run convert && bun run generate && bun run typecheck && bun run test
```

## Credentials

```ts
Vaultre.fromApiKey({ apiKey, accessToken })              // one agency
Vaultre.fromApiKey({ apiKey, accessToken, apiBaseUrl })  // another region, if one appears
Vaultre.CredentialsFromEnv                               // VAULTRE_API_KEY + VAULTRE_ACCESS_TOKEN
```

The base URL carries the API version (`…/api/v1.3`) and the schemas in this
package were generated from the v1.3 document, so pointing it at v1.2 would
compile and then lie.

## Releasing

The `@smartretraining` packages share a single version line and ship together
from `.github/workflows/release-smartretraining.yml`, which refuses to run if
they disagree on the version or if it is already on the registry. That is why
this package has no `0.1.0` — it joins `rex-effect`, `reapit-effect` and
`boxdice-effect` on their existing line, at `0.9.0`.
