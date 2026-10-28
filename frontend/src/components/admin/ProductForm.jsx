import { useState, useEffect } from 'react'

export default function ProductForm({ isOpen, onClose, onSave, productToEdit, categories, loading }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [formError, setFormError] = useState('')

  const isEditing = Boolean(productToEdit)

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '')
      setDescription(productToEdit.description || '')
      setPrice(String(productToEdit.price ?? ''))
      setStock(String(productToEdit.stock ?? ''))
      setCategoryId(String(productToEdit.category?.id || ''))
    } else {
      setName('')
      setDescription('')
      setPrice('')
      setStock('')
      setCategoryId(categories.length > 0 ? String(categories[0].id) : '')
    }
    setFormError('')
  }, [productToEdit, isOpen, categories])

  if (!isOpen) return null

  function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    if (!name.trim()) {
      setFormError('O nome do produto é obrigatório.')
      return
    }
    if (!description.trim()) {
      setFormError('A descrição do produto é obrigatória.')
      return
    }
    if (price === '' || Number(price) < 0) {
      setFormError('Informe um preço válido (não pode ser negativo).')
      return
    }
    if (stock === '' || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      setFormError('Informe uma quantidade de estoque válida inteira.')
      return
    }
    if (!categoryId) {
      setFormError('Selecione uma categoria para o produto.')
      return
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      categoryId: Number(categoryId),
    })
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-card large" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{isEditing ? `Editar Produto #${productToEdit.id}` : 'Novo Produto'}</h3>
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
              <label htmlFor="prod-name">Nome do Produto *</label>
              <input
                id="prod-name"
                type="text"
                className="admin-form-input"
                placeholder="Ex: Smartphone Samsung Galaxy S24"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="prod-desc">Descrição Detalhada *</label>
              <textarea
                id="prod-desc"
                className="admin-form-input"
                rows="3"
                placeholder="Descreva as especificações e características do produto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="prod-price">Preço (R$) *</label>
                <input
                  id="prod-price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="admin-form-input"
                  placeholder="0,00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="prod-stock">Estoque Disponível *</label>
                <input
                  id="prod-stock"
                  type="number"
                  min="0"
                  step="1"
                  className="admin-form-input"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="prod-category">Categoria *</label>
              <select
                id="prod-category"
                className="admin-form-input"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={loading || categories.length === 0}
              >
                {categories.length === 0 ? (
                  <option value="">Nenhuma categoria cadastrada</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
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
              {loading ? 'Salvando...' : isEditing ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
