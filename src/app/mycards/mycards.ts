"use server";

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

export async function loadMyCards(email: string): Promise<Card[]> {
  const client = await initDatabase();

  const res = await client.query<Card>(
    "SELECT cards.id, cards.card_id, cards.card_name, cards.rarity FROM user_cards join cards on cards.id = user_cards.card_id join users on users.id = user_cards.user_id Where users.email = $1",
    [email]
  );

  return res.rows;
}

interface UserCardQuantityResult {
  quantity: number;
}

export async function loadUserCardQuantity(email: string, card_id: string) {
  const client = await initDatabase();

  const res = await client.query<UserCardQuantityResult>(
    "SELECT user_cards.quantity FROM user_cards join cards on cards.id = user_cards.card_id join users on users.id = user_cards.user_id Where users.email = $1 and cards.card_id= $2",
    [email, card_id]
  );

  if (!res.rows[0]) return 0;

  return res.rows[0].quantity;
}
