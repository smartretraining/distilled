import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import { describe, expect, it } from "vitest";
import { UnknownVaultreError } from "../src/errors.ts";
import * as Retry from "../src/retry.ts";
import {
  BadRequest,
  getAdvertisingSupplier,
  getPropertiesLifeSale,
} from "../src/services/vaultre.ts";
import { json, stubClient } from "./setup.ts";

/**
 * The protocol layer against a stubbed wire.
 *
 * Every claim here is read off the vendor's OpenAPI document rather than
 * observed on a live account, so these tests pin what this package BELIEVES.
 * When a key arrives, a failure here is the fastest way to see which belief
 * was wrong.
 */
describe("VaultRE protocol", () => {
  /** The typed failure, insisting it is one — a defect would mean the error envelope went unrecognised. */
  const failure = (exit: Exit.Exit<unknown, unknown>): any => {
    if (Exit.isSuccess(exit))
      throw new Error("expected a failure, got a success");
    expect(Cause.hasDies(exit.cause)).toBe(false);
    const error = Cause.findErrorOption(exit.cause);
    expect(error._tag).toBe("Some");
    return (error as { value: any }).value;
  };

  it("sends both secrets, on the versioned base URL", async () => {
    const stub = stubClient(() => json({ id: 7, name: "Domain" }));

    await Effect.runPromise(
      getAdvertisingSupplier({ id: 7 }).pipe(Effect.provide(stub.layer)),
    );

    const [call] = stub.calls;
    expect(call!.url).toBe(
      "https://ap-southeast-2.api.vaultre.com.au/api/v1.3/advertising/suppliers/7",
    );
    // Both, on every request: the integrator key identifies the software and
    // the bearer token identifies the agency. Neither is an operation input.
    expect(call!.headers["x-api-key"]).toBe("integrator-key");
    expect(call!.headers["authorization"]).toBe("Bearer agency-token");
  });

  it("turns a SuccessOrError 400 into the operation's typed BadRequest", async () => {
    const stub = stubClient(() =>
      json(
        { success: false, msg: "Supplier not found", code: "NOT_FOUND" },
        400,
      ),
    );

    const error = failure(
      await Effect.runPromiseExit(
        getAdvertisingSupplier({ id: 7 }).pipe(Effect.provide(stub.layer)),
      ),
    );

    expect(error).toBeInstanceOf(BadRequest);
    // VaultRE's codes are strings and core keeps `code` only when it is
    // numeric, so the protocol folds it into the message. Without that, the
    // caller sees "Supplier not found" and never learns it was a NOT_FOUND.
    expect(error.message).toBe("NOT_FOUND: Supplier not found");
  });

  it("falls through to UnknownVaultreError, body intact, on an unfamiliar shape", async () => {
    const stub = stubClient(() =>
      json({ errors: [{ detail: "something else entirely" }] }, 418),
    );

    const error = failure(
      await Effect.runPromiseExit(
        getAdvertisingSupplier({ id: 7 }).pipe(
          Retry.none,
          Effect.provide(stub.layer),
        ),
      ),
    );

    expect(error).toBeInstanceOf(UnknownVaultreError);
    expect(error.body).toEqual({
      errors: [{ detail: "something else entirely" }],
    });
  });

  it("stops after one 429 when retries are off", async () => {
    const stub = stubClient(() =>
      json({ success: false, msg: "Rate limit exceeded" }, 429),
    );

    const error = failure(
      await Effect.runPromiseExit(
        getPropertiesLifeSale({ pagesize: 1 }).pipe(
          Retry.none,
          Effect.provide(stub.layer),
        ),
      ),
    );

    expect(error._tag).toBe("TooManyRequests");
    expect(stub.calls).toHaveLength(1);
  });
});
