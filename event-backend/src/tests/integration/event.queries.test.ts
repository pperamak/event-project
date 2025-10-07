import { beforeAll, afterAll, describe, expect, test } from "vitest";
import request from "supertest";
import { createServer } from "../../server.js";
import { sequelize } from "../../util/db.js";
import { User } from "../../models/index.js";
import { Event } from "../../models/index.js";
import jwt from "jsonwebtoken";
import { SECRET } from "../../util/config.js";
import type { Express } from "express";

let app: Express;
let token: string;
let currentUser: User;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const serverData = await createServer();
  app = serverData.app;

  currentUser = await User.create({
    name: "Test User",
    email: "testuser@example.com",
    passwordHash: "hashedpassword123",
  });

  const userForToken = { email: currentUser.email, id: currentUser.id };
  token = jwt.sign(userForToken, SECRET);
});

afterAll(async () => {
  await sequelize.close();
});

describe("Event resolvers", () => {
  test("createEvent mutation creates an event for the logged in user", async () => {
    const mutation = `
      mutation CreateEvent($name: String!, $time: String!, $description: String!) {
        createEvent(name: $name, time: $time, description: $description) {
          id
          name
          time
          description
          user {
            id
            name
            email
          }
        }
      }
    `;

    const variables = {
      name: "GraphQL Meetup",
      time: new Date("2025-12-15T18:00:00.000Z").toISOString(),
      description: "An event to discuss GraphQL best practices",
    };

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({ query: mutation, variables });


    //console.log("Hökä response: ", response);
    //expect(response.status).toBe(200);
    const event = response.body.data.createEvent;

    expect(event.name).toBe(variables.name);
    expect(event.description).toBe(variables.description);
    expect(event.user).toMatchObject({
      id: String(currentUser.id),
      name: currentUser.name,
      email: currentUser.email,
    });

    const inDb = await Event.findByPk(event.id, { include: { model: User, as: "user" } });
    expect(inDb?.userId).toBe(currentUser.id);
  });

  test("allEvents query returns events including their users", async () => {
    const query = `
      query {
        allEvents {
          id
          name
          description
          user {
            id
            name
            email
          }
        }
      }
    `;

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({ query });

    //expect(response.status).toBe(200);
    const events = response.body.data.allEvents;
    expect(events.length).toBeGreaterThan(0);

    const [first] = events;
    expect(first.user).toMatchObject({
      id: String(currentUser.id),
      name: currentUser.name,
      email: currentUser.email,
    });
  });

  test("createEvent mutation fails if not authenticated", async () => {
    const mutation = `
      mutation {
        createEvent(
          name: "Unauthorized Event"
          time: "${new Date("2025-12-20T18:00:00.000Z").toISOString()}"
          description: "Should fail because no auth"
        ) {
          id
          name
        }
      }
    `;

    const response = await request(app)
      .post("/graphql")
      // No Authorization header
      .send({ query: mutation });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toMatch(/Not authenticated/i);
    expect(response.body.data).toBeNull();
  });
});