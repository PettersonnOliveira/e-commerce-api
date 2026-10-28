import { useState, useEffect } from 'react'

export default function CategoryForm({ isOpen, onClose, onSave, categoryToEdit, loading }) {
  const [name, setName] = useState('')
  const [formError, setFormError] = useState('')

  const isEditing = Boolean(categoryToEdit)

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '')
    } else {
      setName('')
    }
    setFormError('')
  }, [categoryToEdit, isOpen])

  if (!isOpen) return null

  function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    if (!name.trim()) {
      setFormError('O nome da categoria é obrigatório.')
      return
    }

    onSave({ name: name.trim() })
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{isEditing ? `Editar Categoria #${categoryToEdit.id}` : 'Nova Categoria'}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {formError && (
              <div className="admin-form-error-alert">
                {formError}
              </div>
            )}

            <div className="admin-form-group">
              <label htmlFor="cat-name">Nome da Categoria *</label>
              <input
                id="cat-name"
                type="text"
                className="admin-form-input"
                placeholder="Ex: Hardware, Periféricos, Acessórios"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn-modal-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="admin-btn-modal-primary"
              disabled={loading}
            >
              {loading ? 'Salvando...' : isEditing ? 'Atualizar Categoria' : 'Cadastrar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
