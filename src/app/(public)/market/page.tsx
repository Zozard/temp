"use client";

import dynamic from "next/dynamic";
import { Trade, loadMyMatches } from "./market";
import { useEffect, useState } from "react";
import { CardDisplay } from "@/app/(protected)/mycards/CardDisplay";
import { useAuthenticatedUser } from "@/app/(protected)/hooks/useAuthenticatedUser";
import "./market.css";
import { saveCardState } from "@/app/(protected)/mycards/mycards";
import { NotificationModal } from "./components/NotificationModal";

function Market() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const user = useAuthenticatedUser();
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const allTradesPromise = loadMyMatches(user.email);
    allTradesPromise.then((trades) => setTrades(trades));
    console.log(trades);
  }, [user, refreshCounter]);

  const handleCancelTrade = async (email: string, card_id: string) => {
    try {
      await saveCardState(email, { [card_id]: null });
      setRefreshCounter((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving card state:", error);
    }
  };

  return (
    <>
    <h1> Possible trades</h1>
    <div className="market">
      {trades.length === 0 ? (
        <p>
          {" "}
          Si vous avez des matchs pour faire des échanges, ils apparaitront ici.
          <br />
          <br />
          Pour l&apos;instant, vous n&apos;en avez pas. Avez-vous bien rempli la
          page MyCards ?{" "}
        </p>
      ) : (
        trades.map((trade, index) => (
          <div key={index} className="trade">
            <div className="mine">
              <CardDisplay
                cardId={trade.card_to_sell}
                quantityToBuy={null}
                quantityToSell={null}
              />
            </div>
            <div className="me"> I give to {trade.trade_partner_pseudo}</div>
            <div className="arrows-container">
              <div className="top-button-container">
                <button
                  className="cancel-card-searched"
                  onClick={() =>
                    handleCancelTrade(user.email, trade.card_to_sell_id)
                  }
                >
                  Don&apos;t want to give anymore
                </button>
              </div>
              <div className="arrows">⇔</div>
              <div className="bottom-button-container">
                <button
                  className="cancel-card-offered"
                  onClick={() =>
                    handleCancelTrade(user.email, trade.card_to_buy_id)
                  }
                >
                  Don&apos;t look for anymore
                </button>
              </div>
            </div>
            <div className="offer">
              <CardDisplay
                cardId={trade.card_to_buy}
                quantityToBuy={null}
                quantityToSell={null}
              />
            </div>
            <div className="partner">{trade.trade_partner_pseudo} gives me</div>
            <NotificationModal trade={trade} />

          </div>
        ))
      )}
    </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(Market), {
  ssr: false,
});
