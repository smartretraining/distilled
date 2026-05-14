/**
 * Rex SDK for Effect
 *
 * Effect-native SDK for the Rex Software real-estate API, generated from
 * Rex's own `describe` / `describeModel` introspection endpoints.
 *
 * @example
 * ```ts
 * import * as Rex from "@smartretraining/rex-effect";
 * ```
 */
export * from "./credentials.ts";
export * as Category from "./category.ts";
export * as T from "./traits.ts";
export * as Retry from "./retry.ts";
export { API } from "./client.ts";
export * from "./errors.ts";
export * from "./webhooks.ts";
export * from "./operations/index.ts";
export { SensitiveString, SensitiveNullableString } from "./sensitive.ts";
