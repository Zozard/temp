"use client";

import Card from "@/components/Card";
import CardContainer from "@/components/CardContainer";
import { useEffect, useState } from "react";
import {
  loadAllCardsToGive,
  saveCardToGive,
  loadAllCardsSearched,
  saveCardSearched,
  loadUserCard,
} from "./saveprops";
import { useUser } from "../useUser";

export default function MarketPage() {
  const [cardToGive, setCardToGive] = useState("");
  const [cardSearched, setCardSearched] = useState("");
  const [allCardsToGive, setAllCardsToGive] = useState<{ card_name: string; pseudo: string }[]>([]);
  const [allCardsSearched, setAllCardsSearched] = useState<string[]>([]);
  const user = useUser();

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

  async function submitCardToGive() {
    if (cardToGive !== "" && user !== null) {
      const cardInserted = await saveCardToGive(user.email, cardToGive);
      const dbReturn = await loadUserCard(cardInserted);
      setAllCardsToGive([
        ...allCardsToGive,
        { card_name: dbReturn[0].card_name, pseudo: dbReturn[0].pseudo },
      ]);
    }
  }

  function submitCardSearched() {
    if (cardSearched !== "" && user !== null) {
      saveCardSearched(user.email, cardSearched);
      setAllCardsSearched([...allCardsSearched, cardSearched]);
    }
  }

  return (
    <div>
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
              <Card key={index} title={card.card_name} date="02-02-2025" owner={card.pseudo} />
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
