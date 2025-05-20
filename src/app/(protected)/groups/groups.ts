"use server";

import { initDatabase, verifyGoogleToken } from "@/actions/database";
import { Group } from "../../types/Group";

export async function loadMyGroups(token: string): Promise<Group[]> {
  try {
    // Vérifier le token Google et récupérer l'email
    const email = await verifyGoogleToken(token);
    const { client, close } = await initDatabase();

    const res = await client.query<Group>(
      `SELECT g.id, g.name, g.description FROM groups g
      JOIN user_groups ug ON g.id = ug.group_id
      JOIN users u ON u.id = ug.user_id
      WHERE u.email = $1`,
      [email]
    );

    await close();

    return res.rows;
  } catch (error) {
    console.error("Erreur de chargement des groupes:", error);
    throw error;
  }
}

export async function createNewGroup(name: string, description: string, token: string) {
  try {
    const { client, close } = await initDatabase();
    const email = await verifyGoogleToken(token);

    // Récupérer l'ID de l'utilisateur à partir de l'email
    const userId = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    const res = await client.query(
      `INSERT INTO groups (name, description, admin_id) VALUES ($1, $2, $3) RETURNING id`,
      [name, description, userId.rows[0].id]
    );

    const groupId = res.rows[0].id;

    await client.query(
      `INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)`,
      [userId.rows[0].id, groupId]
    );
    await close();
    return groupId;
  }
  catch (error) {
    console.error("Erreur de création du groupe:", error);
    throw error;
  }
}

export async function joinGroup(token: string, groupUUID: string) {
  try {
    const { client, close } = await initDatabase();
    const email = await verifyGoogleToken(token);

    // Récupérer l'ID de l'utilisateur à partir de l'email
    const userId = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    const groupId = await client.query(
      `SELECT id, name, description FROM groups WHERE uuid = $1`,
      [groupUUID]
    );
    
    if (groupId.rows.length === 0) {
      throw new Error("Groupe non trouvé");
    }

    await client.query(
      `INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)`,
      [userId.rows[0].id, groupId.rows[0].id]
    );

    await close();
    return groupId.rows[0];
  }
  catch (error) {
    console.error("Erreur d'ajout au groupe:", error);
    throw error;
  }
}