"use client";

import { fakeLoadMatchingOffers } from "./market";

export default function Market() {
  const matchingOffers = fakeLoadMatchingOffers("g.zozine@gmail.com");

  console.log(matchingOffers);

  return (
    <div className="market">
      <div className="card-list">
        {matchingOffers.map((offers) => (
            <li key={offers.card.card_name}>
              Carte : {offers.card.card_name} Quantité recherchée : {offers.card.quantity_to_buy}
              <ul>
              {offers.sellers.map((offer) => (
                <li key={offer.pseudo}>
                  {offer.pseudo} {offer.quantity}
                </li>
              ))}
              </ul>
            </li>
        ))}
      </div>
    </div>
  );
}
