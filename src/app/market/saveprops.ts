"use server";

import { v4 as uuidv4 } from "uuid";
import { createClient } from "redis";

import { Client } from "pg";

async function initDatabase(): Promise<Client> {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });
  await client.connect();

  return client;
}

// const res = await client.query('SELECT $1::text as message', ['Hello world!'])
// console.log(res.rows[0].message) // Hello world!
// await client.end()

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

export async function saveCardToGive(email: string, cardId: string) {
  const client = await initDatabase();

  const [userId, internalCardId] = await Promise.all([
    loadUserId(client, email),
    loadCardId(client, cardId),
  ]);

  await client.query(
    "INSERT INTO user_cards (user_id, card_id, direction, quantity) VALUES ($1, $2, $3, $4)",
    [userId, internalCardId, "SELL", 1]
  );
  await client.end();

  // const client = await createClient({ url: process.env.REDIS_URL })
  //   .on("error", (err) => console.log("Redis Client Error", err))
  //   .connect();

  // await client.set(`cardToGive-${email.toLowerCase()}-${uuidv4()}`, cardToGive);
  // await client.disconnect();
}

export async function loadAllCardsToGive(): Promise<string[]> {
  const client = await createClient({ url: process.env.REDIS_URL })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  const keys = await client.keys("cardToGive*");

  const cards = await client.mGet(keys);

  return cards.filter((x) => x !== null);
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
