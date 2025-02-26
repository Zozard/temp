const extensionToUrl: Record<string, string> = {
  A1: "puissance-genetique",
  A1a: "l-ile-fabuleuse",
};

type CardProps = {
  cardId: string;
  quantityToSell: number | null;
  quantityToBuy: number | null;
  onCardClick?: () => void; // Ajout d'un gestionnaire de clic
};

export function CardDisplay({ cardId, quantityToSell, quantityToBuy, onCardClick }: CardProps) {
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
    <>
      <img
        loading="lazy"
        src={`https://www.media.pokekalos.fr/img/jeux/pocket/extensions/${cardExtension}/${cardNumber}.png`}
        onClick={onCardClick}
      />
      <p>A donner : {quantityToSell} </p>
      <p>Recherchées : {quantityToBuy} </p>
    </>
  );
}
