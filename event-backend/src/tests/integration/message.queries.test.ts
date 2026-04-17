import { beforeAll, afterAll, beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import { createServer } from "../../server.js";
import { sequelize } from "../../util/db.js";
import { User, Event, DiscussionMessage, MessageReaction } from "../../models/index.js";
import jwt from "jsonwebtoken";
import { SECRET } from "../../util/config.js";
import type { Express } from "express";

let app: Express;
let tokenUser1: string;
let tokenUser2: string;
let user1: User;
let user2: User;
let event: Event;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const serverData = await createServer();
  app = serverData.app;

  // create users
  user1 = await User.create({
    name: "User One",
    email: "user1@test.com",
    passwordHash: "hash1",
  });

  user2 = await User.create({
    name: "User Two",
    email: "user2@test.com",
    passwordHash: "hash2",
  });

  // tokens
  tokenUser1 = jwt.sign({ id: user1.id, email: user1.email }, SECRET);
  tokenUser2 = jwt.sign({ id: user2.id, email: user2.email }, SECRET);

  // create event
  event = await Event.create({
    name: "Test Event",
    description: "Event for messages",
    time: new Date(),
    userId: user1.id,
  });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await DiscussionMessage.destroy({ where: {} });
  await MessageReaction.destroy({ where: {} });
});

describe("Message queries (eventMessages)", () => {
  const ADD_MESSAGE = `
    mutation AddMessage($eventId: ID!, $content: String!) {
      addMessage(eventId: $eventId, content: $content) {
        id
        content
      }
    }
  `;

  const REACT = `
    mutation React($messageId: ID!, $type: ReactionType!) {
      reactToMessage(messageId: $messageId, type: $type) {
        messageId
        upvotes
        downvotes
        myReaction
      }
    }
  `;

  const EVENT_MESSAGES = `
    query EventMessages($eventId: ID!) {
      eventMessages(eventId: $eventId) {
        id
        content
        myReaction
        upvotes
        downvotes
      }
    }
  `;

  test("returns messages for an event", async () => {
    await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        query: ADD_MESSAGE,
        variables: {
          eventId: event.id,
          content: "Hello world",
        },
      });

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        query: EVENT_MESSAGES,
        variables: { eventId: event.id },
      });

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.eventMessages.length).toBe(1);
    expect(res.body.data.eventMessages[0].content).toBe("Hello world");
  });

  test("includes myReaction for the current user", async () => {
    // create message
    const msgRes = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        query: ADD_MESSAGE,
        variables: {
          eventId: event.id,
          content: "React to me",
        },
      });

    const messageId = msgRes.body.data.addMessage.id;

    // react as user1
    await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        query: REACT,
        variables: {
          messageId,
          type: "UP",
        },
      });

    // fetch messages as user1
    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        query: EVENT_MESSAGES,
        variables: { eventId: event.id },
      });

    const message = res.body.data.eventMessages[0];

    expect(message.myReaction).toBe("UP");
    expect(message.upvotes).toBe(1);
    expect(message.downvotes).toBe(0);
  });

  test("myReaction is null for other users", async () => {
    // create message
    const msgRes = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        query: ADD_MESSAGE,
        variables: {
          eventId: event.id,
          content: "Only user1 reacts",
        },
      });

    const messageId = msgRes.body.data.addMessage.id;

    // user1 reacts
    await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        query: REACT,
        variables: {
          messageId,
          type: "DOWN",
        },
      });

    // fetch as user2
    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({
        query: EVENT_MESSAGES,
        variables: { eventId: event.id },
      });

    const message = res.body.data.eventMessages[0];

    expect(message.myReaction).toBeNull();
    expect(message.upvotes).toBe(0);
    expect(message.downvotes).toBe(1);
  });

  test("returns correct counts with multiple users reacting", async () => {
    // create message
    const msgRes = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        query: ADD_MESSAGE,
        variables: {
          eventId: event.id,
          content: "Mixed reactions",
        },
      });

    const messageId = msgRes.body.data.addMessage.id;

    // user1 → UP
    await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        query: REACT,
        variables: { messageId, type: "UP" },
      });

    // user2 → DOWN
    await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({
        query: REACT,
        variables: { messageId, type: "DOWN" },
      });

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        query: EVENT_MESSAGES,
        variables: { eventId: event.id },
      });

    const message = res.body.data.eventMessages[0];

    expect(message.upvotes).toBe(1);
    expect(message.downvotes).toBe(1);
    expect(message.myReaction).toBe("UP");
  });
});