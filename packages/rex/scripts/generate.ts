/**
 * Rex SDK code generator.
 *
 * Consumes the OpenAPI 3.1 document produced by `build-openapi.ts`
 * (`specs/openapi.generated.json`) and emits one operation module per Rex
 * method into `src/operations/`, using the shared generator from
 * `@distilled.cloud/core`.
 *
 * The Rex `{ result, error, correlation }` envelope is unwrapped globally by
 * `src/client.ts` (`transformResponse`), so generated output schemas describe
 * just the inner payload — no per-operation response-path patching needed.
 *
 * Run `bun run scripts/build-openapi.ts` first (or use the `generate` script,
 * which chains both).
 *
 * Usage:
 *   bun run scripts/generate.ts
 */
import * as path from "path";
import { generateFromOpenAPI } from "@distilled.cloud/core/openapi/generate";

const rootDir = path.join(import.meta.dir, "..");

generateFromOpenAPI({
  specPath: path.join(rootDir, "specs/openapi.generated.json"),
  patchDir: path.join(rootDir, "patches"),
  outputDir: path.join(rootDir, "src/operations"),
  importPrefix: "..",
  clientImport: "../client",
  traitsImport: "../traits",
  sensitiveImport: "../sensitive",
  errorsImport: "../errors",
  includeOperationErrors: true,
  statusToErrorClass: {
    "400": "BadRequest",
    "403": "Forbidden",
    "404": "NotFound",
    "409": "Conflict",
  },
  defaultErrorStatuses: new Set(["401", "429", "500", "502", "503", "504"]),
  skipDeprecated: false,
});
