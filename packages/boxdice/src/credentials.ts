/**
 * Box+Dice credentials — hand-written.
 *
 * Box+Dice authenticates with a single bearer-style token in a bespoke scheme:
 *
 *   Authorization: Api-Key token=b3c7623c3ad30d34fec6226f90914b0af125dc06
 *
 * TWO THINGS ARE UNUSUAL and both are modelled here rather than hidden.
 *
 * 1. THERE IS NO CENTRAL HOST. Every agency is served from its own subdomain —
 *    `https://<tenant>.boxdice.com.au` — so the tenant is part of the
 *    credential, not a deployment constant. A key is generated per OFFICE
 *    GROUP inside the CRM by the agency itself; there is no partner-level
 *    credential that spans tenants, which means a multi-agency integration
 *    holds one of these per agency.
 *
 * 2. THE PATH SEGMENT IS PART OF THE GRANT. Box+Dice runs several
 *    partner-specific APIs off the same host — `/ai_api`, `/enquiry_api`,
 *    `/website_api`, `/plezzel_api` — with overlapping but non-identical
 *    surfaces. This SDK is generated from the AI API blueprint, so `ai_api` is
 *    the default, but which one a key can reach is decided when the key is
 *    provisioned. {@link Config.apiPath} exists because the blueprint's own
 *    `paging.next` URLs come back pointing at `/aire_api/` and `/rebot_api/`
 *    in places — evidence that the same document has been served under
 *    several path segments over the years.
 */
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import { ConfigError } from "@distilled.cloud/core/errors";

/** The API this SDK was generated from. */
export const DEFAULT_API_PATH = "ai_api";

export interface Config {
  /** API token — the `token=` value of the `Authorization` header. */
  readonly token: Redacted.Redacted<string>;
  /**
   * Origin for the agency's Box+Dice instance, e.g.
   * `https://acme.boxdice.com.au`. No trailing slash, no path.
   */
  readonly origin: string;
  /** Path segment of the partner API the key is provisioned for. */
  readonly apiPath: string;
}

export class Credentials extends Context.Service<
  Credentials,
  Effect.Effect<Config>
>()("BoxDiceCredentials") {}

const originFromTenant = (tenant: string): string =>
  `https://${tenant}.boxdice.com.au`;

const trimSlash = (url: string): string => url.replace(/\/+$/, "");

/**
 * Layer from a tenant subdomain and token — the ordinary case.
 *
 * Pass `origin` instead of `tenant` for an instance that is not on
 * `*.boxdice.com.au`.
 */
export const fromToken = (config: {
  readonly token: string;
  readonly tenant?: string;
  readonly origin?: string;
  readonly apiPath?: string;
}): Layer.Layer<Credentials> =>
  Layer.succeed(
    Credentials,
    Effect.gen(function* () {
      const origin =
        config.origin ??
        (config.tenant ? originFromTenant(config.tenant) : undefined);

      if (!origin) {
        return yield* new ConfigError({
          message:
            "Box+Dice credentials require either `tenant` (the agency's " +
            "boxdice.com.au subdomain) or an explicit `origin`",
        });
      }

      return {
        token: Redacted.make(config.token),
        origin: trimSlash(origin),
        apiPath: config.apiPath ?? DEFAULT_API_PATH,
      };
    }).pipe(Effect.orDie),
  );

/**
 * Reads `BOXDICE_API_TOKEN` plus one of `BOXDICE_TENANT` / `BOXDICE_ORIGIN`,
 * and the optional `BOXDICE_API_PATH`.
 *
 * Env-var credentials suit a single-tenant script. A service syncing several
 * agencies should build one {@link fromToken} layer per agency instead — the
 * tenant is part of the credential, so there is no way to swap agencies
 * without swapping the whole layer.
 */
export const CredentialsFromEnv: Layer.Layer<Credentials> = Layer.succeed(
  Credentials,
  Effect.gen(function* () {
    const token = process.env.BOXDICE_API_TOKEN;
    const tenant = process.env.BOXDICE_TENANT;
    const origin = process.env.BOXDICE_ORIGIN;

    if (!token) {
      return yield* new ConfigError({
        message:
          "Box+Dice credentials require the BOXDICE_API_TOKEN environment variable",
      });
    }
    if (!tenant && !origin) {
      return yield* new ConfigError({
        message:
          "Box+Dice credentials require BOXDICE_TENANT (the agency's " +
          "boxdice.com.au subdomain) or BOXDICE_ORIGIN",
      });
    }

    return {
      token: Redacted.make(token),
      origin: trimSlash(origin ?? originFromTenant(tenant!)),
      apiPath: process.env.BOXDICE_API_PATH ?? DEFAULT_API_PATH,
    };
  }).pipe(Effect.orDie),
);
