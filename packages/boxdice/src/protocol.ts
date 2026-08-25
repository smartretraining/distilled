/**
 * BoxDiceProtocol — hand-written.
 *
 * Box+Dice speaks plain JSON REST with no response envelope: a successful body
 * IS `{ data, paging }` (or the record itself on a detail read), so there is
 * nothing to unwrap and no `transformResponse` here.
 *
 * What this layer does absorb:
 *
 * 1. THE BESPOKE AUTH SCHEME. `Authorization: Api-Key token=<token>` — not
 *    Bearer, not Basic. The blueprint declares it in prose rather than as a
 *    security scheme, so it never reaches the generated operations; it is
 *    supplied here from {@link Credentials}.
 *
 * 2. THE PER-TENANT BASE URL. There is no shared host. The origin comes from
 *    the credential (each agency has its own subdomain) and the path segment
 *    is whichever partner API the key was provisioned for.
 *
 * 3. TWO ERROR SHAPES. `{ error: "..." }` (a sentence) and
 *    `{ errors: { field: ["message"] } }` (Rails validation). `errorEnvelope`
 *    normalises both into a message for core's status mapping;
 *    `unknownError` keeps the structured map on {@link BoxDiceApiError}.
 *
 * 4. THE 204 THAT ENDS EVERY COLLECTION. Box+Dice does not mark the end of a
 *    feed by omitting `paging.next` — it answers HTTP 204 with an empty body,
 *    which core's REST protocol turns into `{}`. That will not decode against
 *    a paginated response, because core PROMOTES the pagination items member
 *    to required (`codegen/generator.ts`) so `.items` always has something to
 *    read. Left alone, every caught-up sync run would fail on its last
 *    request. {@link normaliseEmptyBody} supplies the empty page instead, and
 *    `src/pagination.ts` ends the stream on it.
 *
 *    This is a contract between three files — the required-ness lives in
 *    core's generator, the repair here, and the termination check in
 *    pagination.ts. Test `decode.test.ts > decodes the empty body a 204
 *    leaves behind` is what holds it together.
 *
 * ON RATE LIMITS. Limits are per-endpoint, not per-API, and `Retry-After`
 * rides on ordinary 200s and 204s as well as 429s. Core's retry policy already
 * honours a server-supplied `retryAfter` on the errors it raises; the hint on
 * a SUCCESSFUL response is advisory pacing for a sync loop and is deliberately
 * not acted on here — a protocol layer that slept on success would make every
 * single call look slow.
 */
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import type * as Layer from "effect/Layer";
import type * as HttpClient from "effect/unstable/http/HttpClient";
import type * as HttpClientError from "effect/unstable/http/HttpClientError";
import type * as API from "@distilled.cloud/core/api";
import { makeRestProtocol } from "@distilled.cloud/core/protocol-rest";
import type { API_ERRORS, ConfigError } from "@distilled.cloud/core/errors";
import { Credentials, type Config } from "./credentials.ts";
import { BoxDiceApiError, UnknownBoxDiceError } from "./errors.ts";

/**
 * Error channel shared by every generated Box+Dice operation. Generated
 * service files annotate operations with `API.OperationMethod<I, O,
 * BoxDiceOpError, BoxDiceOpContext>` explicitly so the compiler never infers
 * these back out of the schema generics.
 */
export type BoxDiceOpError =
  | InstanceType<(typeof API_ERRORS)[number]>
  | BoxDiceApiError
  | UnknownBoxDiceError
  | ConfigError
  | HttpClientError.HttpClientError;

/** Context (requirements) shared by every generated Box+Dice operation. */
export type BoxDiceOpContext = Credentials | HttpClient.HttpClient;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

/**
 * First human-readable message from either error shape.
 *
 * `{ errors: { name: ["is too long"] } }` is flattened to
 * `"name is too long"` — the field name is the useful half and is otherwise
 * lost by the time the message reaches a log line. The unflattened map stays
 * available on {@link BoxDiceApiError.errors}.
 */
const firstMessage = (body: unknown): string | undefined => {
  if (!isRecord(body)) return undefined;

  if (typeof body.error === "string" && body.error !== "") return body.error;

  const errors = body.errors;
  if (typeof errors === "string" && errors !== "") return errors;
  if (Array.isArray(errors)) {
    const first = errors.find((e) => typeof e === "string");
    return typeof first === "string" ? first : undefined;
  }
  if (isRecord(errors)) {
    for (const [field, messages] of Object.entries(errors)) {
      const message = Array.isArray(messages)
        ? messages.find((m) => typeof m === "string")
        : typeof messages === "string"
          ? messages
          : undefined;
      if (typeof message === "string") return `${field} ${message}`;
    }
  }

  return undefined;
};

/**
 * Turn the empty body of a 204 into an empty page.
 *
 * An empty object is unambiguous here: no Box+Dice endpoint returns a
 * populated record with zero members, and the writes that genuinely answer
 * `{}` (the deletes and the contact PATCH) decode against schemas that ignore
 * the added member. Adding `data` is therefore safe everywhere and necessary
 * on the 28 paginated operations.
 */
export const normaliseEmptyBody = (body: unknown): unknown =>
  isRecord(body) && Object.keys(body).length === 0 ? { data: [] } : body;

/** The structured `errors` map, when the body carried one. */
const errorDetail = (body: unknown): unknown =>
  isRecord(body) ? (body.errors ?? body.error) : undefined;

export const BoxDiceProtocol: Layer.Layer<API.Protocol> =
  makeRestProtocol<Config>({
    // The Credentials service holds an effect — resolving it here (per
    // request, on the calling fiber) picks up context-provided credentials,
    // which is what lets one process sync many agencies.
    credentials: Effect.gen(function* () {
      const resolve = yield* Credentials;
      return yield* resolve;
    }),
    baseUrl: (creds) => `${creds.origin}/${creds.apiPath}`,
    headers: (creds) => ({
      Authorization: `Api-Key token=${Redacted.value(creds.token)}`,
    }),
    transformResponse: normaliseEmptyBody,
    errorEnvelope: (body) => {
      const message = firstMessage(body);
      return message === undefined ? undefined : { message };
    },
    unknownError: ({ code, message, body }) => {
      const detail = errorDetail(body);
      if (detail !== undefined) {
        return new BoxDiceApiError({
          message: firstMessage(body) ?? message,
          errors: detail,
          body,
        });
      }
      return new UnknownBoxDiceError({
        code: code === undefined ? undefined : String(code),
        message,
        body,
      });
    },
  });
