import { createContext } from "react";

interface User {
  token: string;
  name: string;
}

interface AuthContextValue {
  user: User | null;
  login: (token: string, name: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
