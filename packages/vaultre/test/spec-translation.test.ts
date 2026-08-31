import * as Effect from "effect/Effect";
import { describe, expect, it } from "vitest";
import {
  getPropertiesLifeSale,
  getPropertyCustomFields,
  getPropertySaleHistory,
  getPropertySolicitors,
} from "../src/services/vaultre.ts";
import { json, stubClient } from "./setup.ts";

/**
 * What the OpenAPI→Smithy conversion decided, pinned.
 *
 * These are not tests of VaultRE — no account exists to test against — but of
 * the translation. Each one guards a specific thing that would go silently
 * wrong if the converter, the document or `scripts/convert.ts` changed.
 */
describe("VaultRE spec translation", () => {
  /** One page of `/properties/sale`, decoded through the real protocol. */
  const oneListing = (item: Record<string, unknown>) => {
    const stub = stubClient(() =>
      json({ items: [item], totalItems: 1, totalPages: 1 }),
    );
    return Effect.runPromise(
      getPropertiesLifeSale({ pagesize: 1 }).pipe(Effect.provide(stub.layer)),
    ).then((page) => page.items[0]!);
  };

  it("flattens the PropertyLife allOf into the members an import reads", async () => {
    // PropertyLife is `allOf: [ResidentialProperty, CommercialProperty]`, each
    // of which is itself `allOf: [Property, …]`. Everything the CRM import
    // needs arrives through that nesting — a converter that stopped at the
    // first level would leave this shape empty and every member undefined.
    const life = await oneListing({
      id: 4211,
      saleLifeId: 9902,
      class: { id: 1, name: "Residential", internalName: "residential" },
      type: { id: 12, name: "Townhouse" },
      geolocation: {
        latitude: -27.4705,
        longitude: 153.026,
        accuracy: "ROOFTOP",
      },
      status: "listing",
      portalStatus: "listing",
      contactStaff: [{ id: 88 }],
      displayAddress: "12 Example St, Brisbane",
    });

    expect(life.saleLifeId).toBe(9902);
    expect(life.type?.name).toBe("Townhouse");
    expect(life.geolocation?.latitude).toBeCloseTo(-27.4705);
    expect(life.status).toBe("listing");
    expect(life.contactStaff?.[0]?.id).toBe(88);
  });

  it("decodes a status the document does not list", async () => {
    // Enums are a COMPILE-TIME hint here: core emits every one as `S.String`
    // (`codegen/emit.ts`). That matters because the document contradicts
    // itself — `status` is 9 values on a property and 8 on `SaleHistory` —
    // so at least one tenant value is going to be outside its list. It
    // arrives; it is simply typed narrower than it is.
    const life = await oneListing({ id: 1, status: "aStateNobodyDocumented" });

    expect(life.status).toBe("aStateNobodyDocumented");
  });

  it("builds the multi-segment property paths", async () => {
    // `/properties/{class}/{salelease}/{id}/custom` puts two vocabulary
    // words in the path. They are path LABELS, not query parameters, and
    // getting that wrong 404s every call to this half of the API.
    const stub = stubClient(() =>
      json({ items: [], totalItems: 0, totalPages: 0 }),
    );

    await Effect.runPromise(
      getPropertyCustomFields({
        class: "residential",
        salelease: "sale",
        id: 4211,
      }).pipe(Effect.provide(stub.layer)),
    );

    expect(stub.calls[0]!.url).toBe(
      "https://ap-southeast-2.api.vaultre.com.au/api/v1.3/properties/residential/sale/4211/custom",
    );
  });

  it("reads both solicitors off the one unenveloped response", async () => {
    // The sale-import equivalent of #188: purchaser and vendor solicitors
    // come back together, and NOT inside the `{ items, totalPages }` page
    // envelope every collection uses. A converter that assumed the envelope
    // would type this as a page of nothing.
    const stub = stubClient(() =>
      json({
        purchaser: { id: 1, firstName: "Ada", lastName: "Byron" },
        vendor: { id: 2, firstName: "Grace", lastName: "Hopper" },
      }),
    );

    const solicitors = await Effect.runPromise(
      getPropertySolicitors({ id: 4211, lifeid: 9902 }).pipe(
        Effect.provide(stub.layer),
      ),
    );

    expect(solicitors.purchaser?.firstName).toBe("Ada");
    expect(solicitors.vendor?.lastName).toBe("Hopper");
  });

  it("keeps the sale's dates and commission splits on saleHistory", async () => {
    // `SaleHistory` is where a Vault sale import gets its dates, its price
    // and — through `commissionSplits[].user` — the selling agent that the
    // AgentBox import has to leave empty.
    const stub = stubClient(() =>
      json({
        items: [
          {
            lifeId: 9902,
            contractNumber: "C-1042",
            conditional: "2026-07-01T00:00:00Z",
            unconditional: "2026-07-21T00:00:00Z",
            settlement: "2026-08-30T00:00:00Z",
            salePrice: 815000,
            status: "unconditional",
            commissionSplits: [
              { id: 5, user: { id: 88, firstName: "Ada" }, grossPercent: 60 },
            ],
          },
        ],
        totalItems: 1,
        totalPages: 1,
      }),
    );

    const history = await Effect.runPromise(
      getPropertySaleHistory({ propertyid: 4211 }).pipe(
        Effect.provide(stub.layer),
      ),
    );

    const sale = history.items[0]!;
    expect(sale.unconditional).toBe("2026-07-21T00:00:00Z");
    expect(sale.salePrice).toBe(815000);
    expect(sale.commissionSplits?.[0]?.user?.id).toBe(88);
  });
});
