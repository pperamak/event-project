/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router";
import Event from "../Event";
import { GET_EVENT_BY_ID } from "../../../queries/queries";
import GoogleMapsProvider from "../../../providers/GoogleMapsProvider";

// 🧩 Mock event data
const mockEvent = {
  id: "1",
  name: "Mock Event",
  description: "This is a mock event for testing.",
  time: new Date("2025-10-23T12:00:00Z").toISOString(),
  user: {
    id: "10",
    name: "Alice",
    email: "alice@example.com",
  },
};

// ✅ Successful query mock
const mocks = [
  {
    request: {
      query: GET_EVENT_BY_ID,
      variables: { id: "1" },
    },
    result: {
      data: {
        findEvent: mockEvent,
      },
    },
  },
];

// ❌ Error query mock
const errorMocks = [
  {
    request: {
      query: GET_EVENT_BY_ID,
      variables: { id: "1" },
    },
    error: new Error("Failed to fetch event"),
  },
];

vi.mock("@react-google-maps/api", async () => {
  const actual = await vi.importActual<any>(
    "@react-google-maps/api"
  );
  return {
    ...actual,
    ...(await import("../../../tests/mocks/googleMaps")),
  };
});

describe("Event component", () => {
  it("renders loading state initially", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter initialEntries={["/events/1"]}>
        <GoogleMapsProvider>
          <Routes>
            <Route path="/events/:id" element={<Event />} />         
          </Routes>
         </GoogleMapsProvider> 
        </MemoryRouter>
      </MockedProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders event details after successful query", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={["/events/1"]}>
          <GoogleMapsProvider>
           <Routes>
            <Route path="/events/:id" element={<Event />} />
           </Routes>
          </GoogleMapsProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Mock Event")).toBeInTheDocument();
      expect(screen.getByText("This is a mock event for testing.")).toBeInTheDocument();
      expect(screen.getByText(/Alice/)).toBeInTheDocument();
    });
  });

  it("renders error message on failed query", async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter initialEntries={["/events/1"]}>
          <GoogleMapsProvider>
            <Routes>
              <Route path="/events/:id" element={<Event />} />           
           </Routes>
          </GoogleMapsProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it("renders 'no event found' when findEvent returns null", async () => {
    const nullMocks = [
      {
        request: {
          query: GET_EVENT_BY_ID,
          variables: { id: "1" },
        },
        result: {
          data: {
            findEvent: null,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={nullMocks} addTypename={false}>
        <MemoryRouter initialEntries={["/events/1"]}>
          <GoogleMapsProvider>
           <Routes>
             <Route path="/events/:id" element={<Event />} />            
           </Routes>
          </GoogleMapsProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No event/i)).toBeInTheDocument();
    });
  });
});