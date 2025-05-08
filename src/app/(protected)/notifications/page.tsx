"use client";

import { loadNotif } from "./notifs";
import { useEffect, useState } from "react";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { Notice } from "../../types/Notice";
import "./notifs.css";
import dynamic from "next/dynamic";
import { ReplyModal } from "@/app/(public)/market/components/ReplyModal";

function Notifications() {
  const user = useAuthenticatedUser();
  const [receivedNotifs, setReceivedNotifs] = useState<Notice[] | null>([]);
  const [sentNotifs, setSentNotifs] = useState<Notice[] | null>([]);

  useEffect(() => {
    const allNotificationsPromise = loadNotif(user.token);
    allNotificationsPromise.then((notifs) => {
      if (notifs !== null) {
        console.log("Notifications", notifs);
        setReceivedNotifs(
          notifs.filter((notif) => notif.receiver_email === user.email)
        );
        setSentNotifs(
          notifs.filter((notif) => notif.sender_email === user.email)
        );
        console.log("Sent notifications", sentNotifs);
      }
    });
  }, []);

  return (
    <div className="main-content">
      <div className="notifications">
        <span className="notification-title">
          <h1>Notifications</h1>{" "}
        </span>
        <div className="received-notifications">
          <h2>Reçues</h2>
          {receivedNotifs === null ? (
            <p>You have no received notification</p>
          ) : (
            receivedNotifs?.map((notif, index) => (
              <li key={index}>
                {notif.sender_name} donne{" "}
                <span className="notification-card-name">
                  {notif.offered_func_id} - {notif.offered_name}
                </span>{" "}
                contre{" "}
                <span className="notification-card-name">
                  {notif.requested_func_id} - {notif.requested_name}
                </span>
                <button
                  disabled
                  className={
                    notif.status === "REJECTED"
                      ? "rejected"
                      : notif.status === "ACCEPTED"
                      ? "accepted"
                      : "pending"
                  }
                >
                  {notif.status}
                </button>
                {notif.status === "PENDING" && (
                  <ReplyModal trade_request={notif.id} />
                )}
                <span className="notification-date">
                  {new Date(notif.created_at).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))
          )}
        </div>
        <div className="sent-notifications">
          <h2>Envoyées</h2>
          {sentNotifs?.map((notif, index) => (
            <li key={index}>
              Je donne{" "}
              <span className="notification-card-name">
                {notif.offered_func_id} - {notif.offered_name}
              </span>{" "}
              contre{" "}
              <span className="notification-card-name">
                {notif.requested_func_id} - {notif.requested_name}{" "}
              </span>
              <span className="notification-arrow">🠖 </span>
              <span className="notification-friend-name">
                {notif.receiver_name}
              </span>
              <button
                disabled
                className={
                  notif.status === "REJECTED"
                    ? "rejected"
                    : notif.status === "ACCEPTED"
                    ? "accepted"
                    : "pending"
                }
              >
                {notif.status}
              </button>
              <span className="notification-date">
                {new Date(notif.created_at).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Notifications), {
  ssr: false,
});
