/**
 * Box+Dice-specific error types.
 *
 * Re-exports the common HTTP errors from core and adds the Box+Dice fallbacks.
 *
 * Box+Dice reports failures in two shapes, which `protocol.ts` normalises:
 *
 *     { "error": "Appraisal Lead for this contact and property already exists." }
 *     { "errors": { "name": ["is too long (maximum is 100 characters)"] } }
 *
 * The first is a flat sentence, the second a Rails-style field → messages map.
 * Both become {@link BoxDiceApiError}, which keeps the structured `errors` map
 * intact so a caller can attribute a validation failure to a field without
 * string-matching the message.
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
 * A structured failure from a Box+Dice `{ error }` or `{ errors }` body.
 *
 * Deliberately NOT categorised as a server error. These are logical failures —
 * a duplicate lead, an over-long category name, a bad status transition — and
 * the transient retry policy retries server errors indefinitely, so
 * categorising them that way would make a request that can never succeed spend
 * itself out in backoff before surfacing. Genuinely transient conditions
 * arrive as 5xx and keep their own categories.
 */
export class BoxDiceApiError extends Schema.TaggedError<BoxDiceApiError>()(
  "BoxDiceApiError",
  {
    /** The flat `error` sentence, or the first message from `errors`. */
    message: Schema.optional(Schema.String),
    /** The `errors` map verbatim: field name → messages. */
    errors: Schema.Unknown,
    /** The full response body. */
    body: Schema.Unknown,
  },
).pipe(Category.withBadRequestError) {}

/** Unknown Box+Dice error — returned when nothing else matches the failure. */
export class UnknownBoxDiceError extends Schema.TaggedError<UnknownBoxDiceError>()(
  "UnknownBoxDiceError",
  {
    code: Schema.optional(Schema.String),
    message: Schema.optional(Schema.String),
    body: Schema.Unknown,
  },
).pipe(Category.withServerError) {}

/** Schema parse error wrapper — raised when a response fails schema decoding. */
export class BoxDiceParseError extends Schema.TaggedError<BoxDiceParseError>()(
  "BoxDiceParseError",
  {
    body: Schema.Unknown,
    cause: Schema.Unknown,
  },
).pipe(Category.withParseError) {}
