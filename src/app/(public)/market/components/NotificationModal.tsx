import { useState } from "react";
import { createNotification, Trade } from "../market";
import { Bell, X } from "lucide-react";
import { useAuthenticatedUser } from "@/app/(protected)/hooks/useAuthenticatedUser";
import "./NotificationModal.css";

interface NotificationModalProps {
  trade: Trade;
}

export const NotificationModal = ({ trade }: NotificationModalProps) => {
  const user = useAuthenticatedUser();

  const [isOpen, setIsOpen] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openModal = () => {
    setIsOpen(true);
    setNotificationSent(false);
    setErrorMessage(null);
  };

  const sendNotification = async () => {
    try {
        const result = await createNotification(user.email, trade);

        if (result.success) {
            setNotificationSent(true);
            setErrorMessage(null);
        } else {
            setErrorMessage(result.error || "Une erreur est survenue");
        }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setNotificationSent(false);
  };

  return (
    <>
      <button onClick={openModal} className="notification-button">
        <Bell size={20} color="black" />
      </button>

      {
        /* Modal */
        isOpen && (
          <div className="notification-modal-overlay">
            <div
              className="notification-modal-backdrop"
              onClick={closeModal}
            ></div>
            <div className="notification-modal-container">
              <button onClick={closeModal} className="modal-close-button">
                <X size={20} color="black" />
              </button>
              {!notificationSent && !errorMessage ? (
                <>
                  <h3>Confirmation</h3>
                  <p>
                    {" "}
                    Voulez vous envoyer une notification à{" "}
                    {trade.trade_partner_pseudo}{" "}
                  </p>
                  <div className="notification-modal-buttons">
                    <button onClick={closeModal} className="modal-no-button">
                      Non
                    </button>
                    <button
                      onClick={sendNotification}
                      className="modal-yes-button"
                    >
                      Oui
                    </button>
                  </div>
                </>
              ) : errorMessage ? (
                <div className="notification-error-container">
                  <p className="error-message">{errorMessage}</p>
                  <button onClick={closeModal} className="modal-close-button">
                    Fermer
                  </button>
                </div>
              ) : (
                <div className="notification-sent-container">
                  <p>Notification envoyée</p>
                  <button onClick={closeModal} className="modal-close-button">
                    Fermer
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      }
    </>
  );
};
