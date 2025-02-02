"use client";

import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import CardContainer from "@/components/CardContainer";
import { useEffect, useState } from "react";
import { loadAllCardsToGive, saveCardToGive, loadAllCardsSearched } from "./saveprops";

export default function MarketPage() {
  const [cardToGive, setCardToGive] = useState("");
  const [allCardsToGive, setAllCardsToGive] = useState<string[]>([]);
  const [allCardsSearched, setAllCardsSearched] = useState<string[]>([]);

  useEffect(() => {
    const allCardsToGivePromise = loadAllCardsToGive();
    allCardsToGivePromise.then((x) => {
      if (x !== null) {
        setAllCardsToGive(x);
      }
    });
  }, []);

  useEffect(() => {
    const allCardsSearchedPromise = loadAllCardsSearched();
    allCardsSearchedPromise.then((x) => {
      if (x !== null) {
        setAllCardsSearched(x);
      }
    });
  }, []);

  function submitCard() {
    saveCardToGive("g.zozine@gmail.com", cardToGive);
    setAllCardsToGive([...allCardsToGive, cardToGive]);
  }

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <h1 className="title-box title-animated">Market</h1>
      {/* Contenu de la page market */}
      <label>Carte à donner : </label>
      <input
        type="text"
        name="cardToGive"
        onChange={(event) => setCardToGive(event.target.value)}
      />
      <button onClick={() => submitCard()}>Save</button>
      {
        /* afficher toutes les cartes à donner */

          <>
          <CardContainer title={"Cartes à donner"}>
            {allCardsToGive.map((card, index) => (
              <Card key={index} title={card} date="02-02-2025" children={undefined} />
            ))}
          </CardContainer><CardContainer title={"Cartes à échanger" }>
            {allCardsSearched.map((card, index) => (
              <Card key={index} title={card} date="02-02-2025" children={undefined}/>
            ))}
          </CardContainer></>
      }
    </div>
  );
}
