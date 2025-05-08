"use server";

import { initDatabase, verifyGoogleToken } from "@/actions/database";

export type UserData = {
    pseudo: string; 
    friend_code: string;  
};
  

export async function findUserData(token: string): Promise<UserData> {
  try {
    // Vérifier le token Google et récupérer l'email
    const email = await verifyGoogleToken(token);
    const { client, close } = await initDatabase();

    const res = await client.query<UserData>(
      `SELECT pseudo, friend_code FROM users WHERE email = $1`,
      [email]
    );

    await close();

    return res.rows[0];
  } catch (error) {
    console.error("Erreur de chargement des informations utilisateur:", error);
    throw error;
  }
}

export async function updateUserData(
  token: string,
  pseudo: string,
  friend_code: string
): Promise<void> {
  try {
    // Vérifier le token Google et récupérer l'email
    const email = await verifyGoogleToken(token);
    const { client, close } = await initDatabase();

    await client.query(
      `UPDATE users SET pseudo = $1, friend_code = $2 WHERE email = $3`,
      [pseudo, friend_code, email]
    );

    await close();
  } catch (error) {
    console.error("Erreur de mise à jour des informations utilisateur:", error);
    throw error;
  }
}