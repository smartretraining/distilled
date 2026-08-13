/**
 * Reapit (Agentbox) credentials — hand-written.
 *
 * The Reapit Sales API authenticates with a client ID / API key header pair:
 *
 *   X-Client-ID: <base64 of the agency's admin URL>
 *   X-API-Key:   <the API key issued for that client>
 *
 * The OpenAPI document declares these as ordinary per-operation header
 * parameters rather than a `securityScheme`; the generated operations drop
 * them (see `scripts/convert.ts`) and `protocol.ts` supplies them from here.
 *
 * API keys are IP-restricted: Reapit only accepts a key from the addresses
 * configured against it, so a 401 "Api Key does not exists" can mean a
 * correct key from an unlisted address.
 *
 * Following the core convention the `Credentials` service holds an *effect*
 * resolving the current config, which the protocol layer runs per request on
 * the calling fiber.
 */
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import { ConfigError } from "@distilled.cloud/core/errors";

export const DEFAULT_API_BASE_URL = "https://api.agentboxcrm.com.au";

/**
 * API version, sent as the required `version` query parameter on every
 * request. The API rejects requests without it (HTTP 400, code 300,
 * "Please specify a valid version in the query string").
 */
export type ApiVersion = "1" | "2";

export const DEFAULT_API_VERSION: ApiVersion = "2";

export interface Config {
  /** Agency client ID — the `X-Client-ID` header. */
  readonly clientId: Redacted.Redacted<string>;
  /** Client API key — the `X-API-Key` header. */
  readonly apiKey: Redacted.Redacted<string>;
  /** API origin, e.g. `https://api.agentboxcrm.com.au`. */
  readonly apiBaseUrl: string;
  /** Value of the required `version` query parameter. */
  readonly version: ApiVersion;
}

export class Credentials extends Context.Service<
  Credentials,
  Effect.Effect<Config>
>()("ReapitCredentials") {}

/** Layer from a plain client ID + API key. */
export const fromApiKey = (config: {
  readonly clientId: string;
  readonly apiKey: string;
  readonly apiBaseUrl?: string;
  readonly version?: ApiVersion;
}): Layer.Layer<Credentials> =>
  Layer.succeed(
    Credentials,
    Effect.succeed({
      clientId: Redacted.make(config.clientId),
      apiKey: Redacted.make(config.apiKey),
      apiBaseUrl: config.apiBaseUrl ?? DEFAULT_API_BASE_URL,
      version: config.version ?? DEFAULT_API_VERSION,
    }),
  );

/**
 * Reads `REAPIT_CLIENT_ID` and `REAPIT_API_KEY` (both required), plus the
 * optional `REAPIT_API_BASE_URL` and `REAPIT_API_VERSION`.
 */
export const CredentialsFromEnv: Layer.Layer<Credentials> = Layer.succeed(
  Credentials,
  Effect.gen(function* () {
    const clientId = process.env.REAPIT_CLIENT_ID;
    const apiKey = process.env.REAPIT_API_KEY;

    if (!clientId || !apiKey) {
      return yield* new ConfigError({
        message:
          "Reapit credentials require REAPIT_CLIENT_ID and REAPIT_API_KEY environment variables",
      });
    }

    const rawVersion = process.env.REAPIT_API_VERSION;
    const version: ApiVersion | undefined =
      rawVersion === "1" || rawVersion === "2" ? rawVersion : undefined;
    if (rawVersion !== undefined && version === undefined) {
      return yield* new ConfigError({
        message: `REAPIT_API_VERSION must be "1" or "2" (got ${JSON.stringify(rawVersion)})`,
      });
    }

    return {
      clientId: Redacted.make(clientId),
      apiKey: Redacted.make(apiKey),
      apiBaseUrl: process.env.REAPIT_API_BASE_URL ?? DEFAULT_API_BASE_URL,
      version: version ?? DEFAULT_API_VERSION,
    };
  }).pipe(Effect.orDie),
);
