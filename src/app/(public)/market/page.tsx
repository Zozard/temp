"use client";

import dynamic from "next/dynamic";
import { Trade, loadMyMatches } from "./market";
import { useEffect, useState } from "react";
import { CardDisplay } from "@/app/(protected)/mycards/CardDisplay";
import { useAuthenticatedUser } from "@/app/(protected)/hooks/useAuthenticatedUser";
import "./market.css";
import { saveCardState } from "@/app/(protected)/mycards/mycards";
import { NotificationModal } from "./components/NotificationModal";
import { loadMyGroups } from "@/app/(protected)/groups/groups";
import { Group } from "@/app/types/Group";

// variable dégoutante pour palier le fait que ça marchait pas avec le useState
let lastTradePromise: Promise<Trade[]> | null = null;

function Market() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const user = useAuthenticatedUser();
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [groupFilter, setGroupFilter] = useState<number[]>([]);


  useEffect(() => {
    const localTradesPromise = loadMyMatches(user.token, groupFilter.length === 0 ? null : groupFilter);
    // grâce à lastTradePromise on s'assure que le code sous le if ne s'exécute que si on est dans le cas de la dernière promesse envoyée 
    lastTradePromise = localTradesPromise;
    localTradesPromise.then((trades) => {
      if (localTradesPromise !== lastTradePromise) {
        return;
      }
      setTrades(trades);
    });
    console.log(trades);
  }, [user, refreshCounter, groupFilter]);

  useEffect(() => {
    const allGroupsPromise = loadMyGroups(user.token);
    allGroupsPromise.then((groups) => {
      if (groups !== null) {
        console.log("Groups", groups);
        setAllGroups(groups);
      }
    });
  }, [user]);

  const handleCancelTrade = async (token: string, card_id: string) => {
    try {
      await saveCardState(token, { [card_id]: null });
      setRefreshCounter((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving card state:", error);
    }
  };

  const toggleGroupFilter = (groupId: number) => () => {
    if (groupFilter.includes(groupId)) {
      setGroupFilter((prev) => prev.filter((id) => id !== groupId));
    } else {
      setGroupFilter((prev) => [...prev, groupId]);
    }
    console.log("Group filter", groupFilter);
  };

  return (
    <>
      <h1> Possible trades</h1>
      <div className="group-selector">
        {allGroups.length === 0 ? (
          <p>Vous ne faites partie d’aucun groupe.</p>
        ) : (
          allGroups.map((group, index) => (
            <button
              key={index}
              className={`toggle-button-group ${
                groupFilter.includes(group.id) ? "active" : ""
              }`}
              onClick={toggleGroupFilter(group.id)}
            >
              {group.name}
            </button>
          ))
        )}
      </div>
      <div className="market">
        {trades.length === 0 ? (
          <p>
            {" "}
            Si vous avez des matchs pour faire des échanges, ils apparaitront
            ici.
            <br />
            <br />
            Pour l&apos;instant, vous n&apos;en avez pas. Avez-vous bien rempli
            la page MyCards ?{" "}
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
                      handleCancelTrade(user.token, trade.card_to_sell_id)
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
                      handleCancelTrade(user.token, trade.card_to_buy_id)
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
              <div className="partner">
                {trade.trade_partner_pseudo} gives me
              </div>
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
