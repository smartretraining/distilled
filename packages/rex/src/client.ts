/**
 * Rex API client.
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
 * body. The generated operation schemas describe the *inner* `result`
 * payload — envelope unwrapping happens here via `transformResponse`, so
 * generated output schemas stay clean.
 *
 * Auth: session token (see `credentials.ts`) sent as `Authorization: Bearer`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ENVELOPE ERRORS AS TYPED ERRORS:
 * Rex returns logical failures as HTTP 200 with a non-null `error` in the
 * envelope. `matchError` (below) only runs for non-2xx transport failures,
 * and `transformResponse` is synchronous, so it can only *throw* `RexApiError`
 * when it sees an envelope error on a 2xx response — that throw lands in the
 * Effect runtime as a defect (die), not a typed failure.
 *
 * Rather than patch `@distilled.cloud/core` (which would need its own
 * release), we recover that defect locally: `API.make` is wrapped below so
 * every generated operation runs under `Effect.catchDefect`, converting a
 * `RexApiError` die into a typed `Effect.fail(RexApiError)` and re-dying on
 * anything else. The wrapped `API.make` return type therefore carries
 * `RexApiError` in its error channel, so callers get it in the typed `E`
 * channel of every operation — `Effect.catchTag("RexApiError", ...)` works.
 * ─────────────────────────────────────────────────────────────────────────
 */
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import { pipeArguments } from "effect/Pipeable";
import { SingleShotGen } from "effect/Utils";
import {
  makeAPI,
  type ApiErrorClass,
  type OperationConfig,
  type OperationMethod,
} from "@distilled.cloud/core/client";
import { parseRetryAfterForStatus } from "@distilled.cloud/core/retry-after";
import { Retry } from "./retry.ts";
import {
  HTTP_STATUS_MAP,
  RexApiError,
  RexParseError,
  UnknownRexError,
} from "./errors.ts";
import { Credentials, type Config } from "./credentials.ts";

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
 * `RexApiError`; `wrapOperation` (below) recovers that defect into the
 * typed error channel — see the "ENVELOPE ERRORS AS TYPED ERRORS" note above.
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
 * Match a non-2xx Rex transport failure to a typed error. Rex uses the same
 * `{ result, error, correlation }` envelope on HTTP error responses.
 */
const matchError = (
  status: number,
  errorBody: unknown,
  _errors?: readonly unknown[],
  headers?: Record<string, string | undefined>,
): Effect.Effect<never, unknown> => {
  const env = decodeEnvelope(errorBody);
  const inner =
    env._tag === "Some" && env.value.error ? env.value.error : undefined;

  const ErrorClass = (HTTP_STATUS_MAP as Record<number, unknown>)[status] as
    | (new (props: { message?: string; retryAfter?: unknown }) => unknown)
    | undefined;

  if (ErrorClass) {
    return Effect.fail(
      new ErrorClass({
        message: inner?.message,
        retryAfter: parseRetryAfterForStatus(status, headers),
      }),
    );
  }

  if (inner) {
    return Effect.fail(
      new RexApiError({
        type: inner.type,
        code: inner.code,
        message: inner.message,
        body: inner,
      }),
    );
  }

  return Effect.fail(new UnknownRexError({ body: errorBody }));
};

const rawAPI = makeAPI<Credentials>({
  credentials: Credentials as never,
  getBaseUrl: (creds: Credentials) => (creds as unknown as Config).apiBaseUrl,
  getAuthHeaders: (creds: Credentials) => ({
    Authorization: `Bearer ${Redacted.value(
      (creds as unknown as Config).token,
    )}`,
  }),
  transformResponse,
  matchError,
  ParseError: RexParseError as never,
  retry: Retry as never,
});

/**
 * Recover a `RexApiError` thrown by `transformResponse` (it lands as a
 * defect) into the typed error channel. Any other defect is re-raised
 * unchanged — defects from real bugs must stay defects.
 */
const recoverEnvelopeError = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
): Effect.Effect<A, E | RexApiError, R> =>
  Effect.catchDefect(effect, (defect) =>
    defect instanceof RexApiError ? Effect.fail(defect) : Effect.die(defect),
  );

/**
 * Wrap an operation built by the core `makeAPI` so both call forms —
 * `op(input)` and `yield* op` — run under {@link recoverEnvelopeError}.
 * Preserves the dual Effect/function shape (`pipe`, `asEffect`, iterator).
 */
const wrapOperation = <I, A, E, R>(
  op: OperationMethod<I, A, E, R>,
): OperationMethod<I, A, E | RexApiError, R> => {
  const call = (input: I) => recoverEnvelopeError(op(input));
  const proto = {
    [Symbol.iterator](this: { asEffect: () => Effect.Effect<unknown> }) {
      return new SingleShotGen(this.asEffect());
    },
    pipe(this: { asEffect: () => Effect.Effect<unknown> }) {
      // eslint-disable-next-line prefer-rest-params
      return pipeArguments(this.asEffect(), arguments);
    },
    asEffect() {
      const opAsEffect = (
        op as unknown as {
          asEffect: () => Effect.Effect<
            (input: I) => Effect.Effect<A, E, never>,
            never,
            R
          >;
        }
      ).asEffect();
      return Effect.map(
        opAsEffect,
        (callFn: (input: I) => Effect.Effect<A, E, never>) => (input: I) =>
          recoverEnvelopeError(callFn(input)),
      );
    },
  };
  return Object.assign(call, proto) as unknown as OperationMethod<
    I,
    A,
    E | RexApiError,
    R
  >;
};

/**
 * Rex API client. Generated operations in `src/operations/` are built with
 * `API.make(...)`.
 *
 * Unlike the bare core client, every operation's error channel includes
 * {@link RexApiError} — Rex's HTTP-200 envelope failures are surfaced as
 * typed errors, not defects (see the note at the top of this file).
 */
export const API = {
  make: <
    I extends Schema.Top,
    O extends Schema.Top,
    const E extends readonly ApiErrorClass[] = readonly [],
  >(
    configFn: () => OperationConfig<I, O, E>,
  ): OperationMethod<
    Schema.Schema.Type<I>,
    Schema.Schema.Type<O>,
    InstanceType<E[number]> | RexApiError,
    Credentials
  > => wrapOperation(rawAPI.make(configFn)),

  /**
   * Paginated operations are passed through unchanged: Rex's RPC surface
   * has no cursor-paginated methods, so the generator never emits these.
   * If that changes, wrap the call form here the way {@link wrapOperation}
   * does while preserving `.pages` / `.items`.
   */
  makePaginated: rawAPI.makePaginated,
};
