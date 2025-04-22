import { Reply, X } from "lucide-react";
import { useState } from "react";
import "./ReplyModal.css";
import { processAnswer } from "@/app/(protected)/notifications/profile";

interface ReplyModalProps {
  trade_request: number;
}

export const ReplyModal = (props: ReplyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [answerSent, setAnswerSent] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setAnswerSent(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    setAnswerSent(false);
  };

  const sendAnswer = async (answer: "ACCEPT" | "REJECT") => {
    try {
      await processAnswer(props.trade_request, answer);
      setAnswerSent(true);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <>
      <Reply onClick={openModal} className="reply-arrow" />
      {
        /* Modal */
        isOpen && (
          <div className="reply-modal-overlay">
            <div className="reply-modal-backdrop" onClick={closeModal}></div>
            <div className="reply-modal-container">
              <button onClick={closeModal} className="reply-close-button">
                <X size={20} color="black" />
              </button>
              {!answerSent ? (
                <>
                  <h2>Do you accept the trade?</h2>
                  <div className="reply-modal-buttons">
                    <div className="reply-accept-button">
                      <button onClick={() => sendAnswer("ACCEPT")}>
                        Accept
                      </button>
                    </div>
                    <div className="reply-reject-button">
                      <button onClick={() => sendAnswer("REJECT")}>
                        Reject
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="reply-modal-sent">
                  <p>Trade request answered</p>
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
