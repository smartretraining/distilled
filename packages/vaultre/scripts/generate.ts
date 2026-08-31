#!/usr/bin/env bun
/**
 * generate — turn the Smithy JSON model in .generated-specs into the VaultRE
 * Effect SDK.
 *
 * Input:  .generated-specs/vaultre.json  (written by scripts/convert.ts)
 * Output: src/services/vaultre.ts  +  src/services/index.ts
 *
 * The smithy→SDK compiler and CLI pipeline live in
 * `@distilled.cloud/core/codegen`; this script is VaultRE's provider spec.
 *
 * PAGINATION. VaultRE pages with `page`/`pagesize` in and
 * `{ items, totalItems, totalPages, urls }` out. There is no next-page token
 * — `urls.next` is a fully-formed URL, not something that can be fed back
 * into an input — so the converter's `detectPagination` never fires and
 * {@link stampPagination} marks the paginated operations directly.
 */
import type { SdkSpec } from "@distilled.cloud/core/codegen/generator";
import { runGeneratorCli } from "@distilled.cloud/core/codegen/cli";

const NULLABLE_TRAIT = "com.distilled.openapi#nullable";
const ERROR_MATCHERS_TRAIT = "com.distilled.openapi#errorMatchers";
const RAW_RESPONSE_TRAIT = "com.distilled.openapi#rawResponse";
const PAGINATED_TRAIT = "smithy.api#paginated";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Stamp `smithy.api#paginated` on every operation that both returns the page
 * envelope (`totalPages` + an `items` collection) and accepts a `page` input.
 *
 * Both halves are load-bearing. Twelve operations return the envelope with no
 * `page` parameter — `/user/teams`, `/properties/{id}/{salelease}/{lifeid}/hazards`
 * and friends — where the envelope is decoration around a complete list.
 * Paginating those would re-request page 1 forever, since a page number the
 * API ignores cannot advance.
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
    const members: Record<string, any> = output?.members ?? {};
    if (!members.totalPages || !members.items) continue;
    if (shapes[members.items.target]?.type !== "list") continue;

    const input = shape.input?.target ? shapes[shape.input.target] : undefined;
    if (!input?.members?.page) continue;

    shape.traits ??= {};
    shape.traits[PAGINATED_TRAIT] = {
      inputToken: "page",
      // VaultRE reports neither the current page nor the next one, only how
      // many there are. `paginatePages` in src/pagination.ts counts its own
      // pages and reads this member to know where to stop.
      outputToken: "totalPages",
      items: "items",
      pageSize: "pagesize",
    };
    paginated.push(id.split("#").pop()!);
  }

  return `paginated ${paginated.length} operation(s)`;
};

/** VaultRE's provider spec for the shared smithy→SDK compiler. */
const vaultreSpec: SdkSpec = {
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
  // protocol passes union content through verbatim, so no runtime case
  // discrimination is needed.
  union: ({ name, caseTargets, tsRef }) => [
    `export type ${name} = ${caseTargets.map(tsRef).join(" | ") || "unknown"};`,
    `export const ${name} = /*@__PURE__*/ S.Unknown as any as S.Schema<${name}>;\n`,
  ],

  // One profile: page/pagesize numbering, traversed by the local
  // paginatePages (which stops on totalPages rather than probing past the end).
  paginationProfiles: {
    page: {
      strategy: "paginatePages",
      itemsFallback: "items",
    },
  },

  operationDecl: {
    contextType: "VaultreOpContext",
    commonErrorType: "VaultreOpError",
    commonErrorClasses: ["VaultreApiError", "UnknownVaultreError"],
    protocol: "VaultreProtocol",
    retry: "Retry.Retry",
  },

  sourceNote:
    ".generated-specs (specs/vaultre.yaml — the vendor's OpenAPI document)",
};

runGeneratorCli({
  description: "Generate the VaultRE Effect SDK from the Smithy model",
  root: `${import.meta.dir}/..`,
  // patches/ holds OpenAPI-document patches consumed by scripts/convert.ts;
  // there is no smithy-model patch chain.
  patchesDir: false,
  transformModel: stampPagination,
  spec: () => vaultreSpec,
});
