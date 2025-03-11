"use client";

import { loadAllOffers } from "./market";
import { useEffect, useState } from "react";
import { Card } from "../../types/Card";
import { CardDisplay } from "@/app/(protected)/mycards/CardDisplay";
import "./market.css";

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
  pseudo: string;
  quantity_to_sell: number;
  quantity_to_buy: number;
};

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
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // J'ai été obligé de mettre un + parce que sinon ça se comportait comme des strings
      // POURQUOI??
      if (+buyerOffer.quantity_to_buy <= +sellerOffer.quantity_to_sell) {
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
              quantity_to_buy: buyerOffer.quantity_to_buy,
            },
            sellers: [{ pseudo: sellerOffer.pseudo, quantity: sellerOffer.quantity_to_sell }],
          });
        } else {
          // si elle y est, on rajoute juste un seller
          const newSeller = { pseudo: sellerOffer.pseudo, quantity: sellerOffer.quantity_to_sell };
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

export default function Market() {
  const [allMatches, setAllMatches] = useState<MatchingOffer[]>([]);

  const offers: Offer[] = [
    {
      id: 1,
      card_id: "A1-220",
      card_name: "Pikachu",
      rarity: "Common",
      email: "g.zozine@gmail.com",
      pseudo: "Jochbar",
      quantity_to_sell: 0,
      quantity_to_buy: 3,
    },
    {
      id: 2,
      card_id: "B2-110",
      card_name: "Dracaufeu",
      rarity: "Rare",
      email: "g.zozine@gmail.com",
      pseudo: "Jochbar",
      quantity_to_sell: 0,
      quantity_to_buy: 2,
    },
    {
      id: 3,
      card_id: "C3-330",
      card_name: "Mewtwo",
      rarity: "Legendary",
      email: "g.zozine@gmail.com",
      pseudo: "Jochbar",
      quantity_to_sell: 0,
      quantity_to_buy: 2,
    },
    {
      id: 1,
      card_id: "A1-220",
      card_name: "Pikachu",
      rarity: "Common",
      email: "remy.duval@hotmail.com",
      pseudo: "RémiLeCon",
      quantity_to_sell: 5,
      quantity_to_buy: 0,
    },
    {
      id: 2,
      card_id: "B2-110",
      card_name: "Dracaufeu",
      rarity: "Rare",
      email: "sophie.marchand@yahoo.fr",
      pseudo: "Sophie",
      quantity_to_sell: 3,
      quantity_to_buy: 0,
    },
    {
      id: 5,
      card_id: "C5-110",
      card_name: "Kamek",
      rarity: "Rare",
      email: "sophie.marchand@yahoo.fr",
      pseudo: "Sophie",
      quantity_to_sell: 3,
      quantity_to_buy: 0,
    },
    {
      id: 3,
      card_id: "C3-330",
      card_name: "Mewtwo",
      rarity: "Legendary",
      email: "sophie.marchand@yahoo.fr",
      pseudo: "Sophie",
      quantity_to_sell: 2,
      quantity_to_buy: 0,
    },
    {
      id: 3,
      card_id: "C3-330",
      card_name: "Mewtwo",
      rarity: "Legendary",
      email: "josé.marchand@yahoo.fr",
      pseudo: "José",
      quantity_to_sell: 2,
      quantity_to_buy: 0,
    },
    {
      id: 3,
      card_id: "C3-330",
      card_name: "Mewtwo",
      rarity: "Legendary",
      email: "samy@gmail.com",
      pseudo: "Samy",
      quantity_to_sell: 2,
      quantity_to_buy: 0,
    },
  ];

  useEffect(() => {
    const allOffersPromise: Promise<Offer[]> = loadAllOffers();
    allOffersPromise.then((offersDynamic) => {
      console.log(offersDynamic);
      const matchingOffersDynamic: MatchingOffer[] = findMatches(
        "g.zozine@gmail.com",
        offersDynamic
      );
      console.log(matchingOffersDynamic);
      setAllMatches(matchingOffersDynamic);
    });
  }, []);

  const matchingOffers: MatchingOffer[] = findMatches("g.zozine@gmail.com", offers);

  console.log(matchingOffers);

  return (
    <div className="market">
      {allMatches.map((offers) => (
        <>
          <div className="market-line">
            <div className="market-card">
              <CardDisplay
                cardId={offers.card.card_id}
                quantityToSell={offers.card.quantity_to_sell}
                quantityToBuy={offers.card.quantity_to_buy}
              />
            </div>
            <div className="market-data">
              Quantité recherchée : {offers.card.quantity_to_buy}
              {offers.sellers.map((offer) => (
                <li key={offer.pseudo}>
                  {offer.pseudo} {offer.quantity}
                </li>
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  );
}
