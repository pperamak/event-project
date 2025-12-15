import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Register from "../Register";
import { CREATE_USER } from "../../../queries/queries";
import { MemoryRouter } from "react-router";

describe("Register component", () => {
  it("shows validation errors for invalid inputs", async () => {
    render(
      <MockedProvider>
        <MemoryRouter>
           <Register />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it("submits form and shows success message", async () => {
    const mocks = [
      {
        request: {
          query: CREATE_USER,
          variables: {
            name: "Alice",
            email: "alice@example.com",
            password: "password123",
          },
        },
        result: {
          data: {
            createUser: { id: "1", name: "Alice", email: "alice@example.com" },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "alice@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument()
    );
  });

  it("shows server error on failure", async () => {
    const mocks = [
      {
        request: {
          query: CREATE_USER,
          variables: {
            name: "Bob",
            email: "bob@example.com",
            password: "password123",
          },
        },
        result: {
          errors: [{ message: "Email must be unique" }],
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Bob" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "bob@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByText(/email must be unique/i)).toBeInTheDocument()
    );
  });
});