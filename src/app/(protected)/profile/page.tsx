"use client";

import { loadNotif } from "./profile";
import { useEffect, useState } from "react";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { Notice } from "../../types/Notice";
import "./profile.css";

export default function ProfilePage() {
  const user = useAuthenticatedUser();
  const [allNotifs, setAllNotifs] = useState<Notice[] | null>([]);

  useEffect(() => {
    const notificationsPromise = loadNotif(user.email);
    notificationsPromise.then((notifs) => {
      if (notifs !== null) {
        console.log("Notifications", notifs);
        setAllNotifs(notifs);
      }
    });
  }, []);

  return (
    <div className="main-content">
      <p>⚠️ Page inutile pour le moment ⚠️</p>
      <h2>Notifications</h2>
      <div className="notifications">
        {allNotifs === null ? (
          <p>You have no notification</p>
        ) : (
          allNotifs?.map((notif, index) => (
            <li key={index}>
              {notif.sender_name} wants to trade {" "}
              <span className="notification-card-name">{notif.offered_func_id} - {notif.offered_name}</span>  
              {" "}for{" "}
              <span className="notification-card-name">{notif.requested_func_id} - {notif.requested_name}</span>
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
          ))
        )}
      </div>
    </div>
  );
}

