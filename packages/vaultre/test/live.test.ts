import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import type * as HttpClient from "effect/unstable/http/HttpClient";
import { describe, expect, it } from "vitest";
import { type Credentials, CredentialsFromEnv } from "../src/credentials.ts";
import {
  getAccountUsers,
  getPropertiesLifeSale,
  getUsage,
} from "../src/services/vaultre.ts";

/**
 * The checks to run the day a VaultRE key exists — and, until then, the list
 * of what this package has NOT verified.
 *
 * Nothing else in this suite touches the network. VaultRE issues keys to
 * registered integrators only, so every schema in `src/services` is the
 * vendor's word rather than an observation, and these are the assertions that
 * turn that word into evidence. They skip themselves without credentials.
 *
 * Set VAULTRE_API_KEY and VAULTRE_ACCESS_TOKEN (root .env or this package's)
 * and run `bun run test`.
 */
const credentialled =
  Boolean(process.env.VAULTRE_API_KEY) &&
  Boolean(process.env.VAULTRE_ACCESS_TOKEN);

const MainLayer = Layer.merge(CredentialsFromEnv, FetchHttpClient.layer);

const runEffect = <A, E>(
  effect: Effect.Effect<A, E, Credentials | HttpClient.HttpClient>,
): Promise<A> => Effect.runPromise(Effect.provide(effect, MainLayer));

/** Every property status the document declares, across all four of its lists. */
const DOCUMENTED_STATUSES = new Set([
  "prospect",
  "appraisal",
  "listing",
  "conditional",
  "unconditional",
  "settled",
  "management",
  "withdrawn",
  "withdrawnAppraisal",
]);

describe.skipIf(!credentialled)("VaultRE (live)", () => {
  it("decodes a page of sale properties", async () => {
    const page = await runEffect(getPropertiesLifeSale({ pagesize: 3 }));

    expect(Array.isArray(page.items)).toBe(true);
    expect(page.items.length).toBeLessThanOrEqual(3);
    expect(typeof page.totalPages).toBe("number");
  });

  it("returns the fields the CRM import needs on the listing itself", async () => {
    // The claim §3 of docs/prd/crm-import-parity.md makes about Vault, tested:
    // type, coordinates and status arrive on the row, with no second call.
    const page = await runEffect(getPropertiesLifeSale({ pagesize: 25 }));
    const life = page.items.find((item) => item.saleLifeId !== undefined);

    expect(life).toBeDefined();
    expect(life!.type?.name).toBeTypeOf("string");
    expect(life!.geolocation?.latitude).toBeTypeOf("number");
    expect(life!.status).toBeTypeOf("string");
  });

  it("reports every status it sends against the documented lists", async () => {
    // Not a failure if it does not hold — a value outside these lists decodes
    // fine (enums are compile-time only). It is the signal to correct the
    // document's lists with a patch, and it can only be gathered from a
    // tenant.
    const page = await runEffect(getPropertiesLifeSale({ pagesize: 100 }));
    const seen = new Set(
      page.items.map((item) => item.status).filter(Boolean) as string[],
    );
    const undocumented = [...seen].filter((s) => !DOCUMENTED_STATUSES.has(s));

    if (undocumented.length) {
      console.warn(
        `undocumented property statuses: ${undocumented.join(", ")}`,
      );
    }
    expect(seen.size).toBeGreaterThan(0);
  });

  it("reads the office's users, which is where a listing agent is matched", async () => {
    const page = await runEffect(getAccountUsers({ pagesize: 5 }));

    expect(page.items.length).toBeGreaterThan(0);
    expect(page.items[0]!.email ?? page.items[0]!.firstName).toBeDefined();
  });

  it("reports the day's quota", async () => {
    // 10,000 requests/day per key. A sync loop that does not watch this finds
    // out at midnight-UTC-minus-one-request.
    const usage = await runEffect(getUsage({}));

    expect(usage).toBeDefined();
  });
});
