#!/usr/bin/env bun
/**
 * build-spec — assemble a usable OpenAPI document for the Reapit Sales API.
 *
 * The vendor document (`specs/openapi.vendor.json`) is good on the REQUEST
 * side — it documents every filter, and there are a lot of them — and close
 * to useless on the RESPONSE side:
 *
 *   • only 9 of its 141 component schemas are referenced from any path;
 *     the other 132 are orphans, so payloads type as `unknown[]`
 *   • page metadata is declared `integer`, but the wire sends JSON strings
 *     (`"6894"`) — an `integer` schema fails to DECODE at runtime, which is
 *     strictly worse than being untyped
 *   • the `{ "response": ... }` envelope is modelled on some operations and
 *     omitted on others, though the live API is uniform
 *   • no operation carries an `operationId`
 *
 * So this script keeps the vendor request side and replaces the response
 * side with what the API actually returns, recorded structurally in
 * `specs/observed.json` by `scripts/capture-samples.ts`.
 *
 * Input:  specs/openapi.vendor.json, specs/observed.json
 * Output: specs/openapi.json  (consumed by scripts/convert.ts)
 *
 * Usage: bun scripts/build-spec.ts
 */
import { readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";

const root = path.resolve(import.meta.dir, "..");

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;

// ============================================================================
// Operation naming
// ============================================================================

/**
 * `method path` → operationId. Spelled out rather than derived: there are
 * only 26 operations, the irregular ones (`PUT /subscribe`, `GET
 * /subscription`) defeat any rule, and these names are the package's public
 * surface — they should not shift because a heuristic was tweaked.
 */
const OPERATION_IDS: Readonly<Record<string, string>> = {
  "get /contact-classes": "getContactClasses",
  "get /contact-sources": "getContactSources",
  "get /contacts": "getContacts",
  "post /contacts": "createContact",
  "get /contacts/{contactId}": "getContact",
  "put /contacts/{contactId}": "updateContact",
  "post /enquiries": "createEnquiry",
  "get /enquiry-interest-levels": "getEnquiryInterestLevels",
  "get /enquiry-sources": "getEnquirySources",
  "get /enquiry-types": "getEnquiryTypes",
  "get /listings": "getListings",
  "get /listings/{listingId}": "getListing",
  "get /offices": "getOffices",
  "get /offices/{officeId}": "getOffice",
  "get /property-types": "getPropertyTypes",
  "get /regions": "getRegions",
  "get /search-requirements": "getSearchRequirements",
  "post /search-requirements": "createSearchRequirement",
  "get /search-requirements/{searchRequirementId}": "getSearchRequirement",
  "put /search-requirements/{searchRequirementId}": "updateSearchRequirement",
  "delete /search-requirements/{searchRequirementId}":
    "deleteSearchRequirement",
  "get /staff": "getStaff",
  "get /staff/{memberId}": "getStaffMember",
  "put /subscribe": "updateContactSubscriptions",
  "get /subscription": "getSubscriptions",
  "get /suburbs": "getSuburbs",
};

/** Headers/params the protocol layer supplies; never an operation input. */
const PROTOCOL_PARAMS = new Set([
  "X-Client-ID",
  "X-API-Key",
  "Authorization",
  "version",
]);

// ============================================================================
// observed.json → JSON Schema
// ============================================================================

type Observed =
  | { kind: "string" | "boolean" | "number" | "null" | "unknown" }
  | { kind: "array"; items?: Observed }
  | {
      kind: "object";
      properties: Record<string, Observed>;
      optional: string[];
    };

/**
 * Translate an observation into JSON Schema.
 *
 * Everything scalar becomes `string`, because that is what Reapit sends —
 * across all 14 captured endpoints not one numeric JSON value appeared,
 * only strings and booleans. Declaring these `integer` is what makes the
 * vendor document undecodable.
 */
const toSchema = (o: Observed): Json => {
  switch (o.kind) {
    case "string":
      return { type: "string" };
    case "boolean":
      return { type: "boolean" };
    case "number":
      return { type: "number" };
    case "array":
      return { type: "array", items: o.items ? toSchema(o.items) : {} };
    case "object": {
      const properties: Json = {};
      for (const [k, v] of Object.entries(o.properties)) {
        properties[k] = toSchema(v);
      }
      const optional = new Set(o.optional);
      const required = Object.keys(o.properties).filter(
        (k) => !optional.has(k),
      );
      const schema: Json = { type: "object", properties };
      if (required.length) schema.required = required;
      return schema;
    }
    default:
      // `null`/`unknown` — an empty schema accepts anything, which is honest.
      return {};
  }
};

// ============================================================================
// Vendor response fallback
// ============================================================================

/**
 * Strip a modelled `{ "response": ... }` wrapper. The protocol unwraps the
 * envelope before decoding, so a schema that still describes it would look
 * for `response` inside `response`.
 */
const unwrapEnvelope = (schema: Json): Json => {
  const inner = schema?.properties?.response;
  return inner && typeof inner === "object" ? inner : schema;
};

/**
 * Retype `integer`/`number` as `string` throughout a vendor schema. Used
 * only for the operations we could not observe (the write paths); the
 * observed ones are already string-typed by construction.
 */
const stringifyNumerics = (node: Json): Json => {
  if (Array.isArray(node)) return node.map(stringifyNumerics);
  if (!node || typeof node !== "object") return node;

  const out: Json = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === "type" && (v === "integer" || v === "number")) {
      out[k] = "string";
      continue;
    }
    // `format: int64` on a now-string member would be misleading.
    if (k === "format" && (v === "integer" || v === "int64" || v === "int32")) {
      continue;
    }
    out[k] = stringifyNumerics(v);
  }
  return out;
};

