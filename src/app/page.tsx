"use client";
import { GoogleLogin, googleLogout, GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "@/components/Navbar";

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

export default function root() {
  return (
    <GoogleOAuthProvider clientId="505484307039-oo2uoi908rphpg284f683hib1ogi3nfl.apps.googleusercontent.com">
      <Navbar />
      <Home />
    </GoogleOAuthProvider>
  );
}

function Home() {
  const [, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<GoogleUserInfo | null>(null);

  let token = null;
  if (typeof window !== "undefined") {
    token = window.localStorage.getItem("token");
  }

  // Si on a un token stocké au chargement de la page, on décode les infos utilisateur
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<GoogleUserInfo>(token);
      setUserInfo(decoded);
    }
  }, [token]);

  // J'ai pas réussi à faire autrement qu'en créant une fonction handleLogout :/
  const handleLogout = () => {
    googleLogout();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
      window.location.reload();
    }
    setIsLoggedIn(false);
  };

  if (token !== null) {
    return (
      <div>
        <p>
          Bienvenue {userInfo?.given_name} {userInfo?.family_name} !
        </p>
        <p>Email : {userInfo?.email}</p>
        <button onClick={handleLogout}>Se déconnecter</button>
      </div>
    );
  } else {
    return (
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          setIsLoggedIn(true); // Used to re-render component
          if (credentialResponse.credential !== undefined) {
            const decoded = jwtDecode<GoogleUserInfo>(credentialResponse.credential);
            setUserInfo(decoded);
            if (typeof window !== "undefined") {
              window.localStorage.setItem("token", credentialResponse.credential);
            }
          }
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    );
  }
}
