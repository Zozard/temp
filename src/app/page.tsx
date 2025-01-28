"use client"
import { GoogleLogin, useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';

export default function root (){
  return <GoogleOAuthProvider clientId="505484307039-oo2uoi908rphpg284f683hib1ogi3nfl.apps.googleusercontent.com"><Home></Home></GoogleOAuthProvider>;
}

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (localStorage.getItem("token") !== null )
  {
    return (<p>Bienvenue!</p>)
  } else {
    return (
          <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
          setIsLoggedIn(true);
          if ( credentialResponse.credential !== undefined ) {
            localStorage.setItem("token", credentialResponse.credential)
          } 
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    );
  }
}