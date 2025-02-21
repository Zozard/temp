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

export async function updateOffer(card_id: string, email: string, quantity: number) {
  const client = await initDatabase();

  const existingOffer = await client.query(
    "select id FROM user_cards where user_id in (select id from users where email = $1) and card_id in (select id from cards where cards.card_id = $2)",
    [email, card_id]
  );

  if (existingOffer.rows[0]) {
    // if a line user_cards already exists for this duet email-card --> update
    await client.query(
      "update user_cards set quantity = $1 where user_id in (select id from users where email = $2) and card_id in (select id from cards where cards.card_id = $3)",
      [quantity, email, card_id]
    );
    return "il y a qqch";
  } else {
    // if a line user_cards does not exist for this duet email-card --> insert into
    await client.query(
      "insert into user_cards (user_id, card_id,direction,quantity) values ((select id from users where email=$1), (select id from cards where card_id=$2), 'SELL', $3)",
      [email, card_id, quantity]
    );
    return "y a rien";
  }
}
