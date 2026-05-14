/**
 * Rex credentials.
 *
 * Unlike most Distilled SDKs, Rex does not use a static API key. Auth is
 * session-token based: you POST email + password to
 * `Authentication/login` and receive a token string, which is then sent as
 * `Authorization: Bearer <token>` on every subsequent call (see
 * `client.ts`).
 *
 * Three ways to provide credentials:
 *   - `CredentialsFromToken(token)` — you already have a token.
 *   - `CredentialsFromEnv` — reads `REX_API_TOKEN`, or falls back to
 *     `REX_EMAIL` + `REX_PASSWORD` and performs the login exchange.
 *   - construct the `Credentials` service directly.
 */
import { ConfigError } from "@distilled.cloud/core/errors";
import * as EffectConfig from "effect/Config";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";

export const DEFAULT_API_BASE_URL = "https://api.rexsoftware.com";

export interface Config {
  /** Session token sent as `Authorization: Bearer <token>`. */
  readonly token: Redacted.Redacted<string>;
  /** API origin, e.g. `https://api.rexsoftware.com`. */
  readonly apiBaseUrl: string;
}

export class Credentials extends Context.Service<Credentials, Config>()(
  "RexCredentials",
) {}

/**
 * Exchange email + password for a session token via
 * `POST {baseUrl}/v1/rex/Authentication/login`.
 *
 * Kept as a plain `fetch` so credentials resolution has no dependency on the
 * SDK's own HttpClient layer (which itself needs credentials).
 */
export const login = (
  email: string,
  password: string,
  apiBaseUrl: string = DEFAULT_API_BASE_URL,
): Effect.Effect<string, ConfigError> =>
  Effect.tryPromise({
    try: async () => {
      const res = await fetch(`${apiBaseUrl}/v1/rex/Authentication/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as {
        result?: unknown;
        error?: { message?: string } | null;
      };
      if (!res.ok || json.error || typeof json.result !== "string") {
        throw new Error(
          json.error?.message ?? `Rex login failed (HTTP ${res.status})`,
        );
      }
      return json.result;
    },
    catch: (cause) =>
      new ConfigError({
        message: `Rex login failed: ${cause instanceof Error ? cause.message : String(cause)}`,
      }),
  });

/** Build a `Credentials` layer from a token you already hold. */
export const CredentialsFromToken = (
  token: string,
  options?: { apiBaseUrl?: string },
): Layer.Layer<Credentials> =>
  Layer.succeed(Credentials, {
    token: Redacted.make(token),
    apiBaseUrl: options?.apiBaseUrl ?? DEFAULT_API_BASE_URL,
  });

const envConfig = EffectConfig.all({
  token: EffectConfig.string("REX_API_TOKEN").pipe(EffectConfig.option),
  email: EffectConfig.string("REX_EMAIL").pipe(EffectConfig.option),
  password: EffectConfig.string("REX_PASSWORD").pipe(EffectConfig.option),
  apiBaseUrl: EffectConfig.string("REX_API_BASE_URL").pipe(
    EffectConfig.withDefault(DEFAULT_API_BASE_URL),
  ),
});

/**
 * Resolve credentials from the environment.
 *
 * Prefers `REX_API_TOKEN`. If absent, requires `REX_EMAIL` + `REX_PASSWORD`
 * and performs the login exchange to obtain a token.
 */
export const CredentialsFromEnv: Layer.Layer<Credentials, ConfigError> =
  Layer.effect(
    Credentials,
    Effect.gen(function* () {
      const cfg = yield* envConfig.pipe(
        Effect.mapError(
          () =>
            new ConfigError({
              message:
                "Rex credentials require either REX_API_TOKEN, or REX_EMAIL + REX_PASSWORD",
            }),
        ),
      );

      const tokenValue =
        cfg.token._tag === "Some" ? cfg.token.value : undefined;
      if (tokenValue !== undefined) {
        return {
          token: Redacted.make(tokenValue),
          apiBaseUrl: cfg.apiBaseUrl,
        };
      }

      if (cfg.email._tag === "Some" && cfg.password._tag === "Some") {
        const token = yield* login(
          cfg.email.value,
          cfg.password.value,
          cfg.apiBaseUrl,
        );
        return { token: Redacted.make(token), apiBaseUrl: cfg.apiBaseUrl };
      }

      return yield* Effect.fail(
        new ConfigError({
          message:
            "Rex credentials require either REX_API_TOKEN, or REX_EMAIL + REX_PASSWORD",
        }),
      );
    }),
  );
