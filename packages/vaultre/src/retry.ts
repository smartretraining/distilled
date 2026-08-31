/**
 * VaultRE retry configuration.
 *
 * Defines the per-SDK `Retry` Context.Service tag that generated operations
 * wire into `API.make`. Callers can install a blanket retry policy at the
 * layer level and have every VaultRE call below it pick it up:
 *
 * @example
 * ```ts
 * import * as Vaultre from "@smartretraining/vaultre-effect";
 *
 * myEffect.pipe(Vaultre.Retry.throttling);
 * Effect.provide(myEffect, Layer.succeed(Vaultre.Retry.Retry, customPolicy));
 * ```
 *
 * `throttling` is the one to reach for: VaultRE's 10-requests-per-second
 * limit is the failure a sync loop actually hits, and it clears by waiting.
 * The 10,000-per-day quota does not clear until 00:00 UTC, so retrying
 * through one only burns the wait.
 */
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import {
  type Policy,
  throttlingFactory,
  transientFactory,
} from "@distilled.cloud/core/retry";

export {
  type Options,
  type Factory,
  type Policy,
  makeDefault,
  jittered,
  capped,
  throttlingOptions,
  transientOptions,
  throttlingFactory,
  transientFactory,
} from "@distilled.cloud/core/retry";

/** Context tag for configuring retry behavior of VaultRE API calls. */
export class Retry extends Context.Service<Retry, Policy>()("VaultreRetry") {}

/** Provides a custom retry policy to every VaultRE API call below it. */
export const policy = (optionsOrFactory: Policy) =>
  Effect.provide(Layer.succeed(Retry, optionsOrFactory));

/** Disables all automatic retries. */
export const none = Effect.provide(
  Layer.succeed(Retry, { while: () => false }),
);

/** Apply the throttling retry policy (retries throttling errors indefinitely). */
export const throttling = policy(throttlingFactory);

/** Apply the transient retry policy (retries all transient errors indefinitely). */
export const transient = policy(transientFactory);
