"use server";

import { createClient } from "redis";

export async function saveFriendCode(email: string, friendCode: string) {
  const client = await createClient({ url: process.env.REDIS_URL })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  await client.set(`friendCode-${email.toLowerCase()}`, friendCode);
  await client.disconnect();
}

export async function loadFriendCode(email: string): Promise<string | null> {
  const client = await createClient({ url: process.env.REDIS_URL })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  const value = await client.get(`friendCode-${email.toLowerCase()}`);

  return value;
}
