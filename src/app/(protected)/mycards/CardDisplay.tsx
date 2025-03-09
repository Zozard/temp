"use client";

const extensionToUrl: Record<string, string> = {
  A1: "puissance-genetique",
  A1a: "l-ile-fabuleuse",
  A2: "choc-spatio-temporel",
};

type CardProps = {
  cardId: string;
  quantityToSell: number | null;
  quantityToBuy: number | null;
  showQuantityOverlay?: boolean;
  onCardClick?: () => void; // Ajout d'un gestionnaire de clic
};

export function CardDisplay({
  cardId,
  quantityToSell,
  quantityToBuy,
  showQuantityOverlay,
  onCardClick,
}: CardProps) {
  const trimLeftZeros = (str: string) => {
    while (str.startsWith("0")) {
      str = str.substring(1);
    }
    return str;
  };

  if (quantityToBuy === null) {
    quantityToBuy = 0;
  }
  if (quantityToSell === null) {
    quantityToSell = 0;
  }

  const [rawCardExtension, rawCardNumber] = cardId.split("-");
  const cardNumber = trimLeftZeros(rawCardNumber);
  const cardExtension = extensionToUrl[rawCardExtension];

  const hasQuantity = (quantityToSell ?? 0) > 0 || (quantityToBuy ?? 0) > 0;

  return (
    <div className="card-wrapper">
      <div className={`card-quantity-container ${hasQuantity ? "has-quantity" : ""}`}>
        <img
          loading="lazy"
          src={`https://www.media.pokekalos.fr/img/jeux/pocket/extensions/${cardExtension}/${cardNumber}.png`}
          onClick={onCardClick}
        />
      </div>
      {showQuantityOverlay && (
        <QuantityDisplay quantityToBuy={quantityToBuy} quantityToSell={quantityToSell} />
      )}
    </div>
  );
}

interface QuantityDisplayProps {
  quantityToSell: number;
  quantityToBuy: number;
}

function QuantityDisplay({ quantityToBuy, quantityToSell }: QuantityDisplayProps) {
  if (quantityToSell === 0 && quantityToBuy === 0) {
    return null;
  }

  return (
    <div className="quantity-display">
      {quantityToSell > 0 && <div className="quantity-sell">À donner : {quantityToSell}</div>}
      {quantityToBuy > 0 && <div className="quantity-buy">Recherchées : {quantityToBuy}</div>}
    </div>
  );
}
