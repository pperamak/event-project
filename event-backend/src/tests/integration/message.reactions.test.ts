import { beforeAll, afterAll, beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import { createServer } from "../../server.js";
import { sequelize } from "../../util/db.js";
import { User, Event, DiscussionMessage, MessageReaction } from "../../models/index.js";
import jwt from "jsonwebtoken";
import { SECRET } from "../../util/config.js";
import type { Express } from "express";

let app: Express;
let token: string;
let token2: string;
let user: User;
let user2: User;
let event: Event;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let messageId: number;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const serverData = await createServer();
  app = serverData.app;

  // create users
  user = await User.create({
    name: "User1",
    email: "user1@example.com",
    passwordHash: "hashed",
  });

  user2 = await User.create({
    name: "User2",
    email: "user2@example.com",
    passwordHash: "hashed",
  });

  token = jwt.sign({ id: user.id, email: user.email }, SECRET);
  token2 = jwt.sign({ id: user2.id, email: user2.email }, SECRET);

  // create event
  event = await Event.create({
    name: "Test Event",
    description: "desc",
    time: new Date(),
    userId: user.id,
  });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await DiscussionMessage.destroy({ where: {} });
  await MessageReaction.destroy({ where: {} });
});

describe("Discussion messages & reactions", () => {
  test("addMessage creates a message", async () => {
    const mutation = `
      mutation AddMessage($eventId: ID!, $content: String!) {
        addMessage(eventId: $eventId, content: $content) {
          id
          content
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: mutation,
        variables: { eventId: event.id, content: "Hello world" },
      });

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.addMessage.content).toBe("Hello world");

    messageId = Number(res.body.data.addMessage.id);
  });

  test("eventMessages returns messages with counts and myReaction", async () => {
    // create message
    const _message = await DiscussionMessage.create({
      content: "Test message",
      userId: user.id,
      eventId: event.id,
    });

    const query = `
      query ($eventId: ID!) {
        eventMessages(eventId: $eventId) {
          id
          content
          upvotes
          downvotes
          myReaction
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({ query, variables: { eventId: event.id } });

    expect(res.body.errors).toBeUndefined();
    const msg = res.body.data.eventMessages[0];

    expect(msg.upvotes).toBe(0);
    expect(msg.downvotes).toBe(0);
    expect(msg.myReaction).toBeNull();
  });

  test("reactToMessage creates an UP reaction", async () => {
    const message = await DiscussionMessage.create({
      content: "React test",
      userId: user.id,
      eventId: event.id,
    });

    const mutation = `
      mutation ($messageId: ID!, $type: ReactionType!) {
        reactToMessage(messageId: $messageId, type: $type) {
          messageId
          upvotes
          downvotes
          myReaction
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: mutation,
        variables: { messageId: message.id, type: "UP" },
      });

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.reactToMessage).toMatchObject({
      upvotes: 1,
      downvotes: 0,
      myReaction: "UP",
    });
  });

  test("reactToMessage toggles OFF when clicking same reaction", async () => {
    const message = await DiscussionMessage.create({
      content: "Toggle test",
      userId: user.id,
      eventId: event.id,
    });

    const mutation = `
      mutation ($messageId: ID!, $type: ReactionType!) {
        reactToMessage(messageId: $messageId, type: $type) {
          upvotes
          downvotes
          myReaction
        }
      }
    `;

    // first click
    await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: mutation,
        variables: { messageId: message.id, type: "UP" },
      });

    // second click (toggle off)
    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: mutation,
        variables: { messageId: message.id, type: "UP" },
      });

    expect(res.body.data.reactToMessage.myReaction).toBeNull();

    const reactions = await MessageReaction.findAll();
    expect(reactions.length).toBe(0);
  });

  test("reactToMessage switches from UP to DOWN", async () => {
    const message = await DiscussionMessage.create({
      content: "Switch test",
      userId: user.id,
      eventId: event.id,
    });

    const mutation = `
      mutation ($messageId: ID!, $type: ReactionType!) {
        reactToMessage(messageId: $messageId, type: $type) {
          upvotes
          downvotes
          myReaction
        }
      }
    `;

    // UP
    await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: mutation,
        variables: { messageId: message.id, type: "UP" },
      });

    // switch to DOWN
    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: mutation,
        variables: { messageId: message.id, type: "DOWN" },
      });

    expect(res.body.data.reactToMessage).toMatchObject({
      upvotes: 0,
      downvotes: 1,
      myReaction: "DOWN",
    });
  });

  test("multiple users reactions are counted correctly", async () => {
    const message = await DiscussionMessage.create({
      content: "Multi-user test",
      userId: user.id,
      eventId: event.id,
    });

    const mutation = `
      mutation ($messageId: ID!, $type: ReactionType!) {
        reactToMessage(messageId: $messageId, type: $type) {
          upvotes
          downvotes
          myReaction
        }
      }
    `;

    // user1 -> UP
    await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: mutation,
        variables: { messageId: message.id, type: "UP" },
      });

    // user2 -> DOWN
    await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        query: mutation,
        variables: { messageId: message.id, type: "DOWN" },
      });

    const query = `
      query ($eventId: ID!) {
        eventMessages(eventId: $eventId) {
          upvotes
          downvotes
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .send({ query, variables: { eventId: event.id } });

    const msg = res.body.data.eventMessages[0];

    expect(msg.upvotes).toBe(1);
    expect(msg.downvotes).toBe(1);
  });
});
