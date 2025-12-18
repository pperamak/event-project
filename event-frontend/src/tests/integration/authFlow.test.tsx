import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { AuthProvider } from "../../providers/AuthProvider";
import { CREATE_USER, LOGIN_USER } from "../../queries/mutations";
import Register from "../../features/auth/Register";
import Login from "../../features/auth/Login";
import { MemoryRouter } from "react-router";

describe("Auth Flow", () => {
  it("registers a new user and then logs in", async () => {
    const user = userEvent.setup();

    const mockUser = {
      id: "1",
      name: "Alice",
      email: "alice@example.com",
    };

    const mocks = [
      {
        request: {
          query: CREATE_USER,
          variables: { name: "Alice", email: "alice@example.com", password: "secret123" },
        },
        result: {
          data: {
            createUser: mockUser,
          },
        },
      },
      {
        request: {
          query: LOGIN_USER,
          variables: { email: "alice@example.com", password: "secret123" },
        },
        result: {
          data: {
            login: {
              value: "jwt-token-123",
              user: mockUser,
            },
          },
        },
      },
    ];

    render(
      <AuthProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Register />
          <Login />
        </MemoryRouter>
       </MockedProvider>
      </AuthProvider> 
    );

    // ---- Registration ----
    await user.type(screen.getByLabelText(/name/i), "Alice");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret123");
    await user.type(screen.getByLabelText(/confirm password/i), "secret123");

    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/registration successful/i, { exact: false })
      ).toBeInTheDocument()
    );

    // ---- Login ----
    await user.clear(screen.getByLabelText(/^email$/i));
    await user.type(screen.getByTestId('login-email'), "alice@example.com");
    await user.type(screen.getByTestId('login-password'), "secret123");

    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/welcome alice/i, { exact: false })
      ).toBeInTheDocument()
    );
  });
});