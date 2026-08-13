#!/usr/bin/env bun
/**
 * generate — turn the Smithy JSON model in .generated-specs into the Rex
 * Effect SDK.
 *
 * Input:  .generated-specs/rex.json  (written by scripts/convert.ts)
 * Output: src/services/rex.ts  +  src/services/index.ts
 *
 * The smithy→SDK compiler and CLI pipeline live in
 * `@distilled.cloud/core/codegen`; this script is Rex's provider spec.
 *
 * Rex keeps the wire's snake_case member names on the TS surface — Rex's
 * own `describe` output, the REST payloads, and existing consumers all use
 * snake_case — so no member renaming or wire dictionaries appear here.
 *
 * Every operation carries `RexApiError` in its error union: Rex signals
 * logical failures as HTTP 200 with a non-null envelope `error`, which
 * `src/protocol.ts` converts into that typed failure.
 */
import type { SdkSpec } from "@distilled.cloud/core/codegen/generator";
import { runGeneratorCli } from "@distilled.cloud/core/codegen/cli";

const NULLABLE_TRAIT = "com.distilled.openapi#nullable";
const ERROR_MATCHERS_TRAIT = "com.distilled.openapi#errorMatchers";
const RAW_RESPONSE_TRAIT = "com.distilled.openapi#rawResponse";

/** Rex's provider spec for the shared smithy→SDK compiler. */
const rexSpec: SdkSpec = {
  nullableTrait: NULLABLE_TRAIT,
  errorMatchersTrait: ERROR_MATCHERS_TRAIT,

  extraBindings: [
    {
      // Sole member of a synthesized wrapper for bare array/scalar response
      // bodies; as the response's only member, the response IS the payload.
      trait: RAW_RESPONSE_TRAIT,
      binding: "rawResponse",
      pipe: "T.RawResponse()",
      rootPipe: "T.RawResponseRoot()",
    },
  ],

  // Unions surface as TS type unions over an opaque schema — the REST
  // protocol passes union content through verbatim (wire names ARE the TS
  // names for Rex), so no runtime case discrimination is needed.
  union: ({ name, caseTargets, tsRef }) => [
    `export type ${name} = ${caseTargets.map(tsRef).join(" | ") || "unknown"};`,
    `export const ${name} = /*@__PURE__*/ S.Unknown as any as S.Schema<${name}>;\n`,
  ],

  operationDecl: {
    contextType: "RexOpContext",
    commonErrorType: "RexOpError",
    // RexApiError is raised by the protocol for HTTP-200 envelope failures,
    // so it belongs on every operation's error list.
    commonErrorClasses: ["UnknownRexError", "RexApiError"],
    protocol: "RexProtocol",
    retry: "Retry.Retry",
  },

  sourceNote: ".generated-specs (specs/rex — describe/describeModel captures)",
};

runGeneratorCli({
  description: "Generate the Rex Effect SDK from the Smithy model",
  root: `${import.meta.dir}/..`,
  // patches/ holds OpenAPI-document patches consumed by scripts/convert.ts;
  // there is no smithy-model patch chain.
  patchesDir: false,
  spec: () => rexSpec,
});
