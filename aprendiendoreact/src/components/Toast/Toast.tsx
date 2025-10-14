import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import './toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const icons = {
  success: FiCheckCircle,
  error: FiXCircle,
  warning: FiAlertCircle,
  info: FiInfo,
};

export function Toast({ toast, onClose }: ToastProps) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-icon">
        <Icon size={20} />
      </div>
      <p className="toast-message">{toast.message}</p>
      <button
        className="toast-close"
        onClick={() => onClose(toast.id)}
        aria-label="Cerrar notificación"
      >
        <FiX size={18} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}