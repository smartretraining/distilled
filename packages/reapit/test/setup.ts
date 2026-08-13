import { config } from "dotenv";
import { Effect, Layer } from "effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { resolve } from "path";
import { CredentialsFromEnv } from "../src/credentials.ts";

config({ path: resolve(import.meta.dirname, "../../../.env") });
config({ path: resolve(import.meta.dirname, ".env") });

/**
 * Credentials (REAPIT_CLIENT_ID + REAPIT_API_KEY) plus the HTTP client,
 * provided to every test.
 *
 * Reapit API keys are IP-restricted, so these tests only pass from an
 * address registered against the key.
 */
export const MainLayer = Layer.merge(CredentialsFromEnv, FetchHttpClient.layer);

/** Run an Effect with the MainLayer provided. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const runEffect = <A, E>(effect: Effect.Effect<A, E, any>): Promise<A> =>
  Effect.runPromise(Effect.provide(effect, MainLayer));
