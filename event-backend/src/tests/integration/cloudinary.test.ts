import { describe, expect, test } from "vitest";
import request from "supertest";
import { createServer } from "../../server.js";
import type { Express } from "express";

let app: Express;

beforeAll(async () => {
  const serverData = await createServer();
  app = serverData.app;
});

describe("Cloudinary resolver", () => {
  const MUTATION = `
    mutation {
      getCloudinarySignature {
        signature
        timestamp
        cloudName
        apiKey
      }
    }
  `;

  test("returns a valid Cloudinary signature payload", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({ query: MUTATION });

    if (response.body.errors) {
      console.error(response.body.errors);
    }

    expect(response.body.errors).toBeUndefined();

    const data = response.body.data.getCloudinarySignature;

    expect(data).toBeDefined();

    // basic shape
    expect(typeof data.signature).toBe("string");
    expect(data.signature.length).toBeGreaterThan(0);

    expect(typeof data.timestamp).toBe("number");

    expect(typeof data.cloudName).toBe("string");
    expect(data.cloudName.length).toBeGreaterThan(0);

    expect(typeof data.apiKey).toBe("string");
    expect(data.apiKey.length).toBeGreaterThan(0);
  });

  test("timestamp is recent (within 10 seconds)", async () => {
    const before = Math.floor(Date.now() / 1000);

    const response = await request(app)
      .post("/graphql")
      .send({ query: MUTATION });

    const after = Math.floor(Date.now() / 1000);

    const { timestamp } = response.body.data.getCloudinarySignature;

    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after + 10);
  });
});