#!/usr/bin/env bun
/**
 * capture-samples — learn the Reapit API's real response shapes.
 *
 * The vendor OpenAPI document describes its responses badly: only 9 of its
 * 141 component schemas are referenced from any path, most collection
 * payloads are typed `items: { type: "object" }` (i.e. `unknown[]`), and the
 * page metadata is declared `integer` when the wire sends JSON strings
 * (`"6894"`). Generating straight from it yields operations that typecheck
 * and return nothing useful — or worse, fail to decode at runtime.
 *
 * So we observe the API instead. This script calls each readable endpoint,
 * writes the raw bodies to `.samples/` (gitignored — they contain real
 * records from whichever account the credentials belong to), and distils
 * them into `specs/observed.json`, which records ONLY structure:
 *
 *   { "getListings": { "kind": "object", "properties": {
 *       "items": { "kind": "string" },
 *       "listings": { "kind": "array", "items": { ... } } } } }
 *
 * No values, no enums, no examples — nothing that could carry personal data
 * — so `specs/observed.json` is safe to commit and makes `build-spec.ts`
 * reproducible without API access.
 *
 * Usage:
 *   REAPIT_CLIENT_ID=... REAPIT_API_KEY=... bun scripts/capture-samples.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import * as path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const sampleDir = path.join(root, ".samples");

const clientId = process.env.REAPIT_CLIENT_ID;
const apiKey = process.env.REAPIT_API_KEY;
const baseUrl =
  process.env.REAPIT_API_BASE_URL ?? "https://api.agentboxcrm.com.au";

if (!clientId || !apiKey) {
  console.error("REAPIT_CLIENT_ID and REAPIT_API_KEY are required");
  process.exit(1);
}

/**
 * Readable endpoints, keyed by the operationId `build-spec.ts` assigns.
 * `query` supplies whatever the endpoint requires beyond `version`
 * (`/suburbs` rejects a bare call: "Please specify one of postcode,
 * suburbName, state or region"). `limit` is kept small — we want shapes,
 * not data.
 */
