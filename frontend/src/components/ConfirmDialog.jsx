import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, bookTitle, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3>Confirm Delete</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="confirm-dialog-content">
            <div className="confirm-dialog-icon">
              <AlertTriangle size={30} />
            </div>
            <h4 className="confirm-dialog-title">Delete Book Record</h4>
            {bookTitle && (
              <div className="confirm-dialog-book">
                "{bookTitle}"
              </div>
            )}
            <p className="confirm-dialog-msg">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              'Deleting...'
            ) : (
              <>
                <Trash2 size={16} /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

