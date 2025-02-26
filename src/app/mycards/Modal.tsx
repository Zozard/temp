import { Card } from "./mycards";
import { CardDisplay } from "./CardDisplay";
import { useState } from "react";

type ModalProps = {
  onClose: () => void;
  card: Card | null;
  quantityToSell: number | null;
  quantityToBuy: number | null;
  onSave: (quantityToSell: number, quantityToBuy: number) => Promise<void>;
};

// mettre à jour pour avoir un 2e input
export function Modal({ onClose, card, onSave }: ModalProps) {
  const [inputQuantityToSell, setInputQuantityToSell] = useState(card?.quantity_to_sell);
  const [inputQuantityToBuy, setInputQuantityToBuy] = useState(card?.quantity_to_buy);
  const [isLoading, setIsLoading] = useState(false);

  console.log("input"+inputQuantityToSell);

  if (card === null) {
    return null;
  }

  const internalSave = async () => {
    setIsLoading(true);
    await onSave(inputQuantityToSell!, inputQuantityToBuy!);
    setIsLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
          maxWidth: "500px",
          margin: "20px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardDisplay cardId={card.card_id} quantityToSell={card.quantity_to_sell!} quantityToBuy={card.quantity_to_buy!}/>
        <h2 style={{ marginTop: 0 }}>{card.card_name}</h2>
        <label> A donner : </label>
        <input
          type="number"
          value={inputQuantityToSell ?? card.quantity_to_sell!} // cette astuce me paraît dégueu mais au moins ça marche
          onChange={(event) => setInputQuantityToSell(Number(event.target.value))}
        /><br/>
        <label> Recherchées : </label>
        <input
          type="number"
          value={inputQuantityToBuy ?? card.quantity_to_buy!} // cette astuce me paraît dégueu mais au moins ça marche
          onChange={(event) => setInputQuantityToBuy(Number(event.target.value))}
        />
        <button onClick={internalSave} disabled={isLoading}>
          {isLoading ? "Loading..." : "Save"}
        </button>
      </div>
    </div>
  );
}
