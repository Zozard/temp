"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useState } from "react";

// Interface pour typer les informations utilisateur Google
interface GoogleUserInfo {
  email: string;
  email_verified: boolean;
  given_name: string;
  family_name: string;
  picture: string;
  name: string;
  sub: string;
  token: string;
}

export function useUser() {
  if (typeof window === "undefined") {
    throw new Error("Not a browser context");
  }

  const initialToken = window.localStorage.getItem("token");
  const [token, setToken] = useState<string | null>(initialToken);

  const callback = () => {
    const token = window.localStorage.getItem("token");
    setToken(token);
  };

  useEffect(() => {
    window.addEventListener("storage", callback);

    return () => {
      window.removeEventListener("storage", callback);
    };
  }, []);

  const user = useMemo(() => {
    if (token === null) {
      return null;
    }
    const decodedToken = jwtDecode(token);
    return { ...decodedToken, token } as GoogleUserInfo;
  }, [token]);

  return user;
}
