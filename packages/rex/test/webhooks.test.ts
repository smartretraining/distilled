import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { decodeWebhookDelivery } from "../src/webhooks.ts";

// Example payloads taken verbatim from the Rex webhooks documentation.
const fullChangeDelivery = {
  data: [
    {
      id: "4b358d12-b0f0-11ec-a886-c2ade99df33d",
      type: "notes.updated",
      payload: {
        data: {
          pre: { id: 7838281, etag: "7838281-140000000", note: "This is a note" },
          post: { id: 7838281, etag: "7838281-140000000", note: "Edited note" },
        },
        format: "v1_full_change_detail",
        context: {},
      },
      created_at: "2022-01-01T12:00:00.000+00:00",
    },
  ],
};

const contextOnlyDelivery = {
  data: [
    {
      id: "8bc0c6be-e812-4a03-a21c-3d6b53a8f2d5",
      type: "notes.created",
      payload: {
        format: "v1_context_only",
        context: {
          service: "Notes",
          record_id: 7838281,
          account_id: "100",
          triggered_by_user: {
            id: "1",
            name: "Example User",
            first_name: "Example",
            last_name: "User",
            email_address: "user@example.com",
          },
        },
      },
      created_at: "2022-01-01T12:00:00.000+00:00",
    },
  ],
};

describe("decodeWebhookDelivery", () => {
  it("decodes a v1_full_change_detail delivery and narrows on format", async () => {
    const delivery = await Effect.runPromise(
      decodeWebhookDelivery(fullChangeDelivery),
    );
    const event = delivery.data[0]!;
    expect(event.type).toBe("notes.updated");

    if (event.payload.format !== "v1_full_change_detail") {
      throw new Error("expected full-change payload");
    }
    expect(event.payload.data.pre).not.toBeNull();
    expect(event.payload.data.post).not.toBeNull();
    expect(event.payload.data.post?.note).toBe("Edited note");
  });

  it("decodes a v1_context_only delivery", async () => {
    const delivery = await Effect.runPromise(
      decodeWebhookDelivery(contextOnlyDelivery),
    );
    const event = delivery.data[0]!;

    if (event.payload.format !== "v1_context_only") {
      throw new Error("expected context-only payload");
    }
    expect(event.payload.context.service).toBe("Notes");
    expect(event.payload.context.record_id).toBe(7838281);
    expect(event.payload.context.triggered_by_user?.email_address).toBe(
      "user@example.com",
    );
  });

  it("accepts pre: null for create events", async () => {
    const delivery = await Effect.runPromise(
      decodeWebhookDelivery({
        data: [
          {
            id: "evt",
            type: "notes.created",
            payload: {
              format: "v1_full_change_detail",
              data: { pre: null, post: { id: 1 } },
            },
            created_at: "2022-01-01T12:00:00.000+00:00",
          },
        ],
      }),
    );
    const event = delivery.data[0]!;
    if (event.payload.format !== "v1_full_change_detail") {
      throw new Error("expected full-change payload");
    }
    expect(event.payload.data.pre).toBeNull();
  });

  it("fails with RexParseError on a malformed body", async () => {
    const error = await Effect.runPromise(
      decodeWebhookDelivery({ data: [{ id: 123 }] }).pipe(Effect.flip),
    );
    expect((error as { _tag: string })._tag).toBe("RexParseError");
  });
});
