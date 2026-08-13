/**
 * Rex-specific error types.
 *
 * Re-exports common HTTP errors from sdk-core and adds Rex-specific error
 * matching and API error types.
 *
 * Rex is an RPC-style API: most logical failures come back as HTTP 200 with
 * an `error` object inside the `{ result, error, correlation }` envelope
 * (see `protocol.ts`), discriminated by `error.type` (e.g.
 * `"BadMethodCallException"`, `"ValidationException"`). Transport-level
 * failures still use real HTTP status codes (401/403/429/5xx), which is what
 * `HTTP_STATUS_MAP` covers.
 */
export {
  BadGateway,
  BadRequest,
  Conflict,
  ConfigError,
  Forbidden,
  GatewayTimeout,
  InternalServerError,
  Locked,
  NotFound,
  ServiceUnavailable,
  TooManyRequests,
  Unauthorized,
  UnprocessableEntity,
  HTTP_STATUS_MAP,
  DEFAULT_ERRORS,
  API_ERRORS,
} from "@distilled.cloud/core/errors";
export type { DefaultErrors } from "@distilled.cloud/core/errors";

import * as Schema from "effect/Schema";
import * as Category from "@distilled.cloud/core/category";

/**
 * A structured error returned inside the Rex response envelope's `error`
 * field. Carries the Rex exception `type` and `code` so callers can match
 * on the specific failure.
 *
 * Deliberately NOT categorised as a server error. Envelope errors are
 * *logical* failures — a missing record, a validation complaint, a bad
 * method call — and the transient retry policy retries server errors
 * indefinitely. Categorising these as server errors made a plain
 * "record not found" spend 27 seconds in exponential backoff before
 * surfacing, since it can never succeed on retry.
 *
 * Genuinely transient conditions still retry: they arrive as HTTP 5xx and
 * map to `InternalServerError` / `ServiceUnavailable` / `BadGateway`, which
 * keep their own categories. A caller who wants to retry a specific Rex
 * exception can express that directly:
 *
 * ```ts
 * myEffect.pipe(
 *   Rex.Retry.policy({
 *     while: (e) => e._tag === "RexApiError" && e.type === "SomeTransientThing",
 *     schedule: Schedule.exponential("1 second"),
 *   }),
 * );
 * ```
 */
export class RexApiError extends Schema.TaggedError<RexApiError>()(
  "RexApiError",
  {
    /** Rex exception class name, e.g. "BadMethodCallException". */
    type: Schema.optional(Schema.String),
    /** Rex numeric error code. */
    code: Schema.optional(Schema.Number),
    message: Schema.optional(Schema.String),
    /** The full `error` object from the envelope, including `extra`. */
    body: Schema.Unknown,
  },
) {}

/** Returned when a Rex error response can't be matched to a known shape. */
export class UnknownRexError extends Schema.TaggedError<UnknownRexError>()(
  "UnknownRexError",
  {
    code: Schema.optional(Schema.String),
    message: Schema.optional(Schema.String),
    body: Schema.Unknown,
  },
).pipe(Category.withServerError) {}

/** Schema parse error wrapper — raised when a response fails schema decoding. */
export class RexParseError extends Schema.TaggedError<RexParseError>()(
  "RexParseError",
  {
    body: Schema.Unknown,
    cause: Schema.Unknown,
  },
).pipe(Category.withParseError) {}
