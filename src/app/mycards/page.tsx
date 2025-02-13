"use client";

import { useEffect, useState } from "react";
import { Card, loadAllCards } from "./mycards";
import "./card.css";

export default function MyCardsPage() {
  const [allCards, setAllCards] = useState<Card[]>([]);

  useEffect(() => {
    const allCardsPromise = loadAllCards();
    allCardsPromise.then((cards) => {
      setAllCards(cards);
    });
  }, []);

  return (
    <div className="card-container">
      {allCards.map((card) => (
        <div key={card.card_id} className="card">
          {card.card_name}
          <Card cardId={card.card_id}></Card>
        </div>
      ))}
    </div>
  );
}

type CardProps = {
  cardId: string;
};

const extensionToUrl: Record<string, string> = {
  A1: "puissance-genetique",
  A1a: "l-ile-fabuleuse",
};

function Card(props: CardProps) {
  const { cardId } = props;

  // A1-113

  const [rawCardExtension, rawCardNumber] = cardId.split("-");

  const cardNumber = rawCardNumber.replaceAll("0", "");
  const cardExtension = extensionToUrl[rawCardExtension];

  return (
    <img
      loading="lazy"
      src={`https://www.media.pokekalos.fr/img/jeux/pocket/extensions/${cardExtension}/${cardNumber}.png`}
    />
  );
}

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
