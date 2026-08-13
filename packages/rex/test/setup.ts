import { config } from "dotenv";
import { Effect, Layer } from "effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { resolve } from "path";
import { CredentialsFromEnv } from "../src/credentials.ts";

config({ path: resolve(import.meta.dirname, "../../../.env") });
config({ path: resolve(import.meta.dirname, ".env") });

// Credentials (resolved from REX_API_TOKEN, or REX_EMAIL + REX_PASSWORD via
// the login exchange) plus the HTTP client, provided to every test.
export const MainLayer = Layer.merge(CredentialsFromEnv, FetchHttpClient.layer);

/** Run an Effect with the MainLayer provided. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const runEffect = <A, E>(effect: Effect.Effect<A, E, any>): Promise<A> =>
  Effect.runPromise(
    effect.pipe(Effect.provide(MainLayer)) as Effect.Effect<A, E, never>,
  );
