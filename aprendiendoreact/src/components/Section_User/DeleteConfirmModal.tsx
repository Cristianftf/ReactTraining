import { FiAlertTriangle, FiX } from 'react-icons/fi';
import type { User } from '../../types';
import './deleteConfirmModal.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  user: User | null;
  isDeleting: boolean;
}

export function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  user,
  isDeleting 
}: DeleteConfirmModalProps) {
  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <div className="delete-icon-wrapper">
            <FiAlertTriangle size={32} />
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
            disabled={isDeleting}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="delete-modal-content">
          <h2 className="delete-modal-title">¿Eliminar usuario?</h2>
          <p className="delete-modal-description">
            Estás a punto de eliminar a <strong>{user.name}</strong> ({user.email}).
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="delete-modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-delete-confirm"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner"></span>
                <span>Eliminando...</span>
              </>
            ) : (
              <span>Sí, eliminar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}