import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { AuthProvider } from "../../providers/AuthProvider";
import App from "../../App";

describe("Logout Flow", () => {
  beforeEach(() => {
    // Pretend user is logged in
    localStorage.setItem("events-user-token", "fake-token");
    localStorage.setItem("events-user-name", "Test User");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("logs out user and redirects to login", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuthProvider>
            <App />
         </AuthProvider>
      </MockedProvider>
    );

    // Wait for the events view (protected page) to appear
    await waitFor(() => {
      expect(screen.getByText(/All Events/i)).toBeInTheDocument();
    });

    // Click logout button
    const logoutBtn = screen.getByRole("button", { name: /log out/i });
    fireEvent.click(logoutBtn);

    // Verify redirection to login
    await waitFor(() => {
      expect(screen.getByText(/log in/i)).toBeInTheDocument();
    });

    // Verify token is cleared
    expect(localStorage.getItem("events-user-token")).toBeNull();
    expect(localStorage.getItem("events-user-name")).toBeNull();
  });
});