const ENDPOINTS: ReadonlyArray<{
  readonly operationId: string;
  readonly path: string;
  readonly query?: Record<string, string>;
  /**
   * Extra query variants to call and merge into the same observation.
   *
   * Optionality is only as good as the variation we see. A single call
   * returns records that happen to share keys, and merging identical shapes
   * marks EVERY field required — so one listing missing one key would fail
   * to decode. These variants deliberately disagree with each other:
   * `include=all` adds expanded members that are absent by default, and
   * later pages hold records of other types (Sale vs Lease, company vs
   * person) with different fields populated. Anything not present in all of
   * them becomes optional.
   */
  readonly variants?: ReadonlyArray<Record<string, string>>;
  /**
   * Detail endpoints need a real id. `from` names a collection captured
   * earlier in this list; the first record's `id` is substituted for `{id}`
   * in `path`. Ids are never written to `specs/observed.json` — only the
   * shape of the response is.
   */
  readonly from?: { readonly operationId: string; readonly collection: string };
}> = [
  {
    operationId: "getListings",
    path: "/listings",
    query: { limit: "25" },
    variants: [
      { limit: "25", include: "all" },
      { limit: "25", page: "7" },
      { limit: "25", "filter[type]": "Sale" },
      { limit: "25", "filter[type]": "Lease" },
    ],
  },
  {
    operationId: "getContacts",
    path: "/contacts",
    query: { limit: "25" },
    variants: [
      { limit: "25", include: "all" },
      { limit: "25", page: "11" },
      { limit: "25", "filter[type]": "Company" },
    ],
  },
  {
    operationId: "getStaff",
    path: "/staff",
    query: { limit: "25" },
    variants: [
      { limit: "25", include: "all" },
      { limit: "25", page: "3" },
    ],
  },
  {
    operationId: "getOffices",
    path: "/offices",
    query: { limit: "25" },
    variants: [{ limit: "25", include: "all" }],
  },
  {
    operationId: "getSearchRequirements",
    path: "/search-requirements",
    query: { limit: "25" },
    variants: [
      { limit: "25", include: "all" },
      { limit: "25", page: "9" },
    ],
  },
  { operationId: "getRegions", path: "/regions", query: { limit: "5" } },
  // `/suburbs` refuses a bare call. Its error names the parameters without
  // their prefix ("Please specify one of postcode, suburbName, state or
  // region") but only the `filter[...]` forms are actually accepted.
  {
    operationId: "getSuburbs",
    path: "/suburbs",
    query: { "filter[state]": "NSW", limit: "5" },
  },
  { operationId: "getPropertyTypes", path: "/property-types" },
  { operationId: "getContactClasses", path: "/contact-classes" },
  { operationId: "getContactSources", path: "/contact-sources" },
  { operationId: "getEnquiryTypes", path: "/enquiry-types" },
  { operationId: "getEnquirySources", path: "/enquiry-sources" },
  { operationId: "getEnquiryInterestLevels", path: "/enquiry-interest-levels" },
  { operationId: "getSubscriptions", path: "/subscription" },
  // Detail endpoints, resolved against an id from the collection above.
  {
    operationId: "getListing",
    path: "/listings/{id}",
    query: { include: "all" },
    from: { operationId: "getListings", collection: "listings" },
  },
  {
    operationId: "getContact",
    path: "/contacts/{id}",
    query: { include: "all" },
    from: { operationId: "getContacts", collection: "contacts" },
  },
  {
    operationId: "getOffice",
    path: "/offices/{id}",
    from: { operationId: "getOffices", collection: "offices" },
  },
  {
    operationId: "getStaffMember",
    path: "/staff/{id}",
    from: { operationId: "getStaff", collection: "staffMembers" },
  },
  {
    operationId: "getSearchRequirement",
    path: "/search-requirements/{id}",
    from: {
      operationId: "getSearchRequirements",
      collection: "searchRequirements",
    },
  },
];

/** A structure-only description of an observed JSON value. */
type Observed =
  | { kind: "string" | "boolean" | "number" | "null" | "unknown" }
  | { kind: "array"; items?: Observed }
  | {
      kind: "object";
      properties: Record<string, Observed>;
      /** Keys absent from at least one observed instance. */
      optional: string[];
    };

/** Describe one value's structure, discarding its contents. */
const observe = (value: unknown): Observed => {
  if (value === null) return { kind: "null" };
  if (Array.isArray(value)) {
    const items = value
      .map(observe)
      .reduce<Observed | undefined>(
        (acc, cur) => (acc ? merge(acc, cur) : cur),
        undefined,
      );
    return items ? { kind: "array", items } : { kind: "array" };
  }
  switch (typeof value) {
    case "string":
      return { kind: "string" };
    case "boolean":
      return { kind: "boolean" };
    case "number":
      return { kind: "number" };
    case "object": {
      const properties: Record<string, Observed> = {};
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        properties[k] = observe(v);
      }
      return { kind: "object", properties, optional: [] };
    }
    default:
      return { kind: "unknown" };
  }
};

/**
 * Combine two observations of the same position. Objects union their keys,
 * and any key missing from either side is recorded as optional — which is
 * how we learn that `include=`-expanded members and empty-string fields are
 * not always present.
 */
const merge = (a: Observed, b: Observed): Observed => {
  if (a.kind === "null") return b.kind === "null" ? a : b;
  if (b.kind === "null") return a;
  if (a.kind !== b.kind) return { kind: "unknown" };

  if (a.kind === "array" && b.kind === "array") {
    const items =
      a.items && b.items ? merge(a.items, b.items) : (a.items ?? b.items);
    return items ? { kind: "array", items } : { kind: "array" };
  }

  if (a.kind === "object" && b.kind === "object") {
    const properties: Record<string, Observed> = {};
    const optional = new Set([...a.optional, ...b.optional]);
    for (const key of new Set([
      ...Object.keys(a.properties),
      ...Object.keys(b.properties),
    ])) {
      const av = a.properties[key];
      const bv = b.properties[key];
      if (av && bv) properties[key] = merge(av, bv);
      else {
        properties[key] = (av ?? bv)!;
        optional.add(key);
      }
    }
    return { kind: "object", properties, optional: [...optional].sort() };
  }

  return a;
};

