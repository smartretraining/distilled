import * as Layer from "effect/Layer";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import type * as HttpClient from "effect/unstable/http/HttpClient";
import { Credentials, fromApiKey } from "../src/credentials.ts";

export interface Call {
  readonly url: string;
  readonly method: string;
  readonly headers: Record<string, string>;
  readonly body: string | undefined;
}

/**
 * A layer that answers every request from `respond`, recording what was sent.
 *
 * No VaultRE account exists to test against — a key is issued to registered
 * integrators only — so the wire is stubbed at `FetchHttpClient.Fetch`, which
 * is the lowest seam that still exercises the real request builder, the real
 * protocol layer and the real generated schemas.
 */
export const stubClient = (
  respond: (call: Call, index: number) => Response,
): {
  readonly calls: Call[];
  readonly layer: Layer.Layer<HttpClient.HttpClient | Credentials>;
} => {
  const calls: Call[] = [];
  const fetch = (async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const call: Call = {
      url: String(input),
      method: init?.method ?? "GET",
      headers: { ...((init?.headers ?? {}) as Record<string, string>) },
      body: typeof init?.body === "string" ? init.body : undefined,
    };
    calls.push(call);
    return respond(call, calls.length - 1);
  }) as typeof globalThis.fetch;

  return {
    calls,
    layer: Layer.mergeAll(
      FetchHttpClient.layer,
      Layer.succeed(FetchHttpClient.Fetch, fetch),
      fromApiKey({ apiKey: "integrator-key", accessToken: "agency-token" }),
    ),
  };
};

/** A JSON response, the way VaultRE sends one. */
export const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
