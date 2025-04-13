"use server";

import { initDatabase } from "@/actions/database";

export type Trade = {
  card_to_sell: string;
  card_to_sell_id: string;
  card_to_buy: string;
  card_to_buy_id: string;
  card_rarity: string;
  trade_partner_email: string;
  trade_partner_pseudo: string;
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

// export async function loadAllOffers(): Promise<Offer[]> {
//   const { client, close } = await initDatabase();

//   const res = await client.query<Offer>(
//     `SELECT
//       cards.id,
//       cards.card_id,
//       cards.card_name,
//       cards.rarity,
//       users.email,
//       users.pseudo,
//       SUM(CASE WHEN user_cards.direction = 'BUY' THEN user_cards.quantity ELSE 0 END) AS quantity_to_buy,
//       SUM(CASE WHEN user_cards.direction = 'SELL' THEN user_cards.quantity ELSE 0 END) AS quantity_to_sell
//     FROM cards
//     JOIN user_cards ON cards.id = user_cards.card_id
//     JOIN users on users.id = user_cards.user_id
//     GROUP BY cards.id, cards.card_id, cards.card_name, cards.rarity, users.email, users.pseudo
//     ORDER BY cards.card_id`
//   );

//   await close();

//   return res.rows;
// }

//
export async function loadMyMatches(email: string): Promise<Trade[]> {
  const { client, close } = await initDatabase();

  const res_id = await client.query<{ id: number }>(
    "select id from users where email =$1",
    [email]
  );

  if (res_id.rowCount !== 1) {
    throw new Error("Something Wrong happened!!");
  }

  const res = await client.query<Trade>(
    `WITH sellers AS
  (SELECT buyer_cards.card_id,
          buyer_cards.id,
          uc_sellers.user_id,
          buyer_cards.rarity
   FROM cards AS buyer_cards
   INNER JOIN user_cards uc_buyer ON uc_buyer.card_id = buyer_cards.id
   INNER JOIN user_cards uc_sellers ON uc_sellers.card_id = uc_buyer.card_id
   AND uc_sellers.direction = 'SELL'
   WHERE uc_buyer.user_id = $1
     AND uc_buyer.direction = 'BUY'
     AND uc_sellers.user_id != $1),
     buyers AS
  (SELECT buyer_cards.card_id,
          buyer_cards.id,
          uc_sellers.user_id,
          buyer_cards.rarity
   FROM cards AS buyer_cards
   INNER JOIN user_cards uc_buyer ON uc_buyer.card_id = buyer_cards.id
   INNER JOIN user_cards uc_sellers ON uc_sellers.card_id = uc_buyer.card_id
   AND uc_sellers.direction = 'BUY'
   WHERE uc_buyer.user_id = $1
     AND uc_buyer.direction = 'SELL'
     AND uc_sellers.user_id != $1)
SELECT sellers.card_id AS card_to_buy,
       sellers.id AS card_to_buy_id,
       buyers.card_id AS card_to_sell,
       buyers.id AS card_to_sell_id,
       sellers.rarity AS card_rarity,
       users.email AS trade_partner_email,
       users.pseudo AS trade_partner_pseudo
FROM sellers
INNER JOIN buyers ON sellers.user_id = buyers.user_id
INNER JOIN users ON sellers.user_id = users.id
AND sellers.rarity = buyers.rarity`,
    [res_id.rows[0].id]
  );

  await close();

  return res.rows;
}
