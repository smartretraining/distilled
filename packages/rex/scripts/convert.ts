#!/usr/bin/env bun
/**
 * convert — turn the Rex OpenAPI document into a Smithy 2.0 JSON model.
 *
 * Input:  specs/openapi.generated.json  (written by scripts/build-openapi.ts
 *         from the committed `describe`/`describeModel` captures in
 *         specs/rex/*.json — no live Rex API access needed)
 *         patches/*.patch.json  (RFC-6902 patches to the OpenAPI document)
 * Output: .generated-specs/rex.json
 *
 * The OpenAPI→Smithy converter lives in
 * `@distilled.cloud/core/codegen/openapi`; this script is Rex's pipeline
 * config. `scripts/generate.ts` compiles the model into src/services.
 *
 * Rex's `{ result, error, correlation }` envelope is unwrapped by
 * `src/protocol.ts`, so the operations in the OpenAPI document already
 * describe the inner `result` payload — nothing envelope-shaped appears here.
 */
import * as path from "node:path";
import { runOpenApiConvert } from "@distilled.cloud/core/codegen/openapi-cli";

await runOpenApiConvert({
  root: path.resolve(import.meta.dir, ".."),
  specs: [
    {
      name: "rex",
      specPath: "specs/openapi.generated.json",
    },
  ],
  patchesDir: "patches",
  options: {
    namespace: "com.rexsoftware.api",
    serviceName: "Rex",
    // Rex's introspection surface has no deprecation markers; keep every
    // method the catalog reports.
    skipDeprecated: false,
  },
});
