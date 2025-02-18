"use client";

import { useEffect, useState } from "react";
import { Card, loadAllCards, loadMyCards } from "./mycards";
import "./card.css";
import { useUser } from "../useUser";
import { Modal } from "./Modal";

export default function MyCardsPage() {
  const [allCards, setAllCards] = useState<Card[]>([]);
  // toggle links for restricting which cards we display : all cards or just my cards to sell / to give
  const [cardSet, setCardSet] = useState("allCards");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const user = useUser();

  useEffect(() => {
    const allCardsPromise: Promise<Card[]> =
      cardSet === "allCards" ? loadAllCards() : loadMyCards(user!.email);
    allCardsPromise.then((cards) => {
      setAllCards(cards);
      console.log(cards);
    });
  }, [cardSet]);

  return (
    <>
      <div className="cardSetSelector">
        <button className="toggle-button-cardSet" onClick={() => setCardSet("allCards")}>
          All cards
        </button>
        <button className="toggle-button-cardSet" onClick={() => setCardSet("myCards")}>
          My Cards
        </button>
      </div>
      <div className="card-container">
        {allCards.map((card) => (
          <div key={card.card_id} className="card">
            <CardDisplay
              cardId={card.card_id}
              cardName={card.card_name}
              onCardClick={() => setSelectedCard(card)}
            ></CardDisplay>
          </div>
        ))}
      </div>
      <Modal isOpen={selectedCard !== null} onClose={() => setSelectedCard(null)}>
        {selectedCard && <h2>{selectedCard.card_name}</h2>}
      </Modal>
    </>
  );
}

const extensionToUrl: Record<string, string> = {
  A1: "puissance-genetique",
  A1a: "l-ile-fabuleuse",
};

type CardProps = {
  cardId: string;
  cardName: string; // Ajout du nom de la carte
  onCardClick: () => void; // Ajout d'un gestionnaire de clic
};

function CardDisplay({ cardId, onCardClick }: CardProps) {
  const trimLeftZeros = (str: string) => {
    while (str.startsWith("0")) {
      str = str.substring(1);
    }
    return str;
  };

  const [rawCardExtension, rawCardNumber] = cardId.split("-");
  const cardNumber = trimLeftZeros(rawCardNumber);
  const cardExtension = extensionToUrl[rawCardExtension];

  return (
    <img
      loading="lazy"
      src={`https://www.media.pokekalos.fr/img/jeux/pocket/extensions/${cardExtension}/${cardNumber}.png`}
      onClick={onCardClick}
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
