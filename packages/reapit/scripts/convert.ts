#!/usr/bin/env bun
/**
 * convert — turn the repaired Reapit OpenAPI document into a Smithy 2.0
 * JSON model.
 *
 * Input:  specs/openapi.json    (written by scripts/build-spec.ts)
 *         patches/*.patch.json  (RFC-6902 patches to the OpenAPI document,
 *         for targeted fixes that do not belong in build-spec.ts)
 * Output: .generated-specs/reapit.json
 *
 * The OpenAPI→Smithy converter lives in
 * `@distilled.cloud/core/codegen/openapi`; this script is Reapit's pipeline
 * config. `scripts/generate.ts` compiles the model into src/services.
 *
 * The auth headers and the required `version` query parameter are already
 * stripped by `build-spec.ts` — `src/protocol.ts` supplies all four — so
 * nothing auth-shaped reaches the generated operations.
 */
import * as path from "node:path";
import { runOpenApiConvert } from "@distilled.cloud/core/codegen/openapi-cli";

await runOpenApiConvert({
  root: path.resolve(import.meta.dir, ".."),
  specs: [
    {
      name: "reapit",
      specPath: "specs/openapi.json",
    },
  ],
  patchesDir: "patches",
  options: {
    namespace: "com.reapit.agentbox",
    serviceName: "Reapit",
    // 422 is the API's catch-all validation failure and 404 answers any
    // unresolvable path id; both are declared per-operation in
    // build-spec.ts so they land in each operation's typed error union.
    statusToErrorClass: {
      "400": "BadRequest",
      "403": "Forbidden",
      "404": "NotFound",
      "409": "Conflict",
      "422": "UnprocessableEntity",
    },
    // Covered globally by the protocol's status map.
    defaultErrorStatuses: ["401", "429", "500", "502", "503", "504"],
    skipDeprecated: false,
  },
});
