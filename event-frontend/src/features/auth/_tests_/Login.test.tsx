/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Login from "../Login";
import { LOGIN_USER } from "../../../queries/mutations";
import { AuthProvider } from "../../../providers/AuthProvider";
import { MemoryRouter } from "react-router";

describe("Login component", () => {
  it("logs in successfully and shows welcome message", async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_USER,
          variables: { email: "alice@example.com", password: "password123" },
        },
        result: {
          data: {
            login: {
              value: "token123",
              user: { id: "1", name: "Alice", email: "alice@example.com" },
            },
          },
        },
      },
    ];

    render(
      <AuthProvider>
       <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
        </MockedProvider> 
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "alice@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByText(/welcome alice/i)).toBeInTheDocument()
    );
  });

  it("shows error message on login failure", async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_USER,
          variables: { email: "bob@example.com", password: "wrongpass" },
        },
        error: new Error("Invalid credentials"),
      },
    ];

    render(
      <AuthProvider>
       <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider> 
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "bob@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });
});