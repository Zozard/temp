"use server";

import { v4 as uuidv4 } from 'uuid';


import { createClient } from "redis";

export async function saveCardToGive(email: string, cardToGive: string) {
  const client = await createClient({ url: process.env.REDIS_URL })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  await client.set(`cardToGive-${email.toLowerCase()}-${uuidv4()}`, cardToGive);
  await client.disconnect();
}

export async function loadAllCardsToGive(): Promise<string[]> {
  const client = await createClient({ url: process.env.REDIS_URL })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  const keys = await client.keys("cardToGive*");

  const cards = await client.mGet(keys);

  return cards.filter((x) => x !== null);
}
