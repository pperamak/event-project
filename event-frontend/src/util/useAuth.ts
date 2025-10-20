import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<null | { token: string; name: string }>(null);

  useEffect(() => {
    const token = localStorage.getItem("events-user-token");
    const name = localStorage.getItem("events-user-name");
    if (token && name) setUser({ token, name });
  }, []);

  const login = (token: string, name: string) => {
    localStorage.setItem("events-user-token", token);
    localStorage.setItem("events-user-name", name);
    setUser({ token, name });
  };

  const logout = () => {
    localStorage.removeItem("events-user-token");
    localStorage.removeItem("events-user-name");
    setUser(null);
  };

  return { user, login, logout };
}