import { createContext } from "react";

export const UserContext = createContext({ user: null, loading: true, userData: null });