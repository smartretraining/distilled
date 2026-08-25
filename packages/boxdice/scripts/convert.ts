#!/usr/bin/env bun
/**
 * convert — turn the Box+Dice OpenAPI document into a Smithy 2.0 JSON model.
 *
 * Input:  specs/openapi.json     (written by scripts/build-spec.ts)
 *         patches/*.patch.json   (RFC-6902 patches to the OpenAPI document)
 * Output: .generated-specs/boxdice.json
 *
 * The OpenAPI→Smithy converter lives in
 * `@distilled.cloud/core/codegen/openapi`; this script is Box+Dice's pipeline
 * config. `scripts/generate.ts` compiles the model into src/services.
 *
 * The `Authorization: Api-Key token=...` header never appears in the document
 * — `src/protocol.ts` supplies it — so nothing auth-shaped reaches the
 * generated operations.
 */
import * as path from "node:path";
import { runOpenApiConvert } from "@distilled.cloud/core/codegen/openapi-cli";

await runOpenApiConvert({
  root: path.resolve(import.meta.dir, ".."),
  specs: [
    {
      name: "boxdice",
      specPath: "specs/openapi.json",
    },
  ],
  patchesDir: "patches",
  options: {
    namespace: "com.boxdice.ai",
    serviceName: "BoxDice",
    // 400 is the only failure Box+Dice declares per-operation; it carries
    // either `{ error }` or `{ errors }` (see src/protocol.ts). Everything
    // else the API documents — 401, 429 — is covered globally by the
    // protocol's status map.
    statusToErrorClass: {
      "400": "BadRequest",
    },
    defaultErrorStatuses: ["401", "429", "500", "502", "503", "504"],
    // The blueprint has no deprecation markers.
    skipDeprecated: false,
  },
});
