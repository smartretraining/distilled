/**
 * Rex webhook delivery payloads.
 *
 * The generated `AdminWebhooks` operations in `src/operations/` cover the
 * *management* API — creating, reading, updating, purging, and health of
 * webhook subscriptions. They do **not** describe the shape of the HTTP
 * `POST` body Rex sends to your callback URL when an event fires; Rex's
 * `describe` introspection has no schema for that.
 *
 * This module hand-models that inbound delivery payload so you can decode
 * and narrow it when handling incoming webhook requests.
 *
 * Rex sends one of two payload formats, chosen per-subscription via
 * `send_format_id`:
 *
 *   - `v1_full_change_detail` — carries `pre` / `post` record snapshots.
 *     `pre` is `null` for "create" events.
 *   - `v1_context_only` — carries only a `context` with the `record_id`,
 *     which you then `{Service}::read` yourself.
 *
 * @example
 * ```ts
 * import { Effect } from "effect";
 * import { decodeWebhookDelivery } from "@smartretraining/rex-effect";
 *
 * // inside your HTTP handler:
 * const delivery = yield* decodeWebhookDelivery(await req.json());
 * for (const event of delivery.data) {
 *   if (event.payload.format === "v1_full_change_detail") {
 *     event.payload.data.post; // current record state
 *     event.payload.data.pre;  // previous state, or null on create
 *   } else {
 *     event.payload.context.record_id; // go read it yourself
 *   }
 * }
 * ```
 */
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { RexParseError } from "./errors.ts";

/** The two `send_format_id` values a subscription can use. */
export const WebhookFormat = Schema.Literals([
  "v1_full_change_detail",
  "v1_context_only",
]);
export type WebhookFormat = typeof WebhookFormat.Type;

/** The user whose action triggered the event, when Rex can attribute one. */
export const WebhookTriggeredByUser = Schema.Struct({
  id: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  first_name: Schema.optional(Schema.String),
  last_name: Schema.optional(Schema.String),
  email_address: Schema.optional(Schema.String),
});
export type WebhookTriggeredByUser = typeof WebhookTriggeredByUser.Type;

/** Metadata accompanying every event, regardless of format. */
export const WebhookContext = Schema.Struct({
  /** Rex service the record belongs to, e.g. `"Notes"`, `"Listings"`. */
  service: Schema.optional(Schema.String),
  /** Numeric record id — pass to `{Service}::read` for context-only events. */
  record_id: Schema.optional(Schema.Union([Schema.Number, Schema.String])),
  account_id: Schema.optional(Schema.String),
  triggered_by_user: Schema.optional(Schema.NullOr(WebhookTriggeredByUser)),
});
export type WebhookContext = typeof WebhookContext.Type;

/**
 * A record snapshot inside a full-change-detail payload. The concrete shape
 * depends on the originating service, so it is kept open — narrow it against
 * the relevant generated `*Output` schema once you know `context.service`.
 */
export const WebhookRecordSnapshot = Schema.Record(
  Schema.String,
  Schema.Unknown,
);
export type WebhookRecordSnapshot = typeof WebhookRecordSnapshot.Type;

/** `v1_full_change_detail` payload: full `pre` / `post` record states. */
export const WebhookFullChangePayload = Schema.Struct({
  format: Schema.Literal("v1_full_change_detail"),
  data: Schema.Struct({
    /** Record state before the change; `null` for "create" events. */
    pre: Schema.NullOr(WebhookRecordSnapshot),
    /** Current record state. */
    post: Schema.NullOr(WebhookRecordSnapshot),
  }),
  context: Schema.optional(WebhookContext),
});
export type WebhookFullChangePayload = typeof WebhookFullChangePayload.Type;

/** `v1_context_only` payload: just the context, no record body. */
export const WebhookContextOnlyPayload = Schema.Struct({
  format: Schema.Literal("v1_context_only"),
  context: WebhookContext,
});
export type WebhookContextOnlyPayload = typeof WebhookContextOnlyPayload.Type;

/** Either delivery format — discriminated by `payload.format`. */
export const WebhookPayload = Schema.Union([
  WebhookFullChangePayload,
  WebhookContextOnlyPayload,
]);
export type WebhookPayload = typeof WebhookPayload.Type;

/** A single event within a delivery. */
export const WebhookEvent = Schema.Struct({
  /** Unique delivery id for this event. */
  id: Schema.String,
  /** Event type, e.g. `"notes.created"`, `"contracts.updated"`. */
  type: Schema.String,
  payload: WebhookPayload,
  /** ISO-8601 timestamp of when the event was created. */
  created_at: Schema.String,
});
export type WebhookEvent = typeof WebhookEvent.Type;

/**
 * The top-level body Rex `POST`s to your callback URL: a `data` array of
 * one or more events.
 */
export const WebhookDelivery = Schema.Struct({
  data: Schema.Array(WebhookEvent),
});
export type WebhookDelivery = typeof WebhookDelivery.Type;

const decode = Schema.decodeUnknownEffect(WebhookDelivery);

/**
 * Decode an incoming webhook request body into a typed {@link WebhookDelivery}.
 * Fails with {@link RexParseError} if the body does not match the expected
 * shape.
 */
export const decodeWebhookDelivery = (
  body: unknown,
): Effect.Effect<WebhookDelivery, RexParseError> =>
  decode(body).pipe(
    Effect.mapError((cause) => new RexParseError({ body, cause })),
  );
