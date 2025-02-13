"use server"

import { initDatabase } from "@/actions/database";

export type Card = {
  id: number;
  card_id: string;
  card_name: string;
  rarity: string;
};

export async function loadAllCards(): Promise<Card[]> {
  const client = await initDatabase();

  const res = await client.query<Card>("SELECT id, card_id, card_name, rarity FROM cards");

  return res.rows;
}
