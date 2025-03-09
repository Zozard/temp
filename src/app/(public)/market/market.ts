"use client";

import { initDatabase } from "@/actions/database";
import { Card } from "../../types/Card";

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
export async function loadMatchingOffers(buyerEmail: string): Promise<MatchingOffer[]>{
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

    const offers = res.rows;

    console.log(res.rows);

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
        }
      }
    });
  });

    return matches;
}
*/

// peut-être renommer cette fonction qui prend juste un email en entrée et qui renvoie les trucs qui matchs
// et l'utiliser dans la fonction qui appelle la bdd 


export function fakeLoadMatchingOffers(buyerEmail: string): MatchingOffer[] {
  const fakeOffers: Offer[] = [
    {
      id: 1,
      card_id: "A1-220",
      card_name: "Pikachu",
      rarity: "Common",
      email: "g.zozine@gmail.com",
      quantity_to_sell: 0,
      quantity_to_buy: 3,
    },
    {
      id: 2,
      card_id: "B2-110",
      card_name: "Dracaufeu",
      rarity: "Rare",
      email: "g.zozine@gmail.com",
      quantity_to_sell: 0,
      quantity_to_buy: 2,
    },
    {
      id: 3,
      card_id: "C3-330",
      card_name: "Mewtwo",
      rarity: "Legendary",
      email: "g.zozine@gmail.com",
      quantity_to_sell: 0,
      quantity_to_buy: 2,
    },
    {
      id: 1,
      card_id: "A1-220",
      card_name: "Pikachu",
      rarity: "Common",
      email: "remy.duval@hotmail.com",
      quantity_to_sell: 5,
      quantity_to_buy: 0,
    },
    {
      id: 2,
      card_id: "B2-110",
      card_name: "Dracaufeu",
      rarity: "Rare",
      email: "sophie.marchand@yahoo.fr",
      quantity_to_sell: 3,
      quantity_to_buy: 0,
    },
    {
      id: 5,
      card_id: "C5-110",
      card_name: "Kamek",
      rarity: "Rare",
      email: "sophie.marchand@yahoo.fr",
      quantity_to_sell: 3,
      quantity_to_buy: 0,
    },
    {
      id: 3,
      card_id: "C3-330",
      card_name: "Mewtwo",
      rarity: "Legendary",
      email: "sophie.marchand@yahoo.fr",
      quantity_to_sell: 2,
      quantity_to_buy: 0,
    },
    {
      id: 3,
      card_id: "C3-330",
      card_name: "Mewtwo",
      rarity: "Legendary",
      email: "josé.marchand@yahoo.fr",
      quantity_to_sell: 2,
      quantity_to_buy: 0,
    },
    {
      id: 3,
      card_id: "C3-330",
      card_name: "Mewtwo",
      rarity: "Legendary",
      email: "samy@gmail.com",
      quantity_to_sell: 2,
      quantity_to_buy: 0,
    },
  ];

  // on fait un tableau avec uniquement les lignes du buyer
  const buyerOffers = fakeOffers.filter(
    (offer) => offer.email === buyerEmail && offer.quantity_to_buy > 0
  );

  // un autre tableau avec les lignes autres que le buyer (donc tous les potentiels sellers)
  const sellerOffers = fakeOffers.filter(
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
        }
        else 
        {
          // si elle y est, on rajoute juste un seller 
            const newSeller = { pseudo: sellerOffer.email, quantity: sellerOffer.quantity_to_sell }
            const offerIndex = matches.findIndex(offer => offer.card.card_id === buyerOffer.card_id)
            matches[offerIndex].sellers.push(newSeller);
        }
      }
    });
  });

  /*
  const fakeMatchingOffers = [
    {
      card: {
        id: 1,
        card_id: "A1-220",
        card_name: "Abra",
        rarity: "$",
        quantity_to_sell: 0,
        quantity_to_buy: 5,
      },
      sellers: [
        { pseudo: "dany", quantity: 12 },
        { pseudo: "josé", quantity: 5 },
      ],
    },
    {
      card: {
        id: 2,
        card_id: "A2-220",
        card_name: "Spiritomb",
        rarity: "$",
        quantity_to_sell: 0,
        quantity_to_buy: 5,
      },
      sellers: [
        { pseudo: "rembrandt", quantity: 5 },
        { pseudo: "kamel", quantity: 3 },
      ],
    },
  ];*/

  return matches;
}
