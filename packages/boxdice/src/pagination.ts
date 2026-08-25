/**
 * Box+Dice pagination — hand-written.
 *
 * Every collection is a REPLICATION FEED, not a page-through list. Records
 * come back oldest-first ordered by last-modified, and a record that changes
 * after you have seen it APPEARS AGAIN later in the same traversal. Consumers
 * must therefore upsert by id rather than insert, and the end of a traversal
 * means "caught up as of now", not "finished".
 *
 * The wire contract:
 *
 * ```json
 * { "data": [ ... ], "paging": { "next": "https://acme.boxdice.com.au/ai_api/contacts?after=1520848432_37" } }
 * ```
 *
 * `next` is an absolute URL rather than a bare cursor, so {@link nextCursor}
 * reads the `after` parameter back out of it instead of following the URL
 * directly. That is deliberate: the blueprint's own examples return `next`
 * URLs pointing at `/aire_api/` and `/rebot_api/` — partner paths that are not
 * necessarily the one the key is provisioned for — and one of them names a
 * different collection entirely than the endpoint that produced it. Following
 * those verbatim would walk off the API. Taking only the cursor keeps
 * traversal on the host and path the credentials chose.
 *
 * The cursor is opaque (`<unix-timestamp>_<record-id>`) on most endpoints and
 * a plain page number on the email and SMS history endpoints. Reading it out
 * of `next` works for both, so the difference never reaches a caller.
 *
 * TERMINATION. Box+Dice does not omit `next` at the end of a collection. It
 * answers HTTP 204 with an empty body, which the REST protocol decodes to
 * `{}` — no `data`, no `paging`. {@link paginateAfter} ends the stream there.
 * The API's own advice is to wait and re-request the same URL, which is how a
 * long-running sync stays live; this strategy deliberately does NOT do that,
 * because a `Stream` that never ends is the wrong shape for `.pages()`. Resume
 * later by passing the last cursor back in as `after`.
 */
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import {
  getItems,
  getPath,
  isTerminalToken,
  type PaginatedTrait,
  type PaginationStrategy,
} from "@distilled.cloud/core/pagination";

export {
  getItems,
  paginateSingle,
  isTerminalToken,
} from "@distilled.cloud/core/pagination";

/**
 * Extract the `after` cursor from a `paging.next` URL.
 *
 * Returns `undefined` for a missing, non-string, or unparseable `next`, and
 * for a `next` that carries no `after` — all of which end the traversal rather
 * than looping on the page just read.
 */
export const nextCursor = (next: unknown): string | undefined => {
  if (typeof next !== "string" || next === "") return undefined;
  try {
    const after = new URL(next).searchParams.get("after");
    return after === null || after === "" ? undefined : after;
  } catch {
    // Not an absolute URL. Fall back to a plain query-string scan so a
    // relative `next` (which the blueprint never shows, but which costs
    // nothing to tolerate) still advances.
    const match = /[?&]after=([^&]+)/.exec(next);
    return match ? decodeURIComponent(match[1]!) : undefined;
  }
};

/**
 * Stream of pages using Box+Dice's `after` cursor.
 *
 * Stops at whichever comes first: a page whose `paging.next` carries no
 * cursor, a 204 (which arrives as a page with no `data`), or a cursor that
 * repeats — the last of which cannot happen per the documented contract but
 * would otherwise spin forever against a misbehaving tenant.
 */
export const paginateAfter: PaginationStrategy = <
  Input extends Record<string, unknown>,
  Output,
  E,
  R,
>(
  operation: (input: Input) => Effect.Effect<Output, E, R>,
  input: Input,
  pagination: PaginatedTrait,
): Stream.Stream<Output, E, R> => {
  const inputToken = pagination.inputToken ?? "after";
  const outputToken = pagination.outputToken ?? "paging.next";
  const itemsPath = pagination.items ?? "data";

  type State = {
    readonly cursor: string | undefined;
    readonly done: boolean;
    readonly seen: ReadonlySet<string>;
  };

  const startCursor =
    typeof input[inputToken] === "string"
      ? (input[inputToken] as string)
      : undefined;

  return Stream.unfold(
    { cursor: startCursor, done: false, seen: new Set<string>() } as State,
    (state) =>
      Effect.gen(function* () {
        if (state.done) return undefined;

        const requestPayload = {
          ...input,
          ...(state.cursor ? { [inputToken]: state.cursor } : {}),
        } as Input;

        const page = yield* operation(requestPayload);

        // A 204 decodes to `{}`. No `data` member at all means the feed is
        // caught up. An empty `data` array means the same thing — the API
        // only sends the member when it has records — but both are checked
        // because only the first is documented.
        const raw = getPath(page, itemsPath);
        const empty =
          raw === undefined ||
          raw === null ||
          getItems(page, itemsPath).length === 0;

        const cursor = empty
          ? undefined
          : nextCursor(getPath(page, outputToken));

        // A repeated cursor cannot happen per the documented contract, but
        // it would spin forever against a misbehaving tenant.
        const stuck = cursor !== undefined && state.seen.has(cursor);

        const nextState: State = {
          cursor,
          done: isTerminalToken(cursor) || stuck,
          seen:
            cursor === undefined ? state.seen : new Set(state.seen).add(cursor),
        };

        return [page, nextState] as const;
      }),
  );
};
