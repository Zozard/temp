import { Card } from "./mycards";
import { CardDisplay } from "./CardDisplay";
import { useState } from "react";

type ModalProps = {
  onClose: () => void;
  card: Card | null;
  quantity: number;
  onSave: (quantity: number) => Promise<void>;
};


// mettre à jour pour avoir un 2e input 
export function Modal({ onClose, card, quantity, onSave }: ModalProps) {
  if (card === null) {
    return null;
  }

  const [inputQuantity, setInputQuantity] = useState(quantity);
  const [isLoading, setIsLoading] = useState(false);

  const internalSave = async () => {
    setIsLoading(true);
    await onSave(inputQuantity);
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
        <CardDisplay cardId={card.card_id} />
        <h2 style={{ marginTop: 0 }}>{card.card_name}</h2>
        <input
          type="number"
          value={inputQuantity}
          onChange={(event) => setInputQuantity(Number(event.target.value))}
        />
        <button onClick={internalSave} disabled={isLoading}>
          {isLoading ? "Loading..." : "Save"}
        </button>
      </div>
    </div>
  );
}
