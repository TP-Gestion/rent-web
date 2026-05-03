import { useEffect } from "react";
import "./Toast.css";

export type ToastVariant = "success" | "error";

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface Props {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

function ToastMessage({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={`toast-item toast-item--${toast.variant}`}>
      <span className="toast-item__icon">
        {toast.variant === "success" ? "✓" : "✕"}
      </span>
      <span className="toast-item__message">{toast.message}</span>
      <button
        className="toast-item__close"
        onClick={() => onDismiss(toast.id)}
        type="button"
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}

export default function Toast({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastMessage key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
