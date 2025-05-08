"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./profile.css";
import { findUserData, updateUserData, UserData } from "./profile";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import dynamic from "next/dynamic";

interface User {
  token: string;
}

interface MessageState {
  text: string;
  type: "success" | "error" | "";
}

function Profile() {
  const user = useAuthenticatedUser();

  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [friendCode, setFriendCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fonction pour charger les données utilisateur au chargement de la page
    const userDatasPromise = findUserData(user.token);
    userDatasPromise.then((userData: UserData) => {
      if (userData !== null) {
        setEmail(user.email);
        setPseudo(userData.pseudo || "");
        setFriendCode(userData.friend_code || "");
      }
    });
  }, [user.token]);

  const handleFriendCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Garder seulement les chiffres

    // Ajouter les tirets automatiquement
    if (value.length > 0) {
      // Diviser en groupes de 4 chiffres et ajouter des tirets
      const groups = value.match(/.{1,4}/g);
      if (groups) {
        value = groups.join("-");
      }
    }
    // Limiter à 19 caractères (16 chiffres + 3 tirets)
    if (value.length <= 19) {
      setFriendCode(value);
    }
  };

  const handleSubmit = () => {
    // Ici, vous pouvez ajouter la logique pour soumettre le formulaire
    console.log("Form submitted");

    try {
      setIsLoading(true);
      // On n'envoie pas l'email puisqu'il n'est pas modifiable
      updateUserData(user.token, pseudo, friendCode);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-container">
        <h1>Modifier votre profil</h1>

        <label>Email</label>
        <input
          type="email"
          id="email"
          value={email}
          readOnly
          className="input-readonly"
          disabled
        />
        <small>L'email ne peut pas être modifié</small>

        <label>Pseudo</label>
        <input
          type="text"
          id="pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          placeholder="Votre pseudo"
        />

        <label>Code ami</label>
        <input
          type="text"
          id="friendCode"
          value={friendCode}
          onChange={handleFriendCodeChange}
          placeholder="XXXX-XXXX-XXXX-XXXX"
        />
        <small>Format: 16 chiffres séparés par des tirets</small>
        <button type="submit" className="btn-save" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}

export default dynamic(() => Promise.resolve(Profile), {
  ssr: false,
});
