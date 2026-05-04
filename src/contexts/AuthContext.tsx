import { createContext, useContext } from "react";

interface AuthContextData {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContextData);
