/**
 * VaultRE credentials — hand-written.
 *
 * VaultRE requires TWO secrets on every request, and they belong to different
 * parties:
 *
 *   X-Api-Key:     <the integrator's key, issued to us once>
 *   Authorization: Bearer <the customer's access token, issued per account>
 *
 * The integrator key identifies the software; the access token identifies the
 * agency and carries the scopes that agency granted. One process syncing many
 * agencies holds one key and many tokens, which is why both live on the
 * {@link Config} rather than the key being a deployment constant.
 *
 * The document declares both as `securitySchemes`, so neither reaches a
 * generated operation; `protocol.ts` supplies them from here.
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

/**
 * The only origin VaultRE documents. The API is versioned in the path, and
 * the vendor spec this SDK is generated from declares exactly this server, so
 * pointing the SDK at `v1.2` would silently mismatch the schemas.
 */
export const DEFAULT_API_BASE_URL =
  "https://ap-southeast-2.api.vaultre.com.au/api/v1.3";

export interface Config {
  /** Integrator key — the `X-Api-Key` header. */
  readonly apiKey: Redacted.Redacted<string>;
  /** The agency's access token — the `Authorization: Bearer` header. */
  readonly accessToken: Redacted.Redacted<string>;
  /** API origin including the version path segment. */
  readonly apiBaseUrl: string;
}

export class Credentials extends Context.Service<
  Credentials,
  Effect.Effect<Config>
>()("VaultreCredentials") {}

const trimSlash = (url: string): string => url.replace(/\/+$/, "");

/** Layer from an integrator key and one agency's access token. */
export const fromApiKey = (config: {
  readonly apiKey: string;
  readonly accessToken: string;
  readonly apiBaseUrl?: string;
}): Layer.Layer<Credentials> =>
  Layer.succeed(
    Credentials,
    Effect.succeed({
      apiKey: Redacted.make(config.apiKey),
      accessToken: Redacted.make(config.accessToken),
      apiBaseUrl: trimSlash(config.apiBaseUrl ?? DEFAULT_API_BASE_URL),
    }),
  );

/**
 * Reads `VAULTRE_API_KEY` and `VAULTRE_ACCESS_TOKEN` (both required), plus the
 * optional `VAULTRE_API_BASE_URL`.
 */
export const CredentialsFromEnv: Layer.Layer<Credentials> = Layer.succeed(
  Credentials,
  Effect.gen(function* () {
    const apiKey = process.env.VAULTRE_API_KEY;
    const accessToken = process.env.VAULTRE_ACCESS_TOKEN;

    if (!apiKey || !accessToken) {
      return yield* new ConfigError({
        message:
          "VaultRE credentials require VAULTRE_API_KEY and VAULTRE_ACCESS_TOKEN environment variables",
      });
    }

    return {
      apiKey: Redacted.make(apiKey),
      accessToken: Redacted.make(accessToken),
      apiBaseUrl: trimSlash(
        process.env.VAULTRE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
      ),
    };
  }).pipe(Effect.orDie),
);
