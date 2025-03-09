"use server";

import { initDatabase } from "@/actions/database";
import { Card } from '../../types/Card';

export async function loadAllCards(email: string): Promise<Card[]> {
  const client = await initDatabase();

  //const res = await client.query<Card>("SELECT id, card_id, card_name, rarity, 5 as quantity FROM cards");

  // version ok
  //  const res = await client.query<Card>(
  //    "SELECT cards.id, cards.card_id, cards.card_name, cards.rarity, user_cards.quantity FROM user_cards join cards on cards.id = user_cards.card_id join users on users.id = user_cards.user_id where email = $1",
  //    ["g.zozine@gmail.com"]
  //  );

  // version ok encore mieux
  /*   const res = await client.query<Card>(
    "SELECT cards.id, cards.card_id, cards.card_name, cards.rarity, user_cards.quantity FROM cards LEFT OUTER JOIN ( SELECT user_cards.* FROM user_cards JOIN users ON users.id = user_cards.user_id  WHERE users.email = $1) AS user_cards ON cards.id = user_cards.card_id",
    ["g.zozine@gmail.com"]
  ); */

  //version avec quantity_buy et quantity_sell
  const res = await client.query<Card>(
    `SELECT
      cards.id,
      cards.card_id,
      cards.card_name,
      cards.rarity,
      SUM(CASE WHEN user_cards.direction = 'BUY' THEN user_cards.quantity ELSE 0 END) AS quantity_to_buy,
      SUM(CASE WHEN user_cards.direction = 'SELL' THEN user_cards.quantity ELSE 0 END) AS quantity_to_sell
    FROM cards
    LEFT OUTER JOIN user_cards ON cards.id = user_cards.card_id AND user_cards.user_id = (SELECT id FROM users WHERE email = $1)
    GROUP BY cards.id, cards.card_id, cards.card_name, cards.rarity
    ORDER BY cards.card_id`,
    [email]
  );

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

export async function updateToSell(card_id: string, email: string, quantity: number | null) {
  const client = await initDatabase();

  // pistes d'amélioration : ajouter la clause on conflict sur le insert pour éviter des conflits de mise à jour en parallèle de la bdd

  const existingOffer = await client.query(
    "select id FROM user_cards where user_id in (select id from users where email = $1) and card_id in (select id from cards where cards.card_id = $2) and direction = 'SELL'",
    [email, card_id]
  );

  if (existingOffer.rows[0]) {
    // if a line user_cards already exists for this duet email-card --> update
    await client.query(
      "update user_cards set quantity = $1 where user_id in (select id from users where email = $2) and card_id in (select id from cards where cards.card_id = $3) and direction = 'SELL'",
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

export async function updateToBuy(card_id: string, email: string, quantity: number | null) {
  const client = await initDatabase();

  // pistes d'amélioration : ajouter la clause on conflict sur le insert pour éviter des conflits de mise à jour en parallèle de la bdd

  const existingOffer = await client.query(
    "select id FROM user_cards where user_id in (select id from users where email = $1) and card_id in (select id from cards where cards.card_id = $2) and direction = 'BUY'",
    [email, card_id]
  );

  if (existingOffer.rows[0]) {
    // if a line user_cards already exists for this duet email-card --> update
    await client.query(
      "update user_cards set quantity = $1 where user_id in (select id from users where email = $2) and card_id in (select id from cards where cards.card_id = $3) and direction = 'BUY'",
      [quantity, email, card_id]
    );
    return "il y a qqch";
  } else {
    // if a line user_cards does not exist for this duet email-card --> insert into
    await client.query(
      "insert into user_cards (user_id, card_id,direction,quantity) values ((select id from users where email=$1), (select id from cards where card_id=$2), 'BUY', $3)",
      [email, card_id, quantity]
    );
    return "y a rien";
  }
}
