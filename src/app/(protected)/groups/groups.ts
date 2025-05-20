"use server";

import { initDatabase, verifyGoogleToken } from "@/actions/database";
import { Group, User } from "../../types/Group";

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

export async function groupListOfUsers(groupId: number): Promise<User[]> {
    try {
    // Est-ce qu'il faudrait pas vérifier que ce User est bien dans le groupe ?
    // const email = await verifyGoogleToken(token);
    const { client, close } = await initDatabase();

    const res = await client.query<User>(
      `SELECT u.id, u.pseudo  
      FROM user_groups ug
      JOIN users u ON u.id = ug.user_id
      WHERE ug.group_id = $1`,
      [groupId]
    );

    await close();

    return res.rows;

  } catch (error) {
    console.error("Erreur de chargement de la liste des utilisateurs:", error);
    throw error;
  }
};

export async function groupAdmin(groupId: number): Promise<User> {
    try {
    // Est-ce qu'il faudrait pas vérifier que ce User est bien dans le groupe ?
    // const email = await verifyGoogleToken(token);
    const { client, close } = await initDatabase();

    const res = await client.query<User>(
      `SELECT u.id, u.pseudo  
      FROM groups g
      JOIN users u ON u.id = g.admin_id
      WHERE g.id = $1`,
      [groupId]
    );

    await close();

    return res.rows[0];

  } catch (error) {
    console.error("Erreur de chargement de l'administrateur du groupe:", error);
    throw error;
  }
}