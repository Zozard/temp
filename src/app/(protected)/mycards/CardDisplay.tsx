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
  editMode?: boolean;
  selectedMode?: "BUY" | "SELL" | null;
  setSell?: () => void;
  setBuy?: () => void;
};

export function CardDisplay({
  cardId,
  quantityToSell,
  quantityToBuy,
  selectedMode,
  editMode,
  setSell,
  setBuy,
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

  return (
    <div className="card-wrapper">
      <div className="card-quantity-container">
        <img
          loading="lazy"
          src={`https://www.media.pokekalos.fr/img/jeux/pocket/extensions/${cardExtension}/${cardNumber}.png`}
        />
      </div>

      {editMode ? (
        <div className="edit-selection">
          <div
            className={`direction-overlay ${
              selectedMode === "BUY" ? "unchecked" : ""
            }`}
            onClick={() => setSell?.()}
          >
            <div className="action-button">
              Offer {selectedMode === "SELL" ? "✓" : ""}
            </div>
          </div>
          <div
            className={`direction-overlay ${
              selectedMode === "SELL" ? "unchecked" : ""
            }`}
            onClick={() => setBuy?.()}
          >
            <div className="action-button">
              Look for {selectedMode === "BUY" ? "✓" : ""}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
