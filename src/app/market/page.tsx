"use client";

import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import CardContainer from "@/components/CardContainer";
import { useEffect, useState } from "react";
import { loadAllCardsToGive, saveCardToGive, loadAllCardsSearched, saveCardSearched } from "./saveprops";

export default function MarketPage() {
  const [cardToGive, setCardToGive] = useState("");
  const [cardSearched, setCardSearched] = useState("");
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

  function submitCardToGive() {
    if (cardToGive !== "") {
      saveCardToGive("g.zozine@gmail.com", cardToGive);
      setAllCardsToGive([...allCardsToGive, cardToGive]);
    }
  }

  function submitCardSearched() {
    if (cardSearched !== "") {
      saveCardSearched("g.zozine@gmail.com", cardSearched);
      setAllCardsSearched([...allCardsSearched, cardSearched]);
    }
  }

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <h1 className="title-box title-animated">Market</h1>
      {/* Contenu de la page market */}
      <div className="form-container">
        <label>Carte à donner : </label>
        <input
          type="text"
          name="cardToGive"
          onChange={(event) => setCardToGive(event.target.value)}
        />
        <button onClick={() => submitCardToGive()}>Save</button>
      </div>
      {
        /* afficher toutes les cartes à donner */

        <>
          <CardContainer title={"Cartes à donner"}>
            {allCardsToGive.map((card, index) => (
              <Card key={index} title={card} date="02-02-2025" owner="Jean-Zoz" />
            ))}
          </CardContainer>
        </>
      }
      <div className="form-container">
        <label>Carte recherchée : </label>
        <input
          type="text"
          name="cardSearched"
          onChange={(event) => setCardSearched(event.target.value)}
        />
        <button onClick={() => submitCardSearched()}>Save</button>
      </div>
      {
        /* afficher toutes les cartes recherchées */

        <>
          <CardContainer title={"Cartes recherchées"}>
            {allCardsSearched.map((card, index) => (
              <Card key={index} title={card} date="02-02-2025" owner="Jean-Samy" />
            ))}
          </CardContainer>
        </>
      }
    </div>
  );
}
