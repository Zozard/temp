"use server"

import { Card } from "../../types/Card";
import { initDatabase } from "@/actions/database";

export type MatchingOffer = {
  card: Card;
  sellers: { pseudo: string; quantity: number }[];
};

export type Offer = {
  id: number;
  card_id: string;
  card_name: string;
  rarity: string;
  email: string;
  quantity_to_sell: number;
  quantity_to_buy: number;
};

/*
// find matches pour un utilisateur donné
export function findMatches(buyerEmail: string, offers: Offer[]): MatchingOffer[] {
  // on fait un tableau avec uniquement les lignes du buyer
  const buyerOffers = offers.filter(
    (offer) => offer.email === buyerEmail && offer.quantity_to_buy > 0
  );

  // un autre tableau avec les lignes autres que le buyer (donc tous les potentiels sellers)
  const sellerOffers = offers.filter(
    (offer) => offer.email !== buyerEmail && offer.quantity_to_sell > 0
  );

  // préparation du tableau des matchs
  const matches: MatchingOffer[] = [];

  buyerOffers.forEach((buyerOffer) => {
    // on filtre sur la carte en cours
    const potentialSellers = sellerOffers.filter(
      (sellerOffer) => sellerOffer.card_id === buyerOffer.card_id
    );

    potentialSellers.forEach((sellerOffer) => {
      // Si l'acheteur veut moins ou = que ce que le vendeur propose
      if (buyerOffer.quantity_to_buy <= sellerOffer.quantity_to_sell) {
        // vérifier si la carte est déjà dans le tableau
        if (!matches.some((offer) => offer.card.card_id === buyerOffer.card_id)) {
          // si elle y est pas, on la rajoute
          matches.push({
            card: {
              id: sellerOffer.id,
              card_id: sellerOffer.card_id,
              card_name: sellerOffer.card_name,
              rarity: sellerOffer.rarity,
              quantity_to_sell: 0,
              quantity_to_buy: 0,
            },
            sellers: [{ pseudo: sellerOffer.email, quantity: sellerOffer.quantity_to_sell }],
          });
        } else {
          // si elle y est, on rajoute juste un seller
          const newSeller = { pseudo: sellerOffer.email, quantity: sellerOffer.quantity_to_sell };
          const offerIndex = matches.findIndex(
            (offer) => offer.card.card_id === buyerOffer.card_id
          );
          matches[offerIndex].sellers.push(newSeller);
        }
      }
    });
  });

  return matches;
}
*/

export async function loadAllOffers(): Promise<Offer[]> {
  const client = await initDatabase();

  const res = await client.query<Offer>(
    `SELECT
      cards.id,
      cards.card_id,
      cards.card_name,
      cards.rarity,
      users.email,
      SUM(CASE WHEN user_cards.direction = 'BUY' THEN user_cards.quantity ELSE 0 END) AS quantity_to_buy,
      SUM(CASE WHEN user_cards.direction = 'SELL' THEN user_cards.quantity ELSE 0 END) AS quantity_to_sell
    FROM cards
    JOIN user_cards ON cards.id = user_cards.card_id
    JOIN users on users.id = user_cards.user_id
    GROUP BY cards.id, cards.card_id, cards.card_name, cards.rarity, users.email
    ORDER BY cards.card_id`
  );

  return res.rows;
}
