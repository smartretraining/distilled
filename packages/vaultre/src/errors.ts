/**
 * VaultRE-specific error types.
 *
 * Re-exports the common HTTP errors from core and adds the VaultRE fallbacks.
 * The generated service module additionally defines its own per-status matcher
 * classes for the statuses each operation declares — those share `_tag`s with
 * the core classes here, so `catch` works against either.
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
 * A structured failure from VaultRE's `SuccessOrError` body —
 * `{ success: false, msg: "...", code: "..." }`.
 *
 * Deliberately NOT categorised as a server error. These are *logical*
 * failures — a malformed body, an id that does not resolve — and the
 * transient retry policy retries server errors indefinitely, so categorising
 * them that way would make a request that can never succeed spend ~30s in
 * backoff before surfacing. Genuinely transient conditions arrive as 5xx and
 * map to the core classes, which keep their own categories.
 */
export class VaultreApiError extends Schema.TaggedError<VaultreApiError>()(
  "VaultreApiError",
  {
    /** VaultRE's own error code, e.g. `INVALID_PHOTO_IDS: [99999]`. */
    code: Schema.optional(Schema.String),
    /** The `msg` field — a human-readable explanation. */
    message: Schema.optional(Schema.String),
    /** The full response body. */
    body: Schema.Unknown,
  },
) {}

/** Unknown VaultRE error — returned when nothing else matches the failure. */
export class UnknownVaultreError extends Schema.TaggedError<UnknownVaultreError>()(
  "UnknownVaultreError",
  {
    code: Schema.optional(Schema.String),
    message: Schema.optional(Schema.String),
    body: Schema.Unknown,
  },
).pipe(Category.withServerError) {}

/** Schema parse error wrapper — raised when a response fails schema decoding. */
export class VaultreParseError extends Schema.TaggedError<VaultreParseError>()(
  "VaultreParseError",
  {
    body: Schema.Unknown,
    cause: Schema.Unknown,
  },
).pipe(Category.withParseError) {}
