"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect, useState } from "react";
import { loadAllCards } from "./mycards";
import { Card } from "../../types/Card";
import "./card.css";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { Extension } from "./Extension";

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

  // État pour stocker le texte de recherche
  const [searchText, setSearchText] = useState("");

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

  useEffect(() => {
      const allCardsPromise: Promise<Card[]> = loadAllCards(user.token);
      allCardsPromise.then((cards) => {
        setAllCards(cards);
      });
  }, [user.token]);

  const toggleRarityFilter = (rarity: string) => {
    setRarityFilter(
      (prevFilter) =>
        prevFilter.includes(rarity)
          ? prevFilter.filter((item) => item !== rarity) // on filtre avec tout sauf la rarity selectionnée
          : [...prevFilter, rarity] // on rajoute la rarity dans le tableau
    );
  };

  return (
    <div className="all-cards-page">
      <div className="rarity-selector">
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
      <div className="name-filter-container">
        <label>Recherche par nom ou numéro : </label>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="extensions-container">
        {cardByExtension.map((extension) => (
          <Extension
            key={extension.name}
            extension={extension}
            rarityFilter={rarityFilter}
            searchText={searchText}
          />
        ))}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
