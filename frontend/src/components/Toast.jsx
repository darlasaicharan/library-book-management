import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`toast ${
              isSuccess ? 'toast-success' : isError ? 'toast-error' : 'toast-info'
            }`}
          >
            {isSuccess && <CheckCircle2 size={18} style={{ flexShrink: 0 }} />}
            {isError && <AlertCircle size={18} style={{ flexShrink: 0 }} />}
            {!isSuccess && !isError && <Info size={18} style={{ flexShrink: 0 }} />}
            <span>{toast.message}</span>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;

