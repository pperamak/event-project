/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import GoogleMapsProvider from "../../../providers/GoogleMapsProvider";

import { CREATE_EVENT, GET_SIGNATURE } from "../../../queries/queries";
import AddEvent from "../AddEvent";

// Must match the value used in AddEvent.tsx
const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/dqm9cv8nj/image/upload/v1764240724/780-7801295_celebration-download-png-celebration-background_iezywq.jpg";

const toUtcIso = (localDatetime: string) => {
  const date = new Date(localDatetime);
  return date.toISOString();
};

describe("AddEvent component", () => {
  const mockDate = "2048-10-15T13:00";
  const isoTime = toUtcIso(mockDate);

  // Mock for GET_SIGNATURE (always needed)
  const signatureMock = {
    request: { query: GET_SIGNATURE },
    result: {
      data: {
        getCloudinarySignature: {
          apiKey: "testApiKey",
          cloudName: "demo",
          signature: "testSignature",
          timestamp: 1234567890,
          __typename: "CloudinarySignature",
        },
      },
    },
  };

  const createEventSuccessMock = {
    request: {
      query: CREATE_EVENT,
      variables: {
        name: "Conference",
        description: "A great event",
        time: isoTime,
        image: DEFAULT_IMAGE_URL, // MUST MATCH component behavior
      },
    },
    result: {
      data: {
        createEvent: {
          id: "1",
          name: "Conference",
          description: "A great event",
          time: isoTime,
          image: DEFAULT_IMAGE_URL,
          user: { id: "1", name: "Alice", email: "alice@example.com" },
        },
      },
    },
  };

  vi.mock("@react-google-maps/api", async () => {
  const actual = await vi.importActual<any>(
    "@react-google-maps/api"
  );
  return {
    ...actual,
    ...(await import("../../../tests/mocks/googleMaps")),
  };
});

  it("renders the form correctly", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <GoogleMapsProvider>
          <AddEvent /> 
        </GoogleMapsProvider>
      </MockedProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create event/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty form", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <GoogleMapsProvider>
          <AddEvent />
        </GoogleMapsProvider>        
      </MockedProvider>
    );

    await user.click(screen.getByRole("button", { name: /create event/i }));

    const errors = await screen.findAllByText(/required/i);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("submits the form successfully and shows success message", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        mocks={[signatureMock, createEventSuccessMock]}
        addTypename={false}
      >
        <GoogleMapsProvider>
          <AddEvent />
        </GoogleMapsProvider>        
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/name/i), "Conference");
    await user.type(screen.getByLabelText(/description/i), "A great event");
    await user.type(screen.getByLabelText(/date/i), mockDate);

    await user.click(screen.getByRole("button", { name: /create event/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /created/i
      );
    });
  });

  it("shows an error message when mutation fails", async () => {
    const user = userEvent.setup();

    const failMock = {
      request: {
        query: CREATE_EVENT,
        variables: {
          name: "Conference",
          description: "A great event",
          time: toUtcIso("2025-10-15T10:00"),
          image: DEFAULT_IMAGE_URL,
        },
      },
      error: new Error("Failed to create event"),
    };

    render(
      <MockedProvider
        mocks={[signatureMock, failMock]}
        addTypename={false}
      >
        <GoogleMapsProvider>
          <AddEvent />
        </GoogleMapsProvider>
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/name/i), "Conference");
    await user.type(screen.getByLabelText(/description/i), "A great event");
    await user.type(screen.getByLabelText(/date/i), "2025-10-15T10:00");

    await user.click(screen.getByRole("button", { name: /create event/i }));

    const errors = await screen.findByText(/future date/i);
    expect(errors).toBeDefined();
  });
});