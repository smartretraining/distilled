#!/usr/bin/env bun
/**
 * generate — turn the Smithy JSON model in .generated-specs into the Box+Dice
 * Effect SDK.
 *
 * Input:  .generated-specs/boxdice.json  (written by scripts/convert.ts)
 * Output: src/services/boxdice.ts  +  src/services/index.ts
 *
 * The smithy→SDK compiler and CLI pipeline live in
 * `@distilled.cloud/core/codegen`; this script is Box+Dice's provider spec.
 *
 * NAMING. Box+Dice's wire is snake_case and so is the TypeScript surface —
 * no member renaming. The blueprint, the JSON payloads and every mapping doc
 * we will write against them all speak snake_case; translating to camelCase
 * would mean maintaining a mental dictionary for no gain.
 *
 * PAGINATION. Box+Dice pages with an `after` cursor in and an absolute
 * `paging.next` URL out. The converter's own detection only recognises
 * `next_page`/`next_token`-style wire shapes, so it never fires here —
 * {@link stampPagination} marks the paginated operations on the model
 * directly, and `src/pagination.ts` reads the cursor back out of the URL.
 */
import type { SdkSpec } from "@distilled.cloud/core/codegen/generator";
import { runGeneratorCli } from "@distilled.cloud/core/codegen/cli";

const NULLABLE_TRAIT = "com.distilled.openapi#nullable";
const ERROR_MATCHERS_TRAIT = "com.distilled.openapi#errorMatchers";
const RAW_RESPONSE_TRAIT = "com.distilled.openapi#rawResponse";
const PAGINATED_TRAIT = "smithy.api#paginated";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Stamp `smithy.api#paginated` on every operation that takes an `after` input
 * and answers with both `data` and `paging`.
 *
 * Requiring all three is what keeps `.pages()` off the endpoints that only
 * look paginated: `searchContacts` and `listContactOwnedProperties` return a
 * bare `{ data }` with no cursor, so they are left as plain operations rather
 * than given a traversal that would re-request the same result forever.
 *
 * Returns a log line for the generator CLI to print.
 */
const stampPagination = (model: any): string => {
  const shapes = model?.shapes ?? {};
  const paginated: string[] = [];

  for (const [id, shape] of Object.entries<any>(shapes)) {
    if (shape?.type !== "operation") continue;

    const output = shape.output?.target
      ? shapes[shape.output.target]
      : undefined;
    const outputMembers: Record<string, any> = output?.members ?? {};
    if (!outputMembers.data || !outputMembers.paging) continue;

    const input = shape.input?.target ? shapes[shape.input.target] : undefined;
    const inputMembers: Record<string, any> = input?.members ?? {};
    if (!inputMembers.after) continue;

    shape.traits ??= {};
    shape.traits[PAGINATED_TRAIT] = {
      inputToken: "after",
      // The cursor arrives wrapped in an absolute URL; `paginateAfter`
      // extracts the `after` parameter from it.
      outputToken: "paging.next",
      items: "data",
    };
    paginated.push(id.split("#").pop()!);
  }

  return `paginated ${paginated.length} operation(s)`;
};

/** Box+Dice's provider spec for the shared smithy→SDK compiler. */
const boxDiceSpec: SdkSpec = {
  nullableTrait: NULLABLE_TRAIT,
  errorMatchersTrait: ERROR_MATCHERS_TRAIT,

  extraBindings: [
    {
      // Sole member of a synthesized wrapper for bare array/scalar response
      // bodies — `createTasks` returns a naked array of per-task results.
      trait: RAW_RESPONSE_TRAIT,
      binding: "rawResponse",
      pipe: "T.RawResponse()",
      rootPipe: "T.RawResponseRoot()",
    },
  ],

  // Unions surface as TS type unions over an opaque schema — the REST
  // protocol passes union content through verbatim (wire names ARE the TS
  // names for Box+Dice), so no runtime case discrimination is needed.
  union: ({ name, caseTargets, tsRef }) => [
    `export type ${name} = ${caseTargets.map(tsRef).join(" | ") || "unknown"};`,
    `export const ${name} = /*@__PURE__*/ S.Unknown as any as S.Schema<${name}>;\n`,
  ],

  // One profile: the `after` cursor, traversed by the local paginateAfter.
  paginationProfiles: {
    after: {
      strategy: "paginateAfter",
      itemsFallback: "data",
    },
  },

  operationDecl: {
    contextType: "BoxDiceOpContext",
    commonErrorType: "BoxDiceOpError",
    commonErrorClasses: ["BoxDiceApiError", "UnknownBoxDiceError"],
    protocol: "BoxDiceProtocol",
    retry: "Retry.Retry",
  },

  sourceNote: ".generated-specs (specs/openapi.json — transcribed blueprint)",
};

runGeneratorCli({
  description: "Generate the Box+Dice Effect SDK from the Smithy model",
  root: `${import.meta.dir}/..`,
  // patches/ holds OpenAPI-document patches consumed by scripts/convert.ts;
  // there is no smithy-model patch chain.
  patchesDir: false,
  transformModel: stampPagination,
  spec: () => boxDiceSpec,
});
