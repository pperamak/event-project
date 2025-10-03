import { beforeAll, afterAll, beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import { createServer } from "../../server.js";
import User from "../../models/user.js";
import { sequelize } from "../../util/db.js";
import type { Express } from "express";

let app: Express;

beforeAll(async () => {
  const serverData = await createServer();
  app = serverData.app;
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await User.destroy({ where: {} });
});

const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      value
      user {
        id
        email
        name
      }
    }
  }
`;

// 🔹 helper: create user and log them in
async function createAndLoginUser(
  app: Express,
  { name, email, password }: { name: string; email: string; password: string }
) {
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name, email, passwordHash });

  const res = await request(app).post("/graphql").send({
    query: LOGIN_MUTATION,
    variables: { email, password },
  });

  expect(res.body.errors).toBeUndefined();
  const token = res.body.data.login.value;
  const user = res.body.data.login.user;

  return { token, user };
}

describe("Auth Context & me Query", () => {
  const ME_QUERY = `
    query {
      me {
        id
        name
        email
      }
    }
  `;

  test("returns error if no auth header is provided", async () => {
    const res = await request(app).post("/graphql").send({ query: ME_QUERY });

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toMatch(/not authenticated/i);
  });

  test("returns error if token is invalid", async () => {
    const res = await request(app)
      .post("/graphql")
      .set("Authorization", "Bearer invalidtoken")
      .send({ query: ME_QUERY });

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].extensions.code).toBe("UNAUTHENTICATED");
    expect(res.body.errors[0].message).toMatch(/invalid token/i);
    });

  test("returns current user with valid token (via login)", async () => {
    const { token, user } = await createAndLoginUser(app, {
      name: "Eve",
      email: "eve@example.com",
      password: "password123",
    });

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({ query: ME_QUERY });

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.me.email).toBe(user.email);
    expect(res.body.data.me.name).toBe(user.name);
  });
});