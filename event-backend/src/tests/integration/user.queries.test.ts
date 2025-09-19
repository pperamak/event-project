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
  //await sequelize.sync({ force: true }); // reset schema
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await User.destroy({ where: {} });
});

describe("User Queries", () => {
  const ALL_USERS = `
    query {
      allUsers {
        id
        name
        email
      }
    }
  `;

  test("returns empty list when no users exist", async () => {
    const res = await request(app).post("/graphql").send({ query: ALL_USERS });

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.allUsers).toEqual([]);
  });

  test("returns all users in the DB", async () => {
    const hash1 = await bcrypt.hash("password1", 10);
    const hash2 = await bcrypt.hash("password2", 10);

    await User.bulkCreate([
      { name: "Alice", email: "alice2@example.com", passwordHash: hash1 },
      { name: "Bob", email: "bob2@example.com", passwordHash: hash2 },
    ]);

    const res = await request(app).post("/graphql").send({ query: ALL_USERS });

    expect(res.body.errors).toBeUndefined();
    //console.log(res.body.data.allUsers);
    expect(res.body.data.allUsers).toHaveLength(2);
    

    const emails = res.body.data.allUsers.map((u: any) => u.email);
    expect(emails).toContain("alice2@example.com");
    expect(emails).toContain("bob2@example.com");

    const names = res.body.data.allUsers.map((u: any) => u.name);
    expect(names).toContain("Alice");
    expect(names).toContain("Bob");
  });
});