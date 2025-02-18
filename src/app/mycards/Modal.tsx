type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  quantity: number;
};

export function Modal({ isOpen, onClose, cardName, quantity }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
          maxWidth: "500px",
          margin: "20px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>{cardName}</h2>
        <p>Quantité : {quantity}</p>{" "}
      </div>
    </div>
  );
}
