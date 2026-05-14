/**
 * Rex → OpenAPI transformer.
 *
 * Rex ships no OpenAPI document. It self-describes via `{Service}::describe`
 * (with `include_detail: true`), which returns, per method:
 *
 *   - typed `parameters`
 *   - an `openapi` block: `request.parameters[].definition` (a JSON-Schema-ish
 *     input shape) and `response.examples[].example` (real example records
 *     wrapped in Rex's `{ result, error }` envelope)
 *
 * This script reads the scraped `specs/rex/*.describe.json` files and emits a
 * single standard **OpenAPI 3.1** document that the shared
 * `@distilled.cloud/core/openapi/generate` generator can consume — the same
 * generator used by neon, stripe, turso, etc.
 *
 * Mapping:
 *   - one OpenAPI operation per Rex method
 *   - path  = `/v1/rex/{Service}::{method}`  (Rex is RPC-over-POST)
 *   - method = POST, request body = the method's named arguments as JSON
 *   - operationId = `{Service}_{method}` → generator emits `{service}{Method}`
 *   - response schema = inferred from the embedded example's INNER `result`
 *     payload; the `{ result, error, correlation }` envelope is stripped at
 *     runtime by `src/client.ts` (`transformResponse`), so generated output
 *     schemas describe just the payload.
 *
 * Known limitations (intentional — refined later, see README/notes):
 *   - `search.criteria` is `type: object` in Rex's `openapi` block with no
 *     property detail; the real query surface lives in
 *     `{Service}.describeModel.json` (`searchable_fields`) and is NOT folded
 *     in here yet.
 *   - 22 of ~48 methods ship no response example — those get a permissive
 *     (`Schema.Unknown`-ish) output schema until a record is sampled.
 *   - Rex union types (`int|string`, `bool|string`, …) and empty/`unknown`
 *     types become permissive (no `type`) schema nodes.
 *
 * Usage:
 *   bun run scripts/build-openapi.ts
 */
import * as fs from "fs";
import * as path from "path";

const rootDir = path.join(import.meta.dir, "..");
const specsDir = path.join(rootDir, "specs", "rex");
const outFile = path.join(rootDir, "specs", "openapi.generated.json");

// ============================================================================
// Rex describe-format types (the subset we consume)
// ============================================================================

interface RexDefinition {
  description?: string;
  type?: string;
  format?: string;
  nullable?: boolean;
  default?: unknown;
  enum?: unknown[];
  properties?: Record<string, RexDefinition>;
  items?: RexDefinition;
}

interface RexParameter {
  required?: boolean;
  default?: unknown;
  definition?: RexDefinition;
}

interface RexOpenApiBlock {
  available?: boolean;
  description?: string;
  request?: {
    // Object keyed by param name, or `[]` for parameterless methods.
    parameters?: Record<string, RexParameter> | unknown[];
  };
  response?: {
    // Object keyed by example name, or `[]` when no example is available.
    examples?: Record<string, { code?: string; summary?: string; example?: unknown }> | unknown[];
  };
}

interface RexMethod {
  description?: string;
  returns?: string;
  experimental?: boolean;
  openapi?: RexOpenApiBlock | unknown[];
}

interface RexDescribe {
  result: {
    name: string;
    description?: string;
    methods: Record<string, RexMethod>;
  };
}

// ============================================================================
// Minimal OpenAPI 3.1 types (only what we emit)
// ============================================================================

interface JsonSchema {
  type?: string | string[];
  format?: string;
  nullable?: boolean;
  description?: string;
  enum?: unknown[];
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  additionalProperties?: boolean;
}

interface OpenApiDoc {
  openapi: "3.1.0";
  info: { title: string; version: string; description?: string };
  servers: Array<{ url: string }>;
  paths: Record<string, Record<string, unknown>>;
}

// ============================================================================
// Type mapping
// ============================================================================

/**
 * Map a Rex `type` string to a JSON-Schema `type`. Rex mixes PHP-ish
 * (`int`, `bool`) and JSON-Schema (`number`, `boolean`) spellings, plus
 * union (`int|string`) and empty/`unknown` types. Anything we can't pin to
 * a single JSON-Schema type returns `undefined` → a permissive schema node.
 */
function mapType(rexType: string | undefined): string | undefined {
  switch (rexType) {
    case "string":
      return "string";
    case "int":
    case "integer":
      return "integer";
    case "number":
    case "float":
    case "double":
      return "number";
    case "bool":
    case "boolean":
      return "boolean";
    case "array":
      return "array";
    case "object":
      return "object";
    default:
      // "", "unknown", "int|string", "bool|string", "string|array", …
      return undefined;
  }
}

/** Convert a Rex parameter/field definition into a JSON Schema node. */
function convertDefinition(def: RexDefinition | undefined): JsonSchema {
  if (def === undefined || def === null || typeof def !== "object") {
    return {};
  }
  const schema: JsonSchema = {};
  const type = mapType(def.type);
  if (type !== undefined) schema.type = type;
  if (def.format !== undefined) schema.format = def.format;
  if (def.nullable === true) schema.nullable = true;
  if (def.description !== undefined && def.description !== "") {
    schema.description = def.description;
  }
  if (Array.isArray(def.enum) && def.enum.length > 0) schema.enum = def.enum;

  if (def.properties && typeof def.properties === "object") {
    schema.type = "object";
    schema.properties = {};
    for (const [k, v] of Object.entries(def.properties)) {
      schema.properties[k] = convertDefinition(v);
    }
  }
  if (def.items !== undefined) {
    schema.type = "array";
    schema.items = convertDefinition(def.items);
  }
  return schema;
}

