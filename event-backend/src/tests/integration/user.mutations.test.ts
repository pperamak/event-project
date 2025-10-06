import { beforeAll, afterAll, beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import { createServer } from "../../server.js";
import  { User }  from "../../models/index.js";
import { sequelize } from "../../util/db.js";
import type { Express } from "express";

let app: Express;

beforeAll(async () => {
  const serverData = await createServer();
  app = serverData.app;
  //await sequelize.authenticate();
  //await sequelize.sync({ force: true }); // reset schema
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await User.destroy({ where: {} }); // clear users before each test
});

describe("User Mutations", () => {
  describe("createUser", () => {
    const CREATE_USER = `
      mutation CreateUser($name: String!, $email: String!, $password: String!) {
        createUser(name: $name, email: $email, password: $password) {
          id
          name
          email
        }
      }
    `;

    test("creates a new user with hashed password", async () => {
      const res = await request(app)
        .post("/graphql")
        .send({
          query: CREATE_USER,
          variables: {
            name: "Alice",
            email: "aliceum@example.com",
            password: "secret123",
          },
        });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.createUser.email).toBe("aliceum@example.com");
      expect(res.body.data.createUser.name).toBe("Alice");

      const stored = await User.findOne({ where: { email: "aliceum@example.com" } });
      expect(stored).not.toBeNull();
      expect(await bcrypt.compare("secret123", stored!.passwordHash)).toBe(true);
    });

    test("fails when email already exists", async () => {
      await User.create({
        name: "Bob",
        email: "bob@example.com",
        passwordHash: await bcrypt.hash("whatever", 10),
      });

      const res = await request(app)
        .post("/graphql")
        .send({
          query: CREATE_USER,
          variables: {
            name: "Bob Again",
            email: "bob@example.com",
            password: "newpassword",
          },
        });

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(/Email must be unique/i);
    });
  });

  describe("login", () => {
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

    test("returns a JWT and user on valid credentials", async () => {
      const hash = await bcrypt.hash("mypassword", 10);
      await User.create({
        name: "Charlie",
        email: "charlie@example.com",
        passwordHash: hash,
      });

      const res = await request(app)
        .post("/graphql")
        .send({
          query: LOGIN,
          variables: { email: "charlie@example.com", password: "mypassword" },
        });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.login.user.email).toBe("charlie@example.com");
      expect(res.body.data.login.value).toBeDefined();
      expect(res.body.data.login.value).not.toHaveLength(0);
    });

    test("fails with wrong password", async () => {
      const hash = await bcrypt.hash("correct", 10);
      await User.create({
        name: "David",
        email: "david@example.com",
        passwordHash: hash,
      });

      const res = await request(app)
        .post("/graphql")
        .send({
          query: LOGIN,
          variables: { email: "david@example.com", password: "incorrect" },
        });

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(/wrong credentials/i);
    });

    test("fails with non-existent email", async () => {
      const res = await request(app)
        .post("/graphql")
        .send({
          query: LOGIN,
          variables: { email: "nobody@example.com", password: "password" },
        });

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(/wrong credentials/i);
    });
  });
});