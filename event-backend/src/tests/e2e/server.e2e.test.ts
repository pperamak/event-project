import { beforeAll, afterAll, beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
//import bcrypt from "bcrypt";
import { createServer } from "../../server.js";
import User from "../../models/user.js";
import { sequelize } from "../../util/db.js";
import type { Express } from "express";

let app: Express;

beforeAll(async () => {
  const serverData = await createServer();
  app = serverData.app;
  //await sequelize.sync({ force: true }); // reset schema for e2e run
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await User.destroy({ where: {} });
});

describe("E2E: User flow", () => {
  const CREATE_USER = `
    mutation CreateUser($name: String!, $email: String!, $password: String!) {
      createUser(name: $name, email: $email, password: $password) {
        id
        name
        email
      }
    }
  `;

  const LOGIN = `
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

  const ALL_USERS = `
    query {
      allUsers {
        id
        name
        email
      }
    }
  `;

  test("signup → login → allUsers roundtrip", async () => {
    // 1. Create user
    const signupRes = await request(app)
      .post("/graphql")
      .send({
        query: CREATE_USER,
        variables: { name: "E2E Alice", email: "e2ealice@example.com", password: "secret123" },
      });

    expect(signupRes.body.errors).toBeUndefined();
    expect(signupRes.body.data.createUser.email).toBe("e2ealice@example.com");

    // 2. Login
    const loginRes = await request(app)
      .post("/graphql")
      .send({
        query: LOGIN,
        variables: { email: "e2ealice@example.com", password: "secret123" },
      });

    expect(loginRes.body.errors).toBeUndefined();
    const token = loginRes.body.data.login.value;
    expect(token).toBeDefined();

    // 3. Query allUsers (optionally with auth header if your resolver requires it)
    const usersRes = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({ query: ALL_USERS });

    expect(usersRes.body.errors).toBeUndefined();
    const emails = usersRes.body.data.allUsers.map((u: any) => u.email);
    expect(emails).toContain("e2ealice@example.com");
  });
});