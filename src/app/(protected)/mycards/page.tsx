"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect, useState } from "react";
import { loadAllCards, saveCardState } from "./mycards";
import { Card } from "../../types/Card";
import "./card.css";
import { CardDisplay } from "./CardDisplay";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

type Direction = "BUY" | "SELL" | undefined;

function Page() {
  const user = useAuthenticatedUser();

  const [allCards, setAllCards] = useState<Card[]>([]);

  const [rarityFilter, setRarityFilter] = useState<string[]>([
    "⬧",
    "⬧⬧",
    "⬧⬧⬧",
    "⬧⬧⬧⬧",
    "★",
    "★★",
    "★★★",
    "👑",
  ]);

  const [cardSelection, setCardSelection] = useState<{
    [key: number]: Direction;
  }>({});

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // const cards = [card1, card2, card3];

  // const extensions = [
  //   { name: "A1-1", cards: [card1, card2, card3] },
  //   { name: "A1-2", cards: [card1, card2, card3] },
  // ]

  // const currentExtension = {
  //   "A1": [card1, card2, card3],
  //   "A2": [card1, card2, card3],
  // }

  const cardByExtension = useMemo(() => {
    // on groupe les cartes par extension
    const result = Object.groupBy(allCards, (card) => {
      const [extensionId] = card.card_id.split("-");
      return extensionId;
    }) as Record<string, Card[]>; // Le `as` permet de dire "Ta gueule !" à TypeScript, parce que groupBy renvoie un Partial sinon, pas bien pratique

    // Fonctionnellement équivalent à ça :
    // structure intermédiaire pour construire les données
    // const result: { [extension: string]: Card[] } = {}

    // on groupe les cartes par extension
    // allCards.forEach(card => {
    //   const [extensionId] = card.card_id.split("-")

    //   if (result[extensionId] === undefined){
    //     result[extensionId] = [];
    //   }
    //   result[extensionId].push(card);
    // })

    // extraction des clés de result (== préfixe d'extension A1, A2...)
    const extensionIds = Object.keys(result);

    // création d'un tableau pour manipuler les données + facilement
    const extension: { name: string; cards: Card[] }[] = [];

    extensionIds.forEach((id) =>
      extension.push({ name: id, cards: result[id] })
    );

    // Fonctionnellement équivalent à ça :
    // const extensions = Object.entries(result).map(([extension, cards]) => {
    //  return { name: extension, cards }
    // })

    return extension;
  }, [allCards]);

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


  const filteredCards = useMemo( () => {
      return allCards.filter(
        (card) => rarityFilter.includes(card.rarity))
      }
  , [rarityFilter, allCards]);

  const filteredCardsByExtension = useMemo(() => {
    return cardByExtension.map((extension) => {
      return {
        ...extension,
        cards: extension.cards.filter((card) =>
          rarityFilter.includes(card.rarity)
        ),
      };
    });
  }, [cardByExtension, rarityFilter]);

  const toggleRarityFilter = (rarity: string) => {
    setRarityFilter(
      (prevFilter) =>
        prevFilter.includes(rarity)
          ? prevFilter.filter((item) => item !== rarity) // on filtre avec tout sauf la rarity selectionnée
          : [...prevFilter, rarity] // on rajoute la rarity dans le tableau
    );
  };

  const save = async () => {
    // Activer l'état de chargement
    setIsSaving(true);
    
    try {
      // Appel à la fonction de sauvegarde (maintenant asynchrone)
      await saveCardState(user.email, cardSelection);
      
      // Attendre un court instant pour que l'utilisateur voie la confirmation
      // (optionnel, pour une meilleure UX)
      setTimeout(() => {
        setIsSaving(false);
      }, 200);
    } catch (error) {
      console.error("Error saving card state:", error);
      setIsSaving(false);
    }
  };

  const setSelection = (id: number, state: Direction): void => {
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
    const filteredCardIds = new Set(filteredCards.map((card) => card.id));

    // On applique le changement de direction uniquement aux cartes filtrées
    const filteredCardSelection = Object.fromEntries(
      Object.entries(cardSelection)
        .filter(([cardId]) => filteredCardIds.has(Number(cardId)))
        .map(([cardId]): [string, Direction] => [cardId, direction])
    );

    // on merge les changements sur les cartes filtrées
    // avec les états des cartes pas filtrées
    // a noter que l'ordre du spread est important
    // filteredCardSelection écrase les valeurs de cardSelection
    const updatedCardSelection = {
      ...cardSelection,
      ...filteredCardSelection,
    };

    setCardSelection(updatedCardSelection);
  };

  return (
    <div className="all-cards-page">
      <div className="cardSetSelector">
        <div>
          {["⬧", "⬧⬧", "⬧⬧⬧", "⬧⬧⬧⬧", "★", "★★", "★★★", "👑"].map((rarity) => (
            <button
              key={rarity}
              onClick={() => toggleRarityFilter(rarity)}
              className={`toggle-button-cardSet ${
                rarityFilter.includes(rarity) ? "active" : ""
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>
      </div>
      <div className="mass-selection">
        <button
          className="toggle-button-cardSet"
          onClick={() => setAllDirections("SELL")}
        >
          Offer all
        </button>
        <button
          className="toggle-button-cardSet"
          onClick={() => setAllDirections("BUY")}
        >
          Look for all
        </button>
        <button
          className="toggle-button-cardSet"
          onClick={() => setAllDirections(undefined)}
        >
          Clear
        </button>
        <button   
          className={`toggle-button-cardSet ${isSaving ? 'saving' : ''}`} 
          onClick={save}
          disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div className="card-container">
        {filteredCardsByExtension.map((extension) => (
          <div key={extension.name} className="extension-container">
            <h2>{extension.name}</h2>
            {extension.cards.map((card) => (
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
        ))}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
