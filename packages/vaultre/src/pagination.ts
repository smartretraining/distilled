/**
 * VaultRE pagination — hand-written.
 *
 * Every VaultRE collection takes `page` (1-based) and `pagesize` and answers
 * with the page's metadata alongside the items:
 *
 * ```json
 * { "items": [ ... ], "totalItems": 4213, "totalPages": 85,
 *   "urls": { "previous": null, "next": "...", "self": "..." } }
 * ```
 *
 * NOTHING IN THAT RESPONSE SAYS WHICH PAGE IT IS. `urls.next` is a
 * fully-formed URL rather than a token, so it cannot be fed back into an
 * operation's input, and there is no `current`. So the traversal counts its
 * own pages and reads `totalPages` to know where to stop — core's
 * `paginatePageNumber` cannot be used, because it needs the response to name
 * the next page and treats a non-advancing value as "stop".
 *
 * `pagesize` defaults to 50 and the document does not state a maximum. Until
 * a live account settles it, a caller asking for a large page may silently
 * receive 50; count `items`, never assume.
 */
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import {
  getPath,
  type PaginatedTrait,
  type PaginationStrategy,
} from "@distilled.cloud/core/pagination";

export { getItems, paginatePageNumber } from "@distilled.cloud/core/pagination";

const toNumber = (v: unknown): number | undefined => {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

/**
 * Stream of pages using VaultRE's `page`/`totalPages` numbering.
 *
 * Stops at whichever comes first: the page count reported by `totalPages`, a
 * page whose `items` array is empty, or a response carrying neither (which
 * would otherwise loop forever).
 *
 * `pagination.outputToken` names the member holding the page COUNT, not a
 * next-page token — see `scripts/generate.ts`, which stamps it.
 */
export const paginatePages: PaginationStrategy = <
  Input extends Record<string, unknown>,
  Output,
  E,
  R,
>(
  operation: (input: Input) => Effect.Effect<Output, E, R>,
  input: Input,
  pagination: PaginatedTrait,
): Stream.Stream<Output, E, R> => {
  const inputToken = pagination.inputToken ?? "page";
  const totalPagesPath = pagination.outputToken ?? "totalPages";
  const startPage = toNumber(input[inputToken]) ?? 1;

  type State = { page: number; done: boolean };

  return Stream.unfold({ page: startPage, done: false } as State, (state) =>
    Effect.gen(function* () {
      if (state.done) return undefined;

      const response = yield* operation({
        ...input,
        [inputToken]: state.page,
      } as Input);

      const totalPages = toNumber(getPath(response, totalPagesPath));
      const items = pagination.items
        ? (getPath(response, pagination.items) as
            | readonly unknown[]
            | undefined)
        : undefined;

      const done =
        (totalPages !== undefined && state.page >= totalPages) ||
        (items !== undefined && items.length === 0) ||
        (totalPages === undefined && items === undefined);

      return [response, { page: state.page + 1, done }] as const;
    }),
  );
};
