"use client"
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';

export default function root (){
  return <GoogleOAuthProvider clientId="505484307039-oo2uoi908rphpg284f683hib1ogi3nfl.apps.googleusercontent.com"><Home></Home></GoogleOAuthProvider>;
}

function Home() {
  const [, setIsLoggedIn] = useState(false);

  let token = null;
  if (typeof window !== "undefined") {
    token = window.localStorage.getItem("token")
  }

  if (token !== null )
  {
    return (<p>Bienvenue!</p>)
  } else {
    return (
          <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
          setIsLoggedIn(true); // Used to re-render component
          if ( credentialResponse.credential !== undefined ) {
            if (typeof window !== "undefined") {
              window.localStorage.setItem("token", credentialResponse.credential)
            }
          } 
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    );
  }
}