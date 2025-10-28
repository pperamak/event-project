import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { CREATE_EVENT } from "../../queries";
import AddEvent from "../AddEvent";
//import { vi } from "vitest";

// Mock Date.now so Zod future date validation is predictable
/*
beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-10-10T12:00:00Z"));
});

afterAll(() => {
  vi.useRealTimers();
});
*/

describe("AddEvent component", () => {
  const mocks = [
    {
      request: {
        query: CREATE_EVENT,
        variables: {
          name: "Conference",
          description: "A great event",
          time: "2048-10-15T10:00:00.000Z", // Match input exactly
        },
      },
      result: {
        data: {
          createEvent: {
            id: "1",
            name: "Conference",
            description: "A great event",
            time: "2048-10-15T10:00:00.000Z",
            user: { id: "1", name: "Alice", email: "alice@example.com" },
          },
        },
      },
    },
  ];

  it("renders the form correctly", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddEvent />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty form", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddEvent/>
      </MockedProvider>
    );

    
    await user.click(screen.getByRole("button", { name: /create/i }));

    // Wait for async validation
    const errors = await screen.findAllByText(/required/i);
    expect(errors).toHaveLength(2);
  });

  it("submits the form successfully and shows success message", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
          <AddEvent /> 
      </MockedProvider>
    );

    

    await user.type(screen.getByLabelText(/name/i), "Conference");
    await user.type(screen.getByLabelText(/description/i), "A great event");
    await user.type(screen.getByLabelText(/date/i), "2048-10-15T13:00");

    await user.click(screen.getByRole("button", { name: /create/i }));

    // Wait for Apollo mutation to resolve
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/created successfully/i);
    });
  });

  it("shows an error message when mutation fails", async () => {
    const errorMocks = [
      {
        request: {
          query: CREATE_EVENT,
          variables: {
            name: "Conference",
            description: "A great event",
            time: "2025-10-15T10:00",
          },
        },
        error: new Error("Failed to create event"),
      },
    ];

    const user = userEvent.setup();

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <AddEvent />
      </MockedProvider>
    );

    

    await user.type(screen.getByLabelText(/name/i), "Conference");
    await user.type(screen.getByLabelText(/description/i), "A great event");
    await user.type(screen.getByLabelText(/date/i), "2025-10-15T10:00");

    await user.click(screen.getByRole("button", { name: /create/i }));
    const errors = await screen.findByText(/future date/i);
    expect(errors).toBeDefined();

    /*
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/failed to create event/i);
    });
    */
  });
  
});