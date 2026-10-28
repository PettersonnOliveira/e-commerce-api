import { useState } from 'react'

export default function OrderDetails({ order, onClose, onUpdateStatus, loading }) {
  const [selectedStatus, setSelectedStatus] = useState('')
  const [errorNotice, setErrorNotice] = useState('')

  if (!order) return null

  const formatPrice = (val) =>
    Number(val || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

  const formatOrderDate = (value) => {
    if (!value) return 'Data não disponível'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('pt-BR')
  }

  // Transições permitidas rigorosamente segundo as regras do OrderService:
  // - PENDING só pode ir para PAID ou CANCELLED
  // - PAID só pode ir para SHIPPED ou CANCELLED
  // - SHIPPED ou CANCELLED não podem mais ser alterados
  const getAvailableTransitions = (status) => {
    if (status === 'PENDING') {
      return [
        { value: 'PAID', label: 'Marcar como Pago (PAID)' },
        { value: 'CANCELLED', label: 'Cancelar Pedido (CANCELLED - Devolve Estoque)' },
      ]
    }
    if (status === 'PAID') {
      return [
        { value: 'SHIPPED', label: 'Marcar como Enviado (SHIPPED)' },
        { value: 'CANCELLED', label: 'Cancelar Pedido (CANCELLED - Devolve Estoque)' },
      ]
    }
    return []
  }

  const transitions = getAvailableTransitions(order.status)
  const isFinalState = order.status === 'SHIPPED' || order.status === 'CANCELLED'

  function handleStatusSubmit(e) {
    e.preventDefault()
    setErrorNotice('')

    if (!selectedStatus) {
      setErrorNotice('Selecione um novo status para atualizar o pedido.')
      return
    }

    onUpdateStatus(order.id, selectedStatus)
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-card large" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <h3>Detalhes do Pedido #{order.id}</h3>
            <span style={{ fontSize: '11px', color: '#777' }}>
              Realizado em {formatOrderDate(order.createdAt)}
            </span>
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="admin-modal-body">
          {errorNotice && (
            <div className="admin-form-error-alert">{errorNotice}</div>
          )}

          {/* Status Atual e Alteração de Status */}
          <div className="admin-order-status-box">
            <div className="admin-status-info">
              <span className="admin-status-label">Status Atual:</span>
              <span className={`admin-badge status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            {isFinalState ? (
              <p className="admin-status-note">
                {order.status === 'SHIPPED'
                  ? 'Este pedido foi enviado e não aceita mais alterações.'
                  : 'Este pedido foi cancelado e o estoque foi restaurado.'}
              </p>
            ) : (
              <form onSubmit={handleStatusSubmit} className="admin-status-update-form">
                <select
                  className="admin-form-input"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  disabled={loading}
                >
                  <option value="">-- Alterar status para... --</option>
                  {transitions.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="admin-btn-modal-primary"
                  disabled={loading || !selectedStatus}
                >
                  {loading ? 'Atualizando...' : 'Atualizar Status'}
                </button>
              </form>
            )}
          </div>

          {/* Lista de Itens do Pedido */}
          <div className="admin-order-items-wrapper">
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '800' }}>
              Itens Comprados ({order.items?.length || 0})
            </h4>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço Unitário</th>
                    <th>Qtd.</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item) => {
                    const subtotal = (item.price || 0) * (item.quantity || 0)
                    return (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.productName || `Produto #${item.productId}`}</strong>
                        </td>
                        <td>{formatPrice(item.price)}</td>
                        <td>{item.quantity} un.</td>
                        <td style={{ textAlign: 'right' }}>
                          <strong>{formatPrice(subtotal)}</strong>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="admin-order-total-bar">
              <span>Valor Total do Pedido:</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn-modal-cancel"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
