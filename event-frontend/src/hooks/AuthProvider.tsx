import {  useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface User {
  token: string;
  name: string;
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Load persisted user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("events-user-token");
    const name = localStorage.getItem("events-user-name");
    if (token && name) setUser({ token, name });
    setInitializing(false);
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

  if (initializing){
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

