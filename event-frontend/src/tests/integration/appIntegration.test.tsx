import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { AuthProvider } from "../../hooks/AuthProvider";
import App from "../../App";
import { LOGIN_USER } from "../../queries";

const loginMocks = [
  {
    request: {
      query: LOGIN_USER,
      variables: { email: "test@example.com", password: "password123" },
    },
    result: {
      data: {
        login: {
          value: "fake-token",
          user: {
            name: "Test User",
          }
          
        },
      },
    },
  },
];


describe("App Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects to /events after successful login", async () => {
    // Start from /login
    window.history.pushState({}, "Login page", "/login");

    render(
      <MockedProvider mocks={loginMocks} addTypename={false}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MockedProvider>
    );

    // Fill and submit login form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Wait for redirect to events layout
    await waitFor(() => {
      expect(screen.getByText(/all events/i)).toBeInTheDocument();
    });

    // Verify token saved
    expect(localStorage.getItem("events-user-token")).toBe("fake-token");
  });

  it("renders 404 redirect for unknown route", async () => {
    // Push a fake route
    window.history.pushState({}, "Not found page", "/does-not-exist");

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MockedProvider>
    );

    // Should navigate to /login due to wildcard route
    await waitFor(() => {
      expect(screen.getByText(/log in/i)).toBeInTheDocument();
    });
  });

  it("persists login state and shows events layout on refresh", async () => {
    // Simulate a logged-in user
    localStorage.setItem("events-user-token", "persisted-token");
    localStorage.setItem("events-user-name", "Persistent User");

    // Start directly from /events
    window.history.pushState({}, "Events page", "/events");

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MockedProvider>
    );

    // Should render events layout immediately
    await waitFor(() => {
      expect(screen.getByText(/all events/i)).toBeInTheDocument();
    });
  });
});