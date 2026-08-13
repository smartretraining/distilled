/**
 * ReapitProtocol — hand-written.
 *
 * Reapit (Agentbox) speaks header-authenticated JSON REST with two quirks
 * that this layer absorbs so generated operations stay clean:
 *
 * 1. REQUIRED `version` QUERY PARAMETER. Every request must carry
 *    `?version=1|2`; the API answers HTTP 400 code 300 ("Please specify a
 *    valid version in the query string") without it, and there is no header
 *    equivalent. {@link ReapitProtocol} wraps the REST protocol's `encode`
 *    to stamp it on every request from {@link Config.version}, so it can
 *    never be forgotten and never appears in an operation's input.
 *
 * 2. UNIVERSAL `response` ENVELOPE. Every successful body is wrapped:
 *    `{ "response": { "items": "6894", "current": "1", "last": "2298",
 *    "contacts": [...] } }`. `transformResponse` unwraps it, so generated
 *    output schemas describe the inner object. (The vendor OpenAPI document
 *    is inconsistent about this — it models the envelope on some operations
 *    and omits it on others — but the live API is uniform. See
 *    `scripts/convert.ts`, which normalises the document to match.)
 *
 * Errors arrive in three interchangeable shapes, sometimes two at once:
 *
 *    { "response": { "errors": [ { code, title, detail } ] } }
 *    { "errorCode": 400, "errorMessage": "..." }
 *    { "response": { "errors": [...] }, "Response": { errorCode, ... } }
 *
 * `errorEnvelope` normalises all three; `matchReapitError` turns them into
 * {@link ReapitVersionError} (code 300), a status-mapped class, or
 * {@link ReapitApiError}.
 *
 * NOTE ON NUMBERS: Reapit returns every scalar as a JSON string — `"6894"`,
 * `"1"`, ids like `"12P0168"`. Only booleans are real booleans. Numeric
 * coercion is handled in the generated schemas (see `scripts/convert.ts`),
 * not here, so the raw wire shape stays visible at this layer.
 */
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import * as HttpClientRequest from "effect/unstable/http/HttpClientRequest";
import type * as HttpClient from "effect/unstable/http/HttpClient";
import type * as HttpClientError from "effect/unstable/http/HttpClientError";
import * as API from "@distilled.cloud/core/api";
import { makeRestProtocol } from "@distilled.cloud/core/protocol-rest";
import type { API_ERRORS, ConfigError } from "@distilled.cloud/core/errors";
import { Credentials, type Config } from "./credentials.ts";
import {
  ReapitApiError,
  ReapitVersionError,
  UnknownReapitError,
} from "./errors.ts";

/**
 * Error channel shared by every generated Reapit operation. Generated
 * service files annotate operations with `API.OperationMethod<I, O,
 * ReapitOpError, ReapitOpContext>` explicitly so the compiler never infers
 * these back out of the schema generics.
 */
export type ReapitOpError =
  | InstanceType<(typeof API_ERRORS)[number]>
  | ReapitApiError
  | ReapitVersionError
  | UnknownReapitError
  | ConfigError
  | HttpClientError.HttpClientError;

/** Context (requirements) shared by every generated Reapit operation. */
export type ReapitOpContext = Credentials | HttpClient.HttpClient;

/** One entry of a Reapit `response.errors` array. */
interface ReapitErrorEntry {
  readonly code?: string | number;
  readonly title?: string;
  readonly detail?: string;
  readonly validVersions?: readonly number[];
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

/**
 * Pull the `errors` array out of whichever envelope the body used. Reapit
 * sometimes returns both the lowercase `response` and capitalised
 * `Response` forms in one body; the lowercase one carries the richer
 * `{ code, title, detail }` entries, so it wins.
 */
const extractErrors = (body: unknown): readonly ReapitErrorEntry[] => {
  if (!isRecord(body)) return [];

  const envelope = body.response;
  if (isRecord(envelope) && Array.isArray(envelope.errors)) {
    return envelope.errors as readonly ReapitErrorEntry[];
  }

  // `{ errorCode, errorMessage }` — the routing-layer shape, which also
  // appears under a capitalised `Response` key alongside the envelope above.
  const flat = isRecord(body.Response) ? body.Response : body;
  if (flat.errorCode !== undefined || flat.errorMessage !== undefined) {
    return [
      {
        code: flat.errorCode as string | number | undefined,
        detail: flat.errorMessage as string | undefined,
        validVersions: flat.validVersions as readonly number[] | undefined,
      },
    ];
  }

  return [];
};

const asString = (v: string | number | undefined): string | undefined =>
  v === undefined ? undefined : String(v);

/**
 * Unwrap the `{ response: ... }` envelope before schema decode. Bodies that
 * are not enveloped (or that carry only errors) are handed through as-is —
 * the error path runs separately, off the HTTP status.
 */
const transformResponse = (body: unknown): unknown => {
  if (!isRecord(body)) return body;
  const envelope = body.response;
  return isRecord(envelope) ? envelope : body;
};

const baseProtocol = makeRestProtocol<Config>({
  // The Credentials service holds an effect — resolving it here (per
  // request, on the calling fiber) picks up context-provided credentials.
  credentials: Effect.gen(function* () {
    const resolve = yield* Credentials;
    return yield* resolve;
  }),
  baseUrl: (creds) => creds.apiBaseUrl,
  headers: (creds) => ({
    "X-Client-ID": Redacted.value(creds.clientId),
    "X-API-Key": Redacted.value(creds.apiKey),
  }),
  errorEnvelope: (body) => {
    const [first] = extractErrors(body);
    if (!first) return undefined;
    return {
      code: first.code,
      // `detail` is the useful sentence; `title` is the exception class.
      message: first.detail ?? first.title,
    };
  },
  transformResponse,
  unknownError: ({ code, message, body }) => {
    const errors = extractErrors(body);
    const first = errors[0];

    // Code 300 is specifically a rejected `version` query parameter. The
    // protocol always sends one, so this means the configured version is
    // not accepted rather than that it was missing.
    if (first && String(first.code) === "300") {
      return new ReapitVersionError({
        message: first.detail ?? first.title,
        validVersions: first.validVersions,
        body,
      });
    }

    if (first) {
      return new ReapitApiError({
        code: asString(first.code),
        title: first.title,
        message: first.detail ?? first.title,
        errors,
        body,
      });
    }

    return new UnknownReapitError({ code: asString(code), message, body });
  },
});

/**
 * Reapit protocol layer. Wraps {@link baseProtocol}'s `encode` to stamp the
 * required `version` query parameter on every request.
 *
 * Credentials are resolved inside `encode`, on the calling fiber — the same
 * contract the core REST protocol uses — so context-provided credentials are
 * honoured and the layer itself carries no `Credentials` requirement. The
 * cast erases that requirement at the protocol boundary; generated
 * operations reintroduce it for callers via {@link ReapitOpContext}.
 */
export const ReapitProtocol: Layer.Layer<API.Protocol> = Layer.effect(
  API.Protocol,
  Effect.gen(function* () {
    const inner = yield* API.Protocol;
    return API.Protocol.of({
      encode: (args) =>
        Effect.gen(function* () {
          const request = yield* inner.encode(args);
          const resolve = yield* Credentials;
          const { version } = yield* resolve;
          return HttpClientRequest.setUrlParam(request, "version", version);
        }) as Effect.Effect<HttpClientRequest.HttpClientRequest>,
      decode: inner.decode,
    });
  }),
).pipe(Layer.provide(baseProtocol));
