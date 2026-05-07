import React from 'react';
import useToastStore from '../store/toastStore';
import './ToastContainer.css';
function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type} animate-slide-down`}>
          <div className="toast-content">
            {toast.type === 'success' ? (
              <div className="toast-icon-success">
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : (
              <span className="toast-icon">⚠️</span>
            )}
            <span className="toast-message">{toast.message}</span>
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
export default ToastContainer;