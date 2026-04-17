/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import EventDiscussion from "../EventDiscussion";

import { GET_EVENT_MESSAGES } from "../../../graphql/queries";
import { ADD_MESSAGE } from "../../../graphql/mutations";

// 🧩 Mock data
const mockMessages = [
  {
    id: "1",
    content: "First message",
    createdAt: new Date().toISOString(),
    user: {
      id: "10",
      name: "Alice",
      email: "alice@example.com",
    },
    upvotes: 3,
    downvotes: 1,
    myReaction: "UP",
    reactions: [],
  },
  {
    id: "2",
    content: "Second message",
    createdAt: new Date().toISOString(),
    user: {
      id: "11",
      name: "Bob",
      email: "bob@example.com",
    },
    upvotes: 0,
    downvotes: 2,
    myReaction: null,
    reactions: [],
  },
];

// ✅ Query mock
const queryMocks = [
  {
    request: {
      query: GET_EVENT_MESSAGES,
      variables: { eventId: "1" },
    },
    result: {
      data: {
        eventMessages: mockMessages,
      },
    },
  },
];

// ✅ Mutation mock
const mutationMocks = [
  {
    request: {
      query: ADD_MESSAGE,
      variables: {
        eventId: "1",
        content: "New message",
      },
    },
    result: {
      data: {
        addMessage: {
          id: "3",
          content: "New message",
          createdAt: new Date().toISOString(),
          user: {
            id: "10",
            name: "Alice",
            email: "alice@example.com",
          },
        },
      },
    },
  },
];

describe("EventDiscussion", () => {
  it("renders loading state", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EventDiscussion eventId="1" />
      </MockedProvider>
    );

    expect(screen.getByText(/loading discussion/i)).toBeInTheDocument();
  });

  it("renders messages correctly", async () => {
    render(
      <MockedProvider mocks={queryMocks} addTypename={false}>
        <EventDiscussion eventId="1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("First message")).toBeInTheDocument();
      expect(screen.getByText("Second message")).toBeInTheDocument();
    });

    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(screen.getByText(/Bob/)).toBeInTheDocument();
  });

  it("renders reaction buttons with correct active state", async () => {
    render(
      <MockedProvider mocks={queryMocks} addTypename={false}>
        <EventDiscussion eventId="1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("First message")).toBeInTheDocument();
    });

    // 👍 UP button for first message should be active
    const upButtons = screen.getAllByText(/👍/);
    const firstUpButton = upButtons[0];

    expect(firstUpButton.className).toMatch(/bg-red-500/);

    // 👎 DOWN button for second message should NOT be active
    const downButtons = screen.getAllByText(/👎/);
    const secondDownButton = downButtons[1];

    expect(secondDownButton.className).toMatch(/bg-gray-200/);
  });

  it("allows posting a new message", async () => {
    render(
      <MockedProvider
        mocks={[...queryMocks, ...mutationMocks]}
        addTypename={false}
      >
        <EventDiscussion eventId="1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("First message")).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/write a message/i);
    const button = screen.getByRole("button", { name: /post message/i });

    fireEvent.change(textarea, {
      target: { value: "New message" },
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it("renders error state", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_EVENT_MESSAGES,
          variables: { eventId: "1" },
        },
        error: new Error("Failed to fetch"),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <EventDiscussion eventId="1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it("renders empty state", async () => {
    const emptyMocks = [
      {
        request: {
          query: GET_EVENT_MESSAGES,
          variables: { eventId: "1" },
        },
        result: {
          data: {
            eventMessages: [],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <EventDiscussion eventId="1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/discussion/i)).toBeInTheDocument();
    });
  });
});