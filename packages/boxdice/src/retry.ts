/**
 * Box+Dice retry configuration.
 *
 * Defines the per-SDK `Retry` Context.Service tag that generated operations
 * wire into `API.make`.
 *
 * Box+Dice rate-limits every paginated endpoint INDIVIDUALLY and always says
 * how long to wait: `Retry-After` rides on 429s and on ordinary 200/204
 * responses alike (defaulting to 10s after a 200, 60s after a 204). Core's
 * throttling policy honours a server-supplied `retryAfter` ahead of its own
 * backoff, so {@link throttling} is the right default for a sync loop.
 *
 * @example
 * ```ts
 * import * as BoxDice from "@smartretraining/boxdice-effect";
 *
 * myEffect.pipe(BoxDice.Retry.throttling);
 * ```
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

/** Context tag for configuring retry behavior of Box+Dice API calls. */
export class Retry extends Context.Service<Retry, Policy>()("BoxDiceRetry") {}

/** Provides a custom retry policy to every Box+Dice API call below it. */
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