// ============================================================================
// Build
// ============================================================================

const vendor: Json = JSON.parse(
  await readFile(path.join(root, "specs/openapi.vendor.json"), "utf8"),
);
const observed: Record<string, Observed> = JSON.parse(
  await readFile(path.join(root, "specs/observed.json"), "utf8"),
);

const spec: Json = {
  openapi: "3.0.0",
  info: {
    ...vendor.info,
    description:
      `${vendor.info?.description ?? ""}\n\n` +
      "Response schemas in this document are derived from observed API " +
      "responses (see scripts/capture-samples.ts), not from the vendor " +
      "document, whose response definitions are largely unusable. Every " +
      "scalar is typed `string` because that is what the API sends.",
  },
  servers: vendor.servers,
  paths: {},
  components: { schemas: vendor.components?.schemas ?? {} },
};

let observedCount = 0;
let fallbackCount = 0;
const unnamed: string[] = [];

for (const [urlPath, pathItem] of Object.entries<Json>(vendor.paths)) {
  const outItem: Json = {};

  for (const [method, op] of Object.entries<Json>(pathItem)) {
    if (!["get", "post", "put", "patch", "delete"].includes(method)) continue;

    const key = `${method} ${urlPath}`;
    const operationId = OPERATION_IDS[key];
    if (!operationId) {
      unnamed.push(key);
      continue;
    }

    // ---- request side: keep the vendor's params, minus protocol-supplied ----
    const parameters = (op.parameters ?? []).filter(
      (p: Json) => !PROTOCOL_PARAMS.has(p.name),
    );

    // ---- response side: observed if we have it, repaired vendor if not ----
    const obs = observed[operationId];
    let responseSchema: Json;
    if (obs) {
      responseSchema = toSchema(obs);
      observedCount++;
    } else {
      const vendorSchema =
        op.responses?.["200"]?.content?.["*/*"]?.schema ??
        op.responses?.["200"]?.content?.["application/json"]?.schema;
      responseSchema = stringifyNumerics(unwrapEnvelope(vendorSchema ?? {}));
      fallbackCount++;
    }

    const responses: Json = {
      "200": {
        description: "Successful response",
        content: { "application/json": { schema: responseSchema } },
      },
      // The vendor document declares no failures at all. Reapit answers 422
      // for validation problems on every endpoint (a missing required
      // filter, a malformed body), and 404 whenever a path id is resolved.
      // Declaring them here is what puts UnprocessableEntity / NotFound in
      // each operation's typed error union.
      "422": { description: "Validation failed" },
    };
    if (urlPath.includes("{")) {
      responses["404"] = { description: "Resource not found" };
    }

    outItem[method] = {
      operationId,
      tags: op.tags,
      description: op.description,
      ...(parameters.length ? { parameters } : {}),
      ...(op.requestBody ? { requestBody: op.requestBody } : {}),
      responses,
    };
  }

  if (Object.keys(outItem).length) spec.paths[urlPath] = outItem;
}

await writeFile(
  path.join(root, "specs/openapi.json"),
  `${JSON.stringify(spec, null, 2)}\n`,
);

const total = observedCount + fallbackCount;
console.log(`📄 wrote specs/openapi.json`);
console.log(
  `   ${total} operations — ${observedCount} from observed responses, ${fallbackCount} from the repaired vendor schema`,
);
if (unnamed.length) {
  console.error(
    `\n⚠️  ${unnamed.length} operation(s) have no operationId and were DROPPED:`,
  );
  for (const k of unnamed) console.error(`     ${k}`);
  process.exit(1);
}
