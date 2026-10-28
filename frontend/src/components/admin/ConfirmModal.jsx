export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', isDanger = false, loading = false }) {
  if (!isOpen) return null

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button type="button" className="admin-modal-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="admin-modal-body">
          <p>{message}</p>
        </div>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn-modal-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={isDanger ? 'admin-btn-modal-danger' : 'admin-btn-modal-primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
