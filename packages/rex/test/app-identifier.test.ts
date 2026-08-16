/**
 * Offline tests for the mandatory `X-App-Identifier` header (Rex's
 * `Integration:Company:Service` integration convention). Stubs global
 * `fetch`, so no credentials are needed.
 *
 * The stub is installed once for the whole file: the operation → protocol →
 * HttpClient layer stack is memoized across runs, so the first run's `fetch`
 * closure is reused by later ones — a per-test `vi.stubGlobal` would leave
 * later tests writing into the first test's capture array.
 */
import { Effect, Layer } from "effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CredentialsFromToken, login } from "../src/credentials.ts";
import { listingsSearch } from "../src/services/rex.ts";

const requests: Request[] = [];
let result: unknown = null;

vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
  requests.push(new Request(input, init));
  return new Response(JSON.stringify({ result, error: null }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

beforeEach(() => {
  requests.length = 0;
  result = null;
});

describe("X-App-Identifier", () => {
  it("is sent on API requests, alongside the bearer token", async () => {
    await Effect.runPromise(
      listingsSearch({ limit: 1 }).pipe(
        Effect.provide(
          Layer.merge(
            FetchHttpClient.layer,
            CredentialsFromToken("test-token", {
              appIdentifier: "Integration:Acme:website",
            }),
          ),
        ),
      ) as Effect.Effect<unknown>,
    );

    expect(requests).toHaveLength(1);
    expect(requests[0]!.headers.get("x-app-identifier")).toBe(
      "Integration:Acme:website",
    );
    expect(requests[0]!.headers.get("authorization")).toBe("Bearer test-token");
  });

  it("is sent on the Authentication/login exchange", async () => {
    result = "session-token";
    const token = await Effect.runPromise(
      login("you@example.com", "pw", {
        appIdentifier: "Integration:Acme:website",
      }),
    );

    expect(token).toBe("session-token");
    expect(requests).toHaveLength(1);
    expect(requests[0]!.url).toContain("Authentication/login");
    expect(requests[0]!.headers.get("x-app-identifier")).toBe(
      "Integration:Acme:website",
    );
  });
});
