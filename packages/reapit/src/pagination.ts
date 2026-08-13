/**
 * Reapit pagination — hand-written.
 *
 * Every Reapit collection endpoint takes `page` (1-based) and `limit` and
 * answers with the page's metadata alongside the items:
 *
 * ```json
 * { "items": "6894", "current": "1", "last": "2298", "contacts": [ ... ] }
 * ```
 *
 * `items` is the TOTAL record count (not this page's length), `current` is
 * the page just returned, and `last` is the final page number. Note that all
 * three arrive as JSON strings; the generated schemas coerce them to numbers,
 * so {@link paginatePages} sees numbers — but it tolerates strings anyway,
 * since a caller with a hand-rolled schema could leave them as-is.
 *
 * Core's `paginatePageNumber` fits the wire shape but can only stop by
 * requesting one page past the end and finding it empty, because Reapit
 * reports the *current* page rather than a next-page token. `last` tells us
 * where the end is up front, so this strategy stops exactly on it and saves
 * a request per traversal.
 */
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import {
  getPath,
  type PaginatedTrait,
  type PaginationStrategy,
} from "@distilled.cloud/core/pagination";

export { getItems, paginatePageNumber } from "@distilled.cloud/core/pagination";

/** Coerce Reapit's stringly-typed page metadata to a number. */
const toNumber = (v: unknown): number | undefined => {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

/**
 * Stream of pages using Reapit's `page`/`last` numbering.
 *
 * Stops at whichever comes first: the page reported by `last`, a page whose
 * item array is empty, or a response with no usable page metadata (which
 * would otherwise loop forever).
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
  // `outputToken` points at the CURRENT page; `last` is read alongside it.
  const currentPath = pagination.outputToken ?? "current";
  const startPage = toNumber(input[inputToken]) ?? 1;

  type State = { page: number; done: boolean };

  return Stream.unfold({ page: startPage, done: false } as State, (state) =>
    Effect.gen(function* () {
      if (state.done) return undefined;

      const response = yield* operation({
        ...input,
        [inputToken]: state.page,
      } as Input);

      const last = toNumber(getPath(response, "last"));
      const current = toNumber(getPath(response, currentPath)) ?? state.page;

      const items = pagination.items
        ? (getPath(response, pagination.items) as
            | readonly unknown[]
            | undefined)
        : undefined;

      const done =
        (last !== undefined && current >= last) ||
        (items !== undefined && items.length === 0) ||
        // No page metadata at all — emit this page and stop rather than loop.
        (last === undefined && items === undefined);

      return [response, { page: state.page + 1, done }] as const;
    }),
  );
};
