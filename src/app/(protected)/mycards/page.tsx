"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import {
  loadAllCards,
  saveCardState,
} from "./mycards";
import { Card } from "../../types/Card";
import "./card.css";
import { CardDisplay } from "./CardDisplay";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

type Direction = "BUY" | "SELL" | undefined;

function Page() {
  const user = useAuthenticatedUser();

  const [allCards, setAllCards] = useState<Card[]>([]);
  const [cardSelection, setCardSelection] = useState<{
    [key: number]: Direction;
  }>({});

  // const [cardsToSell, setCardsToSell] = useState(new Set<string>());
  // const [cardsToBuy, setCardsToBuy] = useState(new Set<string>());

  // Effet pour filtrer les cartes affichées (se déclenche quand on clique sur les boutons en haut)
  useEffect(() => {
    const allCardsPromise: Promise<Card[]> = loadAllCards(user.email);
    allCardsPromise.then((cards) => {
      setAllCards(cards);
      setCardSelection(
        Object.fromEntries(
          cards.map((card) => [
            card.id,
            card.quantity_to_buy > 0
              ? "BUY"
              : card.quantity_to_sell > 0
              ? "SELL"
              : undefined,
          ])
        )
      );
    });
  }, []);

  const save = () => {
    saveCardState(user.email, cardSelection);
    console.log(cardSelection);
  };

  const setSelection = (
    id: number,
    state: Direction
  ): void => {
    const currentState = cardSelection[id];
    if (currentState === state) {
      const updatedCardSelection = { ...cardSelection, [id]: undefined };
      setCardSelection(updatedCardSelection);
      return;
    }

    const updatedCardSelection = { ...cardSelection, [id]: state };
    setCardSelection(updatedCardSelection);
  };

  const setAllDirections = (direction: Direction) => {
    const updatedCardSelection = Object.fromEntries(Object.entries(cardSelection).map(([cardId]): [string, Direction] => [cardId, direction]));
    setCardSelection(updatedCardSelection);
  }

  return (
    <div className="all-cards-page">
      <div className="cardSetSelector">
      <button className="toggle-button-cardSet" onClick={() => setAllDirections("SELL")}>
          Offer all
        </button>
        <button className="toggle-button-cardSet" onClick={() => setAllDirections("BUY")}>
          Look for all
        </button>
        <button className="toggle-button-cardSet" onClick={() => setAllDirections(undefined)}>
          Clear
        </button>
        <button className="toggle-button-cardSet" onClick={save}>
          Save
        </button>
      </div>
      <div className="card-container">
        {allCards.map((card) => (
          <div key={card.id} className="card">
            <CardDisplay
              cardId={card.card_id}
              quantityToSell={null}
              quantityToBuy={null}
              editMode
              selectedMode={cardSelection[card.id]}
              setSell={() => setSelection(card.id, "SELL")}
              setBuy={() => setSelection(card.id, "BUY")}
            ></CardDisplay>
          </div>
        ))}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