await mkdir(sampleDir, { recursive: true });

const observed: Record<string, Observed> = {};
const failures: string[] = [];
/** Payloads kept in memory so detail endpoints can borrow a real id. */
const payloads: Record<string, unknown> = {};

for (const endpoint of ENDPOINTS) {
  let endpointPath = endpoint.path;

  if (endpoint.from) {
    const source = payloads[endpoint.from.operationId] as
      | Record<string, unknown>
      | undefined;
    const rows = source?.[endpoint.from.collection];
    const first = Array.isArray(rows) ? rows[0] : undefined;
    const id =
      first && typeof first === "object"
        ? (first as Record<string, unknown>).id
        : undefined;

    if (typeof id !== "string" && typeof id !== "number") {
      failures.push(
        `${endpoint.operationId} (no id from ${endpoint.from.operationId})`,
      );
      console.error(`   ✗ ${endpoint.operationId}: no id available`);
      continue;
    }
    endpointPath = endpointPath.replace("{id}", encodeURIComponent(String(id)));
  }

  const fetchOne = async (query) => {
    const url = new URL(baseUrl + endpointPath);
    url.searchParams.set("version", "2");
    for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);

    const res = await fetch(url, {
      headers: {
        "X-Client-ID": clientId,
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
    });
    const body = await res.json().catch(() => undefined);
    return { body: res.ok ? body : undefined, status: res.status };
  };

  const queries = [endpoint.query ?? {}, ...(endpoint.variants ?? [])];
  let shape: Observed | undefined;
  let primary: unknown;
  let ok = 0;
  let lastStatus = 0;

  for (const [i, query] of queries.entries()) {
    const result = await fetchOne(query);
    lastStatus = result.status;
    if (result.body === undefined) continue;

    // Only the canonical call is kept on disk; the variants exist to widen
    // optionality, not to accumulate records.
    if (i === 0) {
      await writeFile(
        path.join(sampleDir, `${endpoint.operationId}.json`),
        JSON.stringify(result.body, null, 2),
      );
    }

    // Record the shape INSIDE the `response` envelope — that is what the
    // protocol hands to the output schema.
    const body = result.body;
    const payload =
      typeof body === "object" && body !== null && "response" in body
        ? (body as { response: unknown }).response
        : body;

    if (i === 0) primary = payload;
    const observation = observe(payload);
    shape = shape ? merge(shape, observation) : observation;
    ok++;
  }

  if (shape === undefined) {
    failures.push(`${endpoint.operationId} (HTTP ${lastStatus})`);
    console.error(`   ✗ ${endpoint.operationId}: HTTP ${lastStatus}`);
    continue;
  }

  payloads[endpoint.operationId] = primary;
  observed[endpoint.operationId] = shape;
  console.log(
    `   ✓ ${endpoint.operationId}` +
      (queries.length > 1 ? ` (${ok}/${queries.length} variants)` : ""),
  );
}

await writeFile(
  path.join(root, "specs/observed.json"),
  `${JSON.stringify(observed, null, 2)}\n`,
);

console.log(
  `\n📐 wrote specs/observed.json — ${Object.keys(observed).length} operation(s)`,
);
console.log(`   raw bodies in .samples/ (gitignored)`);
if (failures.length) {
  console.error(
    `\n⚠️  ${failures.length} endpoint(s) failed: ${failures.join(", ")}`,
  );
  process.exit(1);
}
