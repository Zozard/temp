"use client";

import { useEffect, useState } from "react";
import { Card, loadAllCards, loadMyCards, updateToBuy, updateToSell } from "./mycards";
import "./card.css";
import { useUser } from "../useUser";
import { Modal } from "./Modal";
import { CardDisplay } from "./CardDisplay";

export default function MyCardsPage() {
  const [allCards, setAllCards] = useState<Card[]>([]);
  // toggle links for restricting which cards we display : all cards or just my cards to sell / to give
  const [cardSet, setCardSet] = useState("allCards");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  // État pour stocker la quantité lors de l'ouverture de la modale
  const [quantityToSell, setQuantityToSell] = useState<number>(0);
  const [quantityToBuy, setQuantityToBuy] = useState<number>(0);
  const user = useUser();

  // Effet qui se déclenche quand une carte est sélectionnée
  // useEffect(() => {
  // Si une carte est sélectionnée, on charge sa quantité
  //   async function fetchQuantity() {
  //   if (selectedCard && user!.email) {
  //      const result = await loadUserCardQuantity(user!.email, selectedCard.card_id);
  //     console.log('result='+result)
  //       setQuantity(result);
  //     }
  //  }
  //   fetchQuantity();
  //  }, [selectedCard]); // L'effet se relance si selectedCard change

  // Effet pour filtrer les cartes affichées (se déclenche quand on clique sur les boutons en haut)
  useEffect(() => {
    const allCardsPromise: Promise<Card[]> =
      cardSet === "allCards" ? loadAllCards() : loadMyCards(user!.email);
    allCardsPromise.then((cards) => {
      setAllCards(cards);
    console.log(cards);
    });
  }, [cardSet]);

  const onCardSave = async (quantityToSell: number, quantityToBuy: number) => {
    console.log(selectedCard);
    console.log(quantityToBuy);
    console.log(quantityToSell);
    console.log(await updateToSell(selectedCard!.card_id, user!.email, quantityToSell));
    console.log(await updateToBuy(selectedCard!.card_id, user!.email, quantityToBuy));
    // Appeler le backend:
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Saved");
    setSelectedCard(null);
    setQuantityToSell(0);
    setQuantityToBuy(0);
  };

  const handleCardClick = (card: Card) =>
  {

    setSelectedCard(card);
    console.log("quantityToSell"+card.quantity_to_sell!);
    console.log("quantityToBuy"+card.quantity_to_buy);
    setQuantityToSell(card.quantity_to_sell!);     
    setQuantityToBuy(card.quantity_to_buy!);
    console.log("quantity"+quantityToSell);     // a voir avec samy pourquoi == 0 
  }

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
              quantityToSell={card.quantity_to_sell!}
              quantityToBuy={card.quantity_to_buy!}
              onCardClick={() => handleCardClick(card)}
            ></CardDisplay>
          </div>
        ))}
      </div>
      <Modal
        onClose={() => setSelectedCard(null)}
        card={selectedCard}
        quantityToSell={quantityToSell}
        quantityToBuy={quantityToBuy}
        onSave={onCardSave}
      />
    </>
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
