/**
 * Rex credentials.
 *
 * Unlike most Distilled SDKs, Rex does not use a static API key. Auth is
 * session-token based: you POST email + password to
 * `Authentication/login` and receive a token string, which is then sent as
 * `Authorization: Bearer <token>` on every subsequent call (see
 * `protocol.ts`).
 *
 * Three ways to provide credentials:
 *   - `CredentialsFromToken(token, { appIdentifier })` — you already have a
 *     token.
 *   - `CredentialsFromEnv` — reads `REX_API_TOKEN`, or falls back to
 *     `REX_EMAIL` + `REX_PASSWORD` and performs the login exchange; always
 *     requires `REX_APP_IDENTIFIER`.
 *   - construct the `Credentials` service directly.
 *
 * All of them require an app identifier (`X-App-Identifier`, sent on every
 * request) — see {@link Config.appIdentifier}.
 *
 * Following the core convention, the `Credentials` service holds an
 * *effect* resolving the current config; the protocol layer runs it per
 * request on the calling fiber. Rex session tokens are long-lived, so the
 * login exchange happens once at layer construction and the resolved config
 * is handed back as a constant effect rather than re-authenticating on
 * every call.
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
  /**
   * Sent as `X-App-Identifier` on every request (login included). Rex
   * mandates that every integration identify itself with a stable value
   * following the convention `Integration:Company:Service` (see the Rex
   * "integrations" docs) — a prerequisite for Rex Verified Integrator
   * status. Required, with no default: a fallback would attribute your
   * traffic to someone else's integration.
   */
  readonly appIdentifier: string;
}

export class Credentials extends Context.Service<
  Credentials,
  Effect.Effect<Config>
>()("RexCredentials") {}

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
  options: { appIdentifier: string; apiBaseUrl?: string },
): Effect.Effect<string, ConfigError> =>
  Effect.tryPromise({
    try: async () => {
      const apiBaseUrl = options.apiBaseUrl ?? DEFAULT_API_BASE_URL;
      const res = await fetch(`${apiBaseUrl}/v1/rex/Authentication/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Identifier": options.appIdentifier,
        },
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
  options: { appIdentifier: string; apiBaseUrl?: string },
): Layer.Layer<Credentials> =>
  Layer.succeed(
    Credentials,
    Effect.succeed({
      token: Redacted.make(token),
      apiBaseUrl: options.apiBaseUrl ?? DEFAULT_API_BASE_URL,
      appIdentifier: options.appIdentifier,
    }),
  );

const envConfig = EffectConfig.all({
  token: EffectConfig.string("REX_API_TOKEN").pipe(EffectConfig.option),
  email: EffectConfig.string("REX_EMAIL").pipe(EffectConfig.option),
  password: EffectConfig.string("REX_PASSWORD").pipe(EffectConfig.option),
  apiBaseUrl: EffectConfig.string("REX_API_BASE_URL").pipe(
    EffectConfig.withDefault(DEFAULT_API_BASE_URL),
  ),
  appIdentifier: EffectConfig.string("REX_APP_IDENTIFIER").pipe(
    EffectConfig.option,
  ),
});

const missingCredentials = new ConfigError({
  message:
    "Rex credentials require either REX_API_TOKEN, or REX_EMAIL + REX_PASSWORD",
});

const missingAppIdentifier = new ConfigError({
  message:
    "Rex requires REX_APP_IDENTIFIER — the X-App-Identifier sent on every " +
    'request, following Rex\'s "Integration:Company:Service" convention',
});

/**
 * Resolve credentials from the environment.
 *
 * Prefers `REX_API_TOKEN`. If absent, requires `REX_EMAIL` + `REX_PASSWORD`
 * and performs the login exchange to obtain a token. `REX_APP_IDENTIFIER`
 * is always required. Resolution happens once, when the layer is built.
 */
export const CredentialsFromEnv: Layer.Layer<Credentials> = Layer.effect(
  Credentials,
  Effect.gen(function* () {
    const cfg = yield* envConfig.pipe(
      Effect.mapError(() => missingCredentials),
    );

    if (cfg.appIdentifier._tag === "None") {
      return yield* Effect.fail(missingAppIdentifier);
    }
    const appIdentifier = cfg.appIdentifier.value;

    const tokenValue = cfg.token._tag === "Some" ? cfg.token.value : undefined;
    if (tokenValue !== undefined) {
      return {
        token: Redacted.make(tokenValue),
        apiBaseUrl: cfg.apiBaseUrl,
        appIdentifier,
      };
    }

    if (cfg.email._tag === "Some" && cfg.password._tag === "Some") {
      const token = yield* login(cfg.email.value, cfg.password.value, {
        appIdentifier,
        apiBaseUrl: cfg.apiBaseUrl,
      });
      return {
        token: Redacted.make(token),
        apiBaseUrl: cfg.apiBaseUrl,
        appIdentifier,
      };
    }

    return yield* Effect.fail(missingCredentials);
    // Resolved once at layer build; handed to the protocol as a constant.
  }).pipe(Effect.orDie, Effect.map(Effect.succeed)),
);
