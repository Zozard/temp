"use server";

import { v4 as uuidv4 } from "uuid";
import { createClient } from "redis";
import { initDatabase } from "@/actions/database";

import { Client } from "pg";

async function loadUserId(client: Client, email: string): Promise<number> {
  const res = await client.query<{ id: number }>("SELECT id FROM users WHERE email = $1", [email]);
  if (res.rows.length !== 1) {
    // User not found / or multiple users? o_O
    throw new Error("User not found");
  }

  return res.rows[0].id;
}

async function loadCardId(client: Client, cardId: string): Promise<number> {
  const res = await client.query<{ id: number }>("SELECT id FROM cards WHERE card_id = $1", [
    cardId,
  ]);
  if (res.rows.length !== 1) {
    // User not found / or multiple users? o_O
    throw new Error("Card not found");
  }

  return res.rows[0].id;
}

export async function loadUserCard(
  userCardId: number
): Promise<{ card_name: string; pseudo: string }[]> {
  const {client, close} = await initDatabase();

  const res = await client.query<{ card_name: string; pseudo: string }>(
    "SELECT card_name, pseudo FROM user_cards join cards on cards.id = user_cards.card_id join users on users.id = user_cards.user_id WHERE user_cards.id = $1",
    [userCardId]
  );

  if (res.rows.length !== 1) {
    // User_Card not found / Or multiple User_Card o_O
    throw new Error("User_Card not found");
  }
  await close();

  return res.rows;
}

export async function saveCardToGive(email: string, cardId: string): Promise<number> {
  const {client, close} = await initDatabase();

  const [userId, internalCardId] = await Promise.all([
    loadUserId(client, email),
    loadCardId(client, cardId),
  ]);

  const res = await client.query(
    "INSERT INTO user_cards (user_id, card_id, direction, quantity) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, internalCardId, "SELL", 1]
  );
  await client.end();

  await close();

  // RETURNING * retourne la ligne insérée et ses attributs, dont l'id technique (id)
  return res.rows[0].id;
}

export async function loadAllCardsToGive(): Promise<{ card_name: string; pseudo: string }[]> {
  const {client, close} = await initDatabase();

  const res = await client.query<{ card_name: string; pseudo: string }>(
    "select card_name, pseudo from user_cards join cards on cards.id = user_cards.card_id join users on users.id = user_cards.user_id where direction = 'SELL'"
  );

  if (res.rows.length === 0) {
    // No cards to give in database
    throw new Error("No cards to give in database");
  }

  await close();


  return res.rows;
}

export async function saveCardSearched(email: string, cardSearched: string) {
  const client = await createClient({ url: process.env.REDIS_URL })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  await client.set(`cardSearched-${email.toLowerCase()}-${uuidv4()}`, cardSearched);
  await client.disconnect();
}

export async function loadAllCardsSearched(): Promise<string[]> {
  const client = await createClient({ url: process.env.REDIS_URL })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  const keys = await client.keys("cardSearched*");

  const cards = await client.mGet(keys);

  return cards.filter((x) => x !== null);
}
