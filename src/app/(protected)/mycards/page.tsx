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

// Ondine - A1-220
// /_next/image?url=%2Fimages%2Fgame%2Fcard%2Ffull%2Ffr%2FTR_10_000120_00.png&w=640&q=75 640w

// Gallame - A2 #095
// /_next/image?url=%2Fimages%2Fgame%2Fcard%2Ffull%2Ffr%2FPK_10_003760_00.png&w=640&q=75

// Majaspic - Mythical Island #006 [R]
// /_next/image?url=%2Fimages%2Fgame%2Fcard%2Ffull%2Ffr%2FPK_10_002200_00.png&w=640&q=75

// Palkia Ex - A2 #049 [RR]
// https://static.wikia.nocookie.net/the-pokemon-trading-card-game-pocket/images/6/66/Palkia_EX.jpg/revision/latest?cb=20250211211408

// Chevroum -
// https://www.margxt.fr/wp-content/uploads/2024/10/Pokemon-Pocket-Puissance-Genetique-Plante-01.jpg

// herbizarre
// https://www.media.pokekalos.fr/img/jeux/pocket/extensions/puissance-genetique/2.png

// noadkoko
// https://www.media.pokekalos.fr/img/jeux/pocket/extensions/l-ile-fabuleuse/2.png
