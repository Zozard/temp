"use server";

import { initDatabase, verifyGoogleToken } from "@/actions/database";
import { Card } from "../../types/Card";
import { escapeLiteral } from "pg";

export async function loadAllCards(token: string): Promise<Card[]> {
  try {
    // Vérifier le token Google et récupérer l'email
    const email = await verifyGoogleToken(token);

    const { client, close } = await initDatabase();

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
  } catch (error) {
    console.error("Erreur de chargement des cartes:", error);
    throw error;
  }
}

export async function saveCardState(
  token: string,
  state: { [key: string]: "BUY" | "SELL" | null }
) {
  try {
    // Vérifier le token Google et récupérer l'email
    const email = await verifyGoogleToken(token);

    const { client, close } = await initDatabase();

    const res = await client.query<{ id: number }>(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (res.rows.length !== 1) {
      // User not found / or multiple users? o_O
      throw new Error("User not found");
    }

    const userId = res.rows[0].id;

    const keysToDelete = Object.keys(state);
    const escapedKeysToDelete = keysToDelete.map((key) => {
      return escapeLiteral(key);
    });

    await client.query(
      `DELETE FROM user_cards WHERE user_id = $1 and card_id in (${escapedKeysToDelete.join(
        ","
      )})`,
      [userId]
    );

    // protégé des injections sql via Number et escapeLiteral
    const valuesToInsert = Object.entries(state)
      .filter(([, direction]) => direction !== null)
      .map(([cardId, direction]) => {
        return `(${Number(userId)}, ${Number(cardId)}, ${
          direction === null ? null : escapeLiteral(direction)
        }, 1)`;
      });

    if (valuesToInsert.length !== 0) {
      await client.query(
        `INSERT INTO user_cards (user_id, card_id, direction, quantity) VALUES ${valuesToInsert.join(
          ","
        )}`
      );
    }
    await close();

  } catch (error) {
    console.error("Erreur de sauvegarde des cartes:", error);
    throw error;
  }


}

// export async function loadMyCards(email: string): Promise<Card[]> {
//   const { client, close } = await initDatabase();

//   const res = await client.query<Card>(
//     "SELECT cards.id, cards.card_id, cards.card_name, cards.rarity FROM user_cards join cards on cards.id = user_cards.card_id join users on users.id = user_cards.user_id Where users.email = $1",
//     [email]
//   );

//   await close();

//   return res.rows;
// }

// interface UserCardQuantityResult {
//   quantity: number;
// }

// export async function loadUserCardQuantity(email: string, card_id: string) {
//   const { client, close } = await initDatabase();

//   const res = await client.query<UserCardQuantityResult>(
//     "SELECT user_cards.quantity FROM user_cards join cards on cards.id = user_cards.card_id join users on users.id = user_cards.user_id Where users.email = $1 and cards.card_id= $2",
//     [email, card_id]
//   );

//   await close();

//   if (!res.rows[0]) return 0;

//   return res.rows[0].quantity;
// }


