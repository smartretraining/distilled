/**
 * Reapit-specific error types.
 *
 * Re-exports the common HTTP errors from core and adds the Reapit fallback
 * errors. The generated service module additionally defines its own
 * per-status matcher classes for the statuses each operation declares —
 * those share `_tag`s with the core classes here, so `catch` works against
 * either.
 *
 * Reapit reports failures in three interchangeable envelope shapes (see
 * `protocol.ts`), all of which are normalised into {@link ReapitApiError}
 * or a status-mapped class before reaching callers.
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
 * A structured error from a Reapit `{ response: { errors: [...] } }` body.
 * Carries the API's own `code` and `title` alongside the human-readable
 * `detail`, so callers can match a specific failure without string-matching
 * the message.
 */
export class ReapitApiError extends Schema.TaggedError<ReapitApiError>()(
  "ReapitApiError",
  {
    /** Reapit error code — usually the HTTP status as a string, e.g. "422". */
    code: Schema.optional(Schema.String),
    /** Short error class, e.g. "Unprocessable Entity Http Exception". */
    title: Schema.optional(Schema.String),
    /** Human-readable explanation, e.g. "Please specify one of postcode...". */
    message: Schema.optional(Schema.String),
    /** Every error the response carried, not just the first. */
    errors: Schema.Unknown,
    /** The full response body. */
    body: Schema.Unknown,
  },
).pipe(Category.withServerError) {}

/**
 * Raised when the API rejects the `version` query parameter (code 300).
 * `protocol.ts` sends it on every request, so this indicates a bad
 * `REAPIT_API_VERSION` rather than a missing parameter.
 */
export class ReapitVersionError extends Schema.TaggedError<ReapitVersionError>()(
  "ReapitVersionError",
  {
    message: Schema.optional(Schema.String),
    /** Versions the API says it accepts. */
    validVersions: Schema.optional(Schema.Array(Schema.Number)),
    body: Schema.Unknown,
  },
).pipe(Category.withBadRequestError) {}

/** Unknown Reapit error — returned when nothing else matches the failure. */
export class UnknownReapitError extends Schema.TaggedError<UnknownReapitError>()(
  "UnknownReapitError",
  {
    code: Schema.optional(Schema.String),
    message: Schema.optional(Schema.String),
    body: Schema.Unknown,
  },
).pipe(Category.withServerError) {}

/** Schema parse error wrapper — raised when a response fails schema decoding. */
export class ReapitParseError extends Schema.TaggedError<ReapitParseError>()(
  "ReapitParseError",
  {
    body: Schema.Unknown,
    cause: Schema.Unknown,
  },
).pipe(Category.withParseError) {}
