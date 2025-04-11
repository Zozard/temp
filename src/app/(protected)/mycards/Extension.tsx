import { Card } from "../../types/Card";
import { Accordion } from "./Accordion";
import { CardDisplay, trimLeftZeros, extensionToUrl } from "./CardDisplay";
import { useState, useMemo, useEffect } from "react";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { saveCardState } from "./mycards";
import "./Extension.css";

type Direction = "BUY" | "SELL" | null;

type Extension = {
  cards: Card[];
  name: string;
};

type ExtensionProps = {
  extension: Extension;
  rarityFilter: string[];
  searchText: string;
};

export function Extension(props: ExtensionProps) {
  const user = useAuthenticatedUser();

  const [cardSelection, setCardSelection] = useState<{
    [key: number]: Direction;
  }>({});

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Effet pour filtrer les cartes affichées (se déclenche quand on clique sur les boutons en haut)
  useEffect(() => {
      setCardSelection(
        Object.fromEntries(
          props.extension.cards.map((card) => [
            card.id,
            card.quantity_to_buy > 0
              ? "BUY"
              : card.quantity_to_sell > 0
              ? "SELL"
              : null,
          ])
        )
      );
  }, [props.extension.cards]);

  const setSelection = (id: number, state: Direction): void => {
    const currentState = cardSelection[id];
    if (currentState === state) {
      const updatedCardSelection = { ...cardSelection, [id]: null };
      setCardSelection(updatedCardSelection);
      return;
    }

    const updatedCardSelection = { ...cardSelection, [id]: state };
    setCardSelection(updatedCardSelection);
  };

  const save = async () => {
    // Activer l'état de chargement
    setIsSaving(true);

    try {
      // Appel à la fonction de sauvegarde (maintenant asynchrone)
      await saveCardState(user.email, cardSelection);

      // Attendre un court instant pour que l'utilisateur voie la confirmation
      // (optionnel, pour une meilleure UX)
      setTimeout(() => {
        setIsSaving(false);
      }, 200);
    } catch (error) {
      console.error("Error saving card state:", error);
      setIsSaving(false);
    }
  };

  const filteredCards = useMemo(() => {
    // Vérifier si la recherche est uniquement numérique
    const isNumeric = /^\d+$/.test(props.searchText);

    return props.extension.cards.filter((card) => {
      // on a besoin d'avoir le numéro de carte sans l'extension avant
      // dans l'objectif de trimer les 0 pour la comparaison
      const [, rawCardNumber] = card.card_id.split("-");
      const cardNumber = trimLeftZeros(rawCardNumber);

      if (isNumeric) {
        return (
          cardNumber.toString() === props.searchText &&
          props.rarityFilter.includes(card.rarity)
        );
      } else {
        return (
          props.rarityFilter.includes(card.rarity) &&
          card.card_name.toLowerCase().includes(props.searchText.toLowerCase())
        );
      }
    });
  }, [props.rarityFilter, props.searchText, props.extension.cards]);

  const setAllDirections = (direction: Direction) => {
    // ne doit impacter que les cartes du filtre actuel
    // = uniquement les ID des cartes filtrées
    debugger;
    const filteredCardIds = new Set(filteredCards.map((card) => card.id));

    // On applique le changement de direction uniquement aux cartes filtrées
    const filteredCardSelection = Object.fromEntries(
      Object.entries(cardSelection)
        .filter(([cardId]) => filteredCardIds.has(Number(cardId)))
        .map(([cardId]): [string, Direction] => [cardId, direction])
    );

    // on merge les changements sur les cartes filtrées
    // avec les états des cartes pas filtrées
    // a noter que l'ordre du spread est important
    // filteredCardSelection écrase les valeurs de cardSelection
    const updatedCardSelection = {
      ...cardSelection,
      ...filteredCardSelection,
    };

    setCardSelection(updatedCardSelection);
  };

  return (
    <>
      <div className="extension-container">
        <Accordion
          header={
            <div className="extension-header">
              <img
                src={`https://www.media.pokekalos.fr/img/jeux/pocket/extensions/${
                  extensionToUrl[props.extension.name]
                }/logo.png`}
              />
            </div>
          }
          initialState="open"
        >
          <div className="mass-selection">
            <button
              className="toggle-button-cardSet"
              onClick={() => setAllDirections("SELL")}
            >
              Offer all
            </button>
            <button
              className="toggle-button-cardSet"
              onClick={() => setAllDirections("BUY")}
            >
              Look for all
            </button>
            <button
              className="toggle-button-cardSet"
              onClick={() => setAllDirections(null)}
            >
              Clear
            </button>
            <button
              className={`toggle-button-cardSet ${isSaving ? "saving" : ""}`}
              onClick={save}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
          <div className="card-container">
            {filteredCards.map((card) => (
              <div key={card.id} className="card">
                <CardDisplay
                  cardId={card.card_id}
                  quantityToSell={null}
                  quantityToBuy={null}
                  editMode
                  selectedMode={cardSelection[card.id]}
                  setSell={() => setSelection(card.id, "SELL")}
                  setBuy={() => setSelection(card.id, "BUY")}
                ></CardDisplay>
              </div>
            ))}
          </div>
        </Accordion>
      </div>
    </>
  );
}
