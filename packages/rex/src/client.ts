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
 * KNOWN FOLLOW-UP (does not block code generation):
 * Rex returns logical failures as HTTP 200 with a non-null `error` in the
 * envelope. `matchError` (below) only runs for non-2xx transport failures.
 * `transformResponse` therefore throws `RexApiError` when it sees an
 * envelope error on a 2xx response — loud, but it surfaces as a defect /
 * parse error rather than a typed error channel. Cleanly typing this needs
 * a small `makeAPI` addition (a `validateResponse` hook returning an
 * `Effect` that can fail), mirrored on the success path the way
 * `matchError` works on the failure path.
 * ─────────────────────────────────────────────────────────────────────────
 */
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import { makeAPI } from "@distilled.cloud/core/client";
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
 * On an envelope-level error (HTTP 200 + non-null `error`) this throws —
 * see the KNOWN FOLLOW-UP note above.
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

/**
 * Rex API client. Generated operations in `src/operations/` are built with
 * `API.make(...)`.
 */
export const API = makeAPI<Credentials>({
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
