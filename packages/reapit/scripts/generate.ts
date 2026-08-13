#!/usr/bin/env bun
/**
 * generate — turn the Smithy JSON model in .generated-specs into the Reapit
 * Effect SDK.
 *
 * Input:  .generated-specs/reapit.json  (written by scripts/convert.ts)
 * Output: src/services/reapit.ts  +  src/services/index.ts
 *
 * The smithy→SDK compiler and CLI pipeline live in
 * `@distilled.cloud/core/codegen`; this script is Reapit's provider spec.
 *
 * PAGINATION. Reapit pages with `page`/`limit` in and
 * `{ items, current, last, <collection> }` out, where `items` is the total
 * record count and `current`/`last` bound the page range. The converter's
 * `detectPagination` only recognises `next_page`/`next_token`-style wire
 * shapes, so it never fires here — {@link stampPagination} below marks the
 * paginated operations directly on the model instead.
 */
import type { SdkSpec } from "@distilled.cloud/core/codegen/generator";
import { runGeneratorCli } from "@distilled.cloud/core/codegen/cli";

const NULLABLE_TRAIT = "com.distilled.openapi#nullable";
const ERROR_MATCHERS_TRAIT = "com.distilled.openapi#errorMatchers";
const RAW_RESPONSE_TRAIT = "com.distilled.openapi#rawResponse";
const PAGINATED_TRAIT = "smithy.api#paginated";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Stamp `smithy.api#paginated` on every operation whose response carries
 * Reapit's page metadata (`current` + `last`) alongside exactly one array
 * member — the collection. Operations without that shape (detail reads,
 * writes, and the lookup lists that return everything at once) are left
 * alone, so `.pages`/`.items` only appear where paging is real.
 *
 * Returns a log line for the generator CLI to print.
 */
const stampPagination = (model: any): string => {
  const shapes = model?.shapes ?? {};
  const paginated: string[] = [];

  for (const [id, shape] of Object.entries<any>(shapes)) {
    if (shape?.type !== "operation") continue;

    const outputId = shape.output?.target;
    const output = outputId ? shapes[outputId] : undefined;
    const members: Record<string, any> = output?.members ?? {};
    if (!members.current || !members.last) continue;

    // The collection is the sole list-typed member.
    const collections = Object.entries(members).filter(
      ([, m]) => shapes[m?.target]?.type === "list",
    );
    if (collections.length !== 1) continue;
    const [collection] = collections[0]!;

    const inputId = shape.input?.target;
    const inputMembers: Record<string, any> = inputId
      ? (shapes[inputId]?.members ?? {})
      : {};
    if (!inputMembers.page) continue;

    shape.traits ??= {};
    shape.traits[PAGINATED_TRAIT] = {
      inputToken: "page",
      // Reapit reports the CURRENT page, not the next one; `paginatePages`
      // in src/pagination.ts reads `last` to know where to stop.
      outputToken: "current",
      items: collection,
      pageSize: "limit",
    };
    paginated.push(id.split("#").pop()!);
  }

  return `paginated ${paginated.length} operation(s): ${paginated.join(", ")}`;
};

/**
 * Reapit's filters are bracketed query parameters — `filter[memberId]`,
 * `filter[type]`, `filter[query]`. Those brackets are not legal in a Smithy
 * member name, so the converter sanitises them to `filter_memberId_`, which
 * then surfaces verbatim on the TypeScript call site:
 *
 *     getListings({ filter_memberId_: "42" })   // before
 *     getListings({ filterMemberId: "42" })     // after
 *
 * The wire name is carried separately on the member's `smithy.api#httpQuery`
 * trait, so renaming the TS-facing name changes nothing about the request —
 * `filter[memberId]` is still what goes over the wire.
 */
const readableMemberName = (name: string): string => {
  const match = /^([A-Za-z0-9]+)_(.+)_$/.exec(name);
  if (!match) return name;
  const [, head, inner] = match;
  return `${head}${inner![0]!.toUpperCase()}${inner!.slice(1)}`;
};

/** Reapit's provider spec for the shared smithy→SDK compiler. */
const reapitSpec: SdkSpec = {
  nullableTrait: NULLABLE_TRAIT,
  errorMatchersTrait: ERROR_MATCHERS_TRAIT,
  memberName: readableMemberName,

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
  // names for Reapit), so no runtime case discrimination is needed.
  union: ({ name, caseTargets, tsRef }) => [
    `export type ${name} = ${caseTargets.map(tsRef).join(" | ") || "unknown"};`,
    `export const ${name} = /*@__PURE__*/ S.Unknown as any as S.Schema<${name}>;\n`,
  ],

  // One profile: Reapit's page/limit numbering, traversed by the local
  // paginatePages (which stops on `last` rather than probing past the end).
  paginationProfiles: {
    page: {
      strategy: "paginatePages",
      itemsFallback: "items",
    },
  },

  operationDecl: {
    contextType: "ReapitOpContext",
    commonErrorType: "ReapitOpError",
    commonErrorClasses: [
      "ReapitApiError",
      "ReapitVersionError",
      "UnknownReapitError",
    ],
    protocol: "ReapitProtocol",
    retry: "Retry.Retry",
  },

  sourceNote: ".generated-specs (specs/openapi.json — observed responses)",
};

runGeneratorCli({
  description: "Generate the Reapit Effect SDK from the Smithy model",
  root: `${import.meta.dir}/..`,
  // patches/ holds OpenAPI-document patches consumed by scripts/convert.ts;
  // there is no smithy-model patch chain.
  patchesDir: false,
  transformModel: stampPagination,
  spec: () => reapitSpec,
});
