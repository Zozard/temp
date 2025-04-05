"use server";

import { initDatabase } from "@/actions/database";
import { Card } from '../../types/Card';

export async function loadAllCards(email: string): Promise<Card[]> {
  const {client, close} = await initDatabase();

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

  await close();

  return res.rows;
}

export async function loadMyCards(email: string): Promise<Card[]> {
  const {client, close} = await initDatabase();

  const res = await client.query<Card>(
    "SELECT cards.id, cards.card_id, cards.card_name, cards.rarity FROM user_cards join cards on cards.id = user_cards.card_id join users on users.id = user_cards.user_id Where users.email = $1",
    [email]
  );

  await close();

  return res.rows;
}

interface UserCardQuantityResult {
  quantity: number;
}

export async function loadUserCardQuantity(email: string, card_id: string) {
  const {client, close} = await initDatabase();

  const res = await client.query<UserCardQuantityResult>(
    "SELECT user_cards.quantity FROM user_cards join cards on cards.id = user_cards.card_id join users on users.id = user_cards.user_id Where users.email = $1 and cards.card_id= $2",
    [email, card_id]
  );

  await close();

  if (!res.rows[0]) return 0;
 
  return res.rows[0].quantity;
}


export async function saveCardState(email: string, state: { [key: string]: "BUY" | "SELL" | null }){
  const {client, close} = await initDatabase();
  
    const res = await client.query<{ id: number }>("SELECT id FROM users WHERE email = $1", [email]);
  if (res.rows.length !== 1) {
    // User not found / or multiple users? o_O
    throw new Error("User not found");
  }

  const userId = res.rows[0].id;

  const keysToDelete = Object.keys(state);

  await client.query(
    `DELETE FROM user_cards WHERE user_id = $1 and card_id in (${keysToDelete.join(",")})`, [userId]
  );


  console.log({state});

  const valuesToInsert = Object.entries(state)
    .filter(([, direction]) => direction !== null)
    .map(([cardId, direction]) => {
      return `(${userId}, ${cardId}, '${direction}', 1)`;
    });

  console.log({ values: valuesToInsert.join(',') })

  await client.query(
    `INSERT INTO user_cards (user_id, card_id, direction, quantity) VALUES ${valuesToInsert.join(',')}`
  );

  await close();
}
