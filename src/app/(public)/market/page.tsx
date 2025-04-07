"use client";

import dynamic from "next/dynamic";
import { Trade, loadMyMatches } from "./market";
import { useEffect, useState } from "react";
import { CardDisplay } from "@/app/(protected)/mycards/CardDisplay";
import { useAuthenticatedUser } from "@/app/(protected)/hooks/useAuthenticatedUser";
import "./market.css";

function Market() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const user = useAuthenticatedUser();

  useEffect(() => {
    const allTradesPromise = loadMyMatches(user.email);
    allTradesPromise.then((trades) => setTrades(trades));
  }, [user]);

  return (
    <div className="market">
      {trades.length === 0 ? (
        <p>
          {" "}
          Si vous avez des matchs pour faire des échanges, ils apparaitront ici.
          <br />
          <br />
          Pour l'instant, vous n'en avez pas. Avez-vous bien rempli la page
          MyCards ?{" "}
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
            <div className="me">Me</div>
            <div className="arrows">⇔</div>
            <div className="offer">
              <CardDisplay
                cardId={trade.card_to_buy}
                quantityToBuy={null}
                quantityToSell={null}
              />
            </div>
            <div className="partner">{trade.trade_partner_pseudo}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(Market), {
  ssr: false,
});
