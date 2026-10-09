import toast from "react-hot-toast";

// variant: "danger" (red, for deletes) or "primary" (orange, for normal actions)
export const confirmToast = (message, onConfirm, options = {}) => {
  const {
    confirmText = "Yes",
    cancelText = "No",
    variant = "danger",
  } = options;

  const confirmColor = variant === "danger" ? "#ef4444" : "#f97316";

  toast.custom(
    (t) => (
      <div
        style={{
          background: "#ffffff",
          color: "#1f2937",
          padding: "16px 20px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          minWidth: "280px",
          maxWidth: "340px",
          opacity: t.visible ? 1 : 0,
          transition: "opacity 0.2s",
          border: "1px solid #e5e7eb",
        }}
      >
        <p style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: 500 }}>
          {message}
        </p>
        <div
          style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
        >
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#f3f4f6",
              color: "#374151",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: confirmColor,
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    ),
    { duration: Infinity, position: "top-center" },
  );
};
