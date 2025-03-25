"use client";

import dynamic from 'next/dynamic';
import { useMemo, useEffect, useState } from "react";
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

  const [rarityFilter, setRarityFilter] = useState<string[]>([
    "⬧", "⬧⬧", "⬧⬧⬧", "⬧⬧⬧⬧",
    "★", "★★", "★★★", "👑"
  ]);

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

  //   const filteredCards = useMemo(() => {
//     console.log("Filtrage !");
//     if (cardFilter) {
//       return allCards.filter(
//         (card) => card.quantity_to_buy > 0 || card.quantity_to_sell > 0
//       );
//     } else {
//       return allCards;
//     }
//   }, [cardFilter, allCards]);

const filteredCards = useMemo( () => {
    return allCards.filter(
      (card) => rarityFilter.includes(card.rarity))
    }
, [rarityFilter, allCards]);


const toggleRarityFilter = (rarity: string) => {
  setRarityFilter(prevFilter => 
    prevFilter.includes(rarity)
      ? prevFilter.filter(item => item !== rarity) // on filtre avec tout sauf la rarity selectionnée
      : [...prevFilter, rarity] // on rajoute la rarity dans le tableau 
  );
};


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
    // ne doit impacter que les cartes du filtre actuel
    // = uniquement les ID des cartes filtrées
    const filteredCardIds = filteredCards.map(card => card.id);
  
    // On applique le changement de direction uniquement aux cartes filtrées  
    const filteredCardSelection = Object.fromEntries(
      Object.entries(cardSelection)
        .filter(([cardId]) => filteredCardIds.includes(Number(cardId)))
        .map(([cardId]): [string, Direction] => [cardId, direction])
    );
    
    // on merge les changements sur les cartes filtrées 
    // avec les états des cartes pas filtrées 
    // a noter que l'ordre du spread est important
    // filterCards écrase les valeurs de cardSelection
    const updatedCardSelection = {
      ...cardSelection,
      ...filteredCardSelection
    }
   
    setCardSelection(updatedCardSelection);
  }

  return (
    <div className="all-cards-page">

      <div className="cardSetSelector">
      <div>
    {[
      "⬧", "⬧⬧", "⬧⬧⬧", "⬧⬧⬧⬧",
      "★", "★★", "★★★", "👑"
    ].map((rarity) => (
      <button 
        key={rarity}
        onClick={() => toggleRarityFilter(rarity)}
        className={`toggle-button-cardSet ${rarityFilter.includes(rarity) ? 'active' : ''}`}
        >
        {rarity}
      </button>
    ))}
  </div>
</div>
  <div className='mass-selection'>
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
        {filteredCards.map((card) => (
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
