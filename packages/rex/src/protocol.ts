/**
 * RexProtocol — hand-written.
 *
 * Rex is an RPC-style API. Every operation is a `POST` to
 * `/v1/rex/{Service}::{method}` whose JSON body is the method's named
 * arguments, and whose response is the envelope:
 *
 * ```json
 * { "result": <payload>, "error": <error|null>, "correlation": <id> }
 * ```
 *
 * `build-openapi.ts` emits one OpenAPI operation per Rex method, with the
 * `{Service}::{method}` URL as the path and all arguments as a JSON request
 * body. Generated output schemas describe the *inner* `result` payload —
 * envelope unwrapping happens here, so generated schemas stay clean.
 *
 * Auth: session token (see `credentials.ts`) sent as `Authorization: Bearer`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ENVELOPE ERRORS AS TYPED ERRORS:
 * Rex returns logical failures as HTTP 200 with a non-null `error` in the
 * envelope. The REST factory's error path only runs for non-2xx responses,
 * and its `transformResponse` hook is synchronous — so the only way to
 * signal from there is to *throw*, which lands in the Effect runtime as a
 * defect (die) rather than a typed failure.
 *
 * Rather than patch `@distilled.cloud/core`, we recover that defect here:
 * {@link RexProtocol} wraps the REST protocol's `decode` in
 * `Effect.catchDefect`, converting a thrown {@link RexApiError} into a
 * typed failure and re-dying on anything else (defects from real bugs must
 * stay defects). `Protocol.decode` is typed `Effect<unknown>` with no error
 * channel — the same erasure the core REST protocol uses — and generated
 * operations reintroduce {@link RexApiError} for callers via
 * `commonErrorClasses` in the SDK spec, so
 * `Effect.catch("RexApiError", ...)` works on every operation.
 * ─────────────────────────────────────────────────────────────────────────
 */
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import type * as HttpClient from "effect/unstable/http/HttpClient";
import type * as HttpClientError from "effect/unstable/http/HttpClientError";
import * as API from "@distilled.cloud/core/api";
import { makeRestProtocol } from "@distilled.cloud/core/protocol-rest";
import type { API_ERRORS, ConfigError } from "@distilled.cloud/core/errors";
import { Credentials, type Config } from "./credentials.ts";
import { RexApiError, UnknownRexError } from "./errors.ts";

/**
 * Error channel shared by every generated Rex operation. Generated service
 * files annotate operations with `API.OperationMethod<I, O, RexOpError,
 * RexOpContext>` explicitly so the compiler never infers these back out of
 * the schema generics.
 */
export type RexOpError =
  | InstanceType<(typeof API_ERRORS)[number]>
  | RexApiError
  | UnknownRexError
  | ConfigError
  | HttpClientError.HttpClientError;

/** Context (requirements) shared by every generated Rex operation. */
export type RexOpContext = Credentials | HttpClient.HttpClient;

/** The `error` object carried inside a Rex response envelope. */
const RexEnvelopeError = Schema.Struct({
  message: Schema.optional(Schema.String),
  type: Schema.optional(Schema.String),
  code: Schema.optional(Schema.Number),
  extra: Schema.optional(Schema.Unknown),
});

/** The full Rex response envelope. */
const RexEnvelope = Schema.Struct({
  result: Schema.optional(Schema.Unknown),
  error: Schema.optional(Schema.NullOr(RexEnvelopeError)),
  correlation: Schema.optional(Schema.Unknown),
});

const decodeEnvelope = Schema.decodeUnknownOption(RexEnvelope);

/**
 * Unwrap the `{ result, error, correlation }` envelope before schema decode.
 * On an envelope-level error (HTTP 200 + non-null `error`) this throws
 * {@link RexApiError}; {@link RexProtocol} recovers that defect into the
 * typed error channel — see the note at the top of this file.
 */
const transformResponse = (body: unknown): unknown => {
  const env = decodeEnvelope(body);
  if (env._tag === "None") {
    // Not an envelope — hand the raw body to the output schema as-is.
    return body;
  }
  const { result, error } = env.value;
  if (error !== undefined && error !== null) {
    throw new RexApiError({
      type: error.type,
      code: error.code,
      message: error.message,
      body: error,
    });
  }
  // Rex returns `result: null` for void-ish operations; normalise to `{}`
  // so empty output structs still decode.
  return result === null || result === undefined ? {} : result;
};

/**
 * Base REST protocol. Rex uses the same `{ result, error, correlation }`
 * envelope on HTTP error responses, so the error envelope reads the inner
 * `error` object rather than the body's top level.
 */
const baseProtocol = makeRestProtocol<Config>({
  // The Credentials service holds an effect — resolving it here (per
  // request, on the calling fiber) picks up context-provided credentials.
  credentials: Effect.gen(function* () {
    const resolve = yield* Credentials;
    return yield* resolve;
  }),
  baseUrl: (creds) => creds.apiBaseUrl,
  headers: (creds) => ({
    Authorization: `Bearer ${Redacted.value(creds.token)}`,
  }),
  errorEnvelope: (body) => {
    const env = decodeEnvelope(body);
    const inner =
      env._tag === "Some" && env.value.error ? env.value.error : undefined;
    return inner ? { code: inner.code, message: inner.message } : undefined;
  },
  transformResponse,
  unknownError: ({ code, message, body }) =>
    new UnknownRexError({
      code:
        typeof code === "string"
          ? code
          : code !== undefined
            ? String(code)
            : undefined,
      message,
      body,
    }),
});

/**
 * Rex protocol layer. Wraps {@link baseProtocol}'s `decode` so an envelope
 * error thrown by {@link transformResponse} surfaces as a typed failure
 * instead of a defect.
 */
export const RexProtocol: Layer.Layer<API.Protocol> = Layer.effect(
  API.Protocol,
  Effect.gen(function* () {
    const inner = yield* API.Protocol;
    return API.Protocol.of({
      encode: inner.encode,
      decode: (args) =>
        Effect.catchDefect(inner.decode(args), (defect) =>
          defect instanceof RexApiError
            ? (Effect.fail(defect) as Effect.Effect<never>)
            : Effect.die(defect),
        ),
    });
  }),
).pipe(Layer.provide(baseProtocol));
