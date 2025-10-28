import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { AuthProvider } from "../../hooks/AuthProvider";
import { MockedProvider } from "@apollo/client/testing";
import ProtectedRoute from "../../components/ProtectedRoute";


const ProtectedPage = () => <div>Protected content</div>;
const LoginPage = () => <div>Login page</div>;

describe("Routing Protection", () => {
  it("redirects unauthenticated users to login", async () => {
    render(
      <MockedProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={["/events"]}>
            <Routes>
              <Route element={<ProtectedRoute/>}>
              <Route
                path="/events"
                element={
                  <ProtectedPage />              
                }
              />
              </Route>
              
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/login page/i)).toBeInTheDocument();
    });
  });

  it("allows authenticated users to access protected route", async () => {
    localStorage.setItem("events-user-token", "abc123");
    localStorage.setItem("events-user-name", "Alice");

    render(
      <MockedProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={["/events"]}>
            <Routes>
              <Route element={<ProtectedRoute/>}>
              <Route
                path="/events"
                element={
                 <ProtectedPage/>  
                }
              />
              </Route>             
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });
  });
});