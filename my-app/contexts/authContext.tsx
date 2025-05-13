import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type User = {
  id: string;
  email: string;
  [key: string]: any; 
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const decodeJWT = (token: string): User => {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    };

    const loadUser = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      try {
        const decoded = decodeJWT(token);
        console.log('decoded', decoded)
        if (Date.now() > decoded.exp * 1000) {
          await SecureStore.deleteItemAsync("token");
          return;
        }
        setUser({ id: decoded.id, email: decoded.email });
      } catch (err) {
        console.log("❌ Error decoding token:", err);
        await SecureStore.deleteItemAsync("token");
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
