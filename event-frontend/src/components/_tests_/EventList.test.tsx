import { describe, it, expect } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Routes, Route } from "react-router";
import EventList from "../EventList";
import { GET_EVENTS } from "../../queries";

const mockEvents = [
  {
    id: "1",
    name: "Test Event 1",
    description: "This is a test event",
    time: new Date().toISOString(),
    user: {
      id: "1",
      name: "Test User",
      email: "test@example.com",
    },
  },
  {
    id: "2",
    name: "Test Event 2",
    description: "Second event",
    time: new Date().toISOString(),
    user: {
      id: "1",
      name: "Test User",
      email: "test@example.com",
    },
  },
];

const mocks = [
  {
    request: {
      query: GET_EVENTS,
    },
    result: {
      data: {
        allEvents: mockEvents,
      },
    },
  },
];

const errorMocks = [
  {
    request: {
      query: GET_EVENTS,
    },
    error: new Error("Network error"),
  },
];

describe("EventList component", () => {
  it("renders loading state initially", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter>
          <EventList />
        </MemoryRouter>
      </MockedProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders events after successful query", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <EventList />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
      expect(screen.getByText("Test Event 2")).toBeInTheDocument();
    });
  });

  it("renders error message on query failure", async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter>
          <EventList />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it("renders empty list if there are no events", async () => {
    const emptyMocks = [
      {
        request: {
          query: GET_EVENTS,
        },
        result: {
          data: {
            allEvents: [],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <MemoryRouter>
          <EventList />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      const list = screen.queryAllByRole("listitem");
      expect(list.length).toBe(0);
    });
  });

  it("navigates to event detail when an event link is clicked", async () => {
    // Simulate the EventDetail route
    const EventDetailMock = () => <div data-testid="event-detail-page">Event Detail Page</div>;

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={["/events"]}>
          <Routes>
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetailMock />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    // Wait until events are loaded
    await waitFor(() => {
      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
    });

    // Click on the first event link
    const firstEvent = screen.getByText("Test Event 1");
    fireEvent.click(firstEvent);

    // Expect to see the EventDetailMock component (simulated navigation)
    await waitFor(() => {
      expect(screen.getByTestId("event-detail-page")).toBeInTheDocument();
    });
  });
});