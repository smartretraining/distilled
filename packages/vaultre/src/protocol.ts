/**
 * VaultreProtocol — hand-written.
 *
 * VaultRE speaks plain JSON REST with no response envelope: a successful body
 * IS the record, or `{ items, totalItems, totalPages, urls }` on a collection.
 * There is nothing to unwrap, so there is no `transformResponse` here.
 *
 * What this layer absorbs is the two-secret auth scheme (see
 * `credentials.ts`) and the one error shape:
 *
 *     { "success": false, "msg": "...", "code": "..." }
 *
 * `SuccessOrError` is what 155 of the document's 177 declared 400s carry, and
 * every 403 and 404 that carries anything. `errorEnvelope` normalises it for
 * core's status mapping; `unknownError` keeps `code` and `msg` on
 * {@link VaultreApiError}.
 *
 * ON RATE LIMITS. VaultRE documents 10 requests/second and 10,000/day per
 * key, resetting at 00:00 UTC, and answers 429 over either. Core's retry
 * policy honours a server-supplied `Retry-After`, so a burst breach recovers
 * on its own; a daily-quota breach does not, and no amount of retrying will
 * fix it before midnight UTC. `GET /integrator/usage` reports the day's
 * consumption, which is the thing to watch rather than the 429.
 *
 * NOTHING HERE HAS BEEN RUN AGAINST A LIVE ACCOUNT. The error shape is read
 * off the vendor document, not observed. If a real failure arrives in some
 * other shape it falls through to {@link UnknownVaultreError} with the body
 * attached, which is the safe direction — see `test/protocol.test.ts`.
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
import { UnknownVaultreError, VaultreApiError } from "./errors.ts";

/**
 * Error channel shared by every generated VaultRE operation. Generated
 * service files annotate operations with `API.OperationMethod<I, O,
 * VaultreOpError, VaultreOpContext>` explicitly so the compiler never infers
 * these back out of the schema generics.
 */
export type VaultreOpError =
  | InstanceType<(typeof API_ERRORS)[number]>
  | VaultreApiError
  | UnknownVaultreError
  | ConfigError
  | HttpClientError.HttpClientError;

/** Context (requirements) shared by every generated VaultRE operation. */
export type VaultreOpContext = Credentials | HttpClient.HttpClient;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const asString = (v: unknown): string | undefined =>
  typeof v === "string" && v !== ""
    ? v
    : typeof v === "number"
      ? String(v)
      : undefined;

/**
 * The human-readable half of a `SuccessOrError` body.
 *
 * `message` is not a field VaultRE documents anywhere; it is read as a
 * fallback because the one operation that departs from `SuccessOrError`
 * (`DELETE /properties/{id}/photos`, which answers a per-photo result list)
 * shows the vendor does not treat the shape as universal.
 */
const errorMessage = (body: unknown): string | undefined =>
  isRecord(body) ? (asString(body.msg) ?? asString(body.message)) : undefined;

const errorCode = (body: unknown): string | undefined =>
  isRecord(body) ? asString(body.code) : undefined;

export const VaultreProtocol: Layer.Layer<API.Protocol> =
  makeRestProtocol<Config>({
    // The Credentials service holds an effect — resolving it here (per
    // request, on the calling fiber) picks up context-provided credentials,
    // which is what lets one process sync many agencies off one integrator
    // key.
    credentials: Effect.gen(function* () {
      const resolve = yield* Credentials;
      return yield* resolve;
    }),
    baseUrl: (creds) => creds.apiBaseUrl,
    headers: (creds) => ({
      "X-Api-Key": Redacted.value(creds.apiKey),
      Authorization: `Bearer ${Redacted.value(creds.accessToken)}`,
    }),
    errorEnvelope: (body) => {
      const message = errorMessage(body);
      if (message === undefined) return undefined;
      const code = errorCode(body);
      // The typed error classes the generator emits declare `code: number`,
      // and core hands them `best.code ?? 0` after discarding any non-numeric
      // code (`matchTypedError`, core/protocol-http). VaultRE's codes are
      // strings — `INVALID_PHOTO_IDS: [99999]` — so the message is the only
      // channel that reaches the caller intact.
      return {
        code,
        message:
          code !== undefined && !message.includes(code)
            ? `${code}: ${message}`
            : message,
      };
    },
    unknownError: ({ code, message, body }) => {
      const detail = errorMessage(body);
      if (detail !== undefined) {
        return new VaultreApiError({
          code: errorCode(body) ?? asString(code),
          message: detail,
          body,
        });
      }
      return new UnknownVaultreError({
        code: asString(code),
        message,
        body,
      });
    },
  });
