"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

// Interface pour typer les informations utilisateur Google
interface GoogleUserInfo {
  email: string;
  email_verified: boolean;
  given_name: string;
  family_name: string;
  picture: string;
  name: string;
  sub: string;
}

export function useUser() {
  const [token, setToken] = useState<string | null>(null);

  const callback = () => {
    const token = window.localStorage.getItem("token");
    setToken(token);
  };

  useEffect(() => {
    callback();
  }, []);

  useEffect(() => {
    window.addEventListener("storage", callback);

    return () => {
      window.removeEventListener("storage", callback);
    };
  }, []);

  if (token === null) {
    return null;
  }

  return jwtDecode<GoogleUserInfo>(token);
}
