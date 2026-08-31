#!/usr/bin/env bun
/**
 * convert — turn the VaultRE OpenAPI document into a Smithy 2.0 JSON model.
 *
 * Input:  specs/vaultre.yaml    (the vendor's own document, see fetch-spec.ts)
 *         patches/*.patch.json  (RFC-6902 patches to the OpenAPI document)
 * Output: .generated-specs/vaultre.json
 *
 * The OpenAPI→Smithy converter lives in
 * `@distilled.cloud/core/codegen/openapi`; this script is VaultRE's pipeline
 * config. `scripts/generate.ts` compiles the model into src/services.
 *
 * Auth is declared as `securitySchemes` (`X-Api-Key` + bearer) rather than as
 * per-operation parameters, so nothing auth-shaped reaches the generated
 * operations; `src/protocol.ts` supplies both headers.
 *
 * The document's enums are passed through untouched, including the ones it
 * contradicts itself on — `status` is 9 values on a property and 8 on
 * `SaleHistory`, which drops `management`. Nothing decodes on them: core
 * emits every enum as `S.String` and re-opens request references inline
 * (`codegen/emit.ts`), so an undocumented value from a live tenant passes
 * through at runtime and is only typed narrower than it is. Correcting a
 * list is a `patches/` entry once an account says which one is real.
 */
import * as path from "node:path";
import YAML from "yaml";
import { runOpenApiConvert } from "@distilled.cloud/core/codegen/openapi-cli";

await runOpenApiConvert({
  root: path.resolve(import.meta.dir, ".."),
  specs: [
    {
      name: "vaultre",
      specPath: "specs/vaultre.yaml",
    },
  ],
  parse: (text) => YAML.parse(text),
  patchesDir: "patches",
  options: {
    namespace: "com.vaultre.api",
    serviceName: "VaultRE",
    // The four statuses VaultRE declares per operation. 400 is its catch-all
    // — 177 operations declare it — and carries `SuccessOrError`
    // (`{ success, msg, code }`), which src/protocol.ts unpacks.
    statusToErrorClass: {
      "400": "BadRequest",
      "403": "Forbidden",
      "404": "NotFound",
      "422": "UnprocessableEntity",
    },
    // Covered globally by the protocol's status map. 429 belongs here rather
    // than in the map above: the documented limits (10/second, 10,000/day)
    // make it a pacing signal on any operation, not a per-operation failure.
    defaultErrorStatuses: ["401", "429", "500", "502", "503", "504"],
    // The document carries no deprecation markers.
    skipDeprecated: false,
  },
});
