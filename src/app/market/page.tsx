"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { loadAllCardsToGive, saveCardToGive } from "./saveprops";

export default function MarketPage() {
  const [cardToGive, setCardToGive] = useState("");
  const [allCardsToGive, setAllCardsToGive] = useState<string[]>([]);

  useEffect(() => {
    const allCardsToGivePromise = loadAllCardsToGive();
    allCardsToGivePromise.then((x) => {
      if (x !== null) {
        setAllCardsToGive(x);
      }
    });
  }, []);

  function submitCard(){
    saveCardToGive("g.zozine@gmail.com", cardToGive);
    setAllCardsToGive([...allCardsToGive, cardToGive]);
  }
  

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <h1>Market</h1>
      {/* Contenu de la page market */}
      <label>Carte à donner : </label>
      <input
        type="text"
        name="cardToGive"
        onChange={(event) => setCardToGive(event.target.value)}
      />
      <button onClick={() => submitCard()}>Save</button>
      {/* afficher toutes les cartes à donner */
        allCardsToGive.map(card => {
          return (
            <p> {card}</p>
          )
        })
      }
    </div>
  );
}