// ============================================================================
// Response schema inference (from embedded examples)
// ============================================================================

/**
 * Infer a JSON Schema from a concrete example value.
 *
 * A single example record can't tell us which fields are nullable — Rex
 * routinely returns `null` for optional fields that happened to be populated
 * in the sampled record. So every inferred node is marked `nullable: true`;
 * the generator turns that into `Schema.NullOr(...)`, which keeps decoding
 * resilient against the real, sparsely-populated payloads.
 */
function inferSchema(value: unknown): JsonSchema {
  if (value === null || value === undefined) return {};
  if (Array.isArray(value)) {
    return value.length > 0
      ? { type: "array", nullable: true, items: inferSchema(value[0]) }
      : { type: "array", nullable: true };
  }
  switch (typeof value) {
    case "string":
      return { type: "string", nullable: true };
    case "number":
      return { type: "number", nullable: true };
    case "boolean":
      return { type: "boolean", nullable: true };
    case "object": {
      const properties: Record<string, JsonSchema> = {};
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        properties[k] = inferSchema(v);
      }
      return { type: "object", nullable: true, properties };
    }
    default:
      return {};
  }
}

/**
 * Pull a response schema out of a method's `openapi.response.examples`.
 * Examples are wrapped in Rex's `{ result, error }` envelope — we infer
 * from the inner `result`. Returns a permissive `{}` when no usable example
 * exists (22 of ~48 methods).
 */
function inferResponseSchema(openapi: RexOpenApiBlock): {
  schema: JsonSchema;
  fromExample: boolean;
} {
  const examples = openapi.response?.examples;
  if (examples && !Array.isArray(examples)) {
    for (const ex of Object.values(examples)) {
      const raw = ex?.example;
      if (raw === undefined) continue;
      // Unwrap the envelope if present.
      const payload =
        raw !== null && typeof raw === "object" && "result" in raw
          ? (raw as { result: unknown }).result
          : raw;
      return { schema: inferSchema(payload), fromExample: true };
    }
  }
  return { schema: {}, fromExample: false };
}

// ============================================================================
// Request body construction
// ============================================================================

function buildRequestSchema(openapi: RexOpenApiBlock): {
  schema: JsonSchema;
  anyRequired: boolean;
} {
  const params = openapi.request?.parameters;
  const schema: JsonSchema = {
    type: "object",
    properties: {},
    additionalProperties: false,
  };
  const required: string[] = [];

  if (params && !Array.isArray(params)) {
    for (const [name, param] of Object.entries(params)) {
      schema.properties![name] = convertDefinition(param.definition);
      if (param.required === true) required.push(name);
    }
  }
  if (required.length > 0) schema.required = required;
  return { schema, anyRequired: required.length > 0 };
}

// ============================================================================
// Main transform
// ============================================================================

function transform(): void {
  const describeFiles = fs
    .readdirSync(specsDir)
    .filter((f) => f.endsWith(".describe.json"))
    .sort();

  if (describeFiles.length === 0) {
    throw new Error(
      `No *.describe.json files in ${specsDir}. Run \`bun run specs:scrape\` first.`,
    );
  }

  const doc: OpenApiDoc = {
    openapi: "3.1.0",
    info: {
      title: "Rex API",
      version: "1.0.0",
      description:
        "Generated from Rex `{Service}::describe` introspection. Do not hand-edit — see scripts/build-openapi.ts.",
    },
    servers: [{ url: "https://api.rexsoftware.com" }],
    paths: {},
  };

  let opCount = 0;
  let withExample = 0;

  for (const file of describeFiles) {
    const parsed = JSON.parse(
      fs.readFileSync(path.join(specsDir, file), "utf8"),
    ) as RexDescribe;
    const service = parsed.result.name;
    const methods = parsed.result.methods;

    for (const [methodName, method] of Object.entries(methods)) {
      const openapi = method.openapi;
      // `openapi` is `[]` (or not a dict) when the method isn't documented.
      if (!openapi || Array.isArray(openapi)) continue;
      if (openapi.available === false) continue;

      const operationId = `${service}_${methodName}`;
      const apiPath = `/v1/rex/${service}::${methodName}`;

      const { schema: requestSchema, anyRequired } =
        buildRequestSchema(openapi);
      const { schema: responseSchema, fromExample } =
        inferResponseSchema(openapi);
      if (fromExample) withExample++;

      doc.paths[apiPath] = {
        post: {
          operationId,
          summary: method.description ?? openapi.description ?? methodName,
          description: openapi.description ?? method.description ?? "",
          deprecated: method.experimental === true,
          requestBody: {
            required: anyRequired,
            content: {
              "application/json": { schema: requestSchema },
            },
          },
          responses: {
            "200": {
              description: method.returns ?? "Rex response payload",
              content: {
                "application/json": { schema: responseSchema },
              },
            },
          },
        },
      };
      opCount++;
    }
  }

  fs.writeFileSync(outFile, `${JSON.stringify(doc, null, 2)}\n`);
  console.log(
    `✓ wrote ${path.relative(rootDir, outFile)}\n` +
      `  ${describeFiles.length} service(s), ${opCount} operation(s), ` +
      `${withExample} with response examples, ${opCount - withExample} permissive`,
  );
}

transform();
