export default function OrderTable({
  orders,
  searchId,
  onSearchIdChange,
  statusFilter,
  onStatusFilterChange,
  onViewOrder,
}) {
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

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { label: 'Pendente', className: 'status-pending' },
      PAID: { label: 'Pago', className: 'status-paid' },
      SHIPPED: { label: 'Enviado', className: 'status-shipped' },
      CANCELLED: { label: 'Cancelado', className: 'status-cancelled' },
    }
    const current = config[status] || { label: status, className: 'status-default' }
    return <span className={`admin-badge ${current.className}`}>{current.label}</span>
  }

  return (
    <div className="admin-section-block">
      <div className="admin-table-filters">
        <div className="admin-filters-row">
          <div className="admin-search-input-wrap admin-filter-search">
            <span className="admin-search-icon">⌕</span>
            <input
              type="text"
              className="admin-input-search"
              placeholder="Pesquisar por ID (#)..."
              value={searchId}
              onChange={(e) => onSearchIdChange(e.target.value)}
            />
          </div>

          <select
            className="admin-form-input admin-filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="ALL">Todos os status</option>
            <option value="PENDING">Pendentes</option>
            <option value="PAID">Pagos</option>
            <option value="SHIPPED">Enviados</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
        </div>

        <span className="admin-table-counter">
          {orders.length} pedido(s) listado(s)
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty-table">
          <p>Nenhum pedido encontrado para os filtros selecionados.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nº Pedido</th>
                <th>Data</th>
                <th>Qtd. Itens</th>
                <th>Status</th>
                <th>Total</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <span className="admin-order-id">#{ord.id}</span>
                  </td>
                  <td>{formatOrderDate(ord.createdAt)}</td>
                  <td>{ord.items?.length || 0} produto(s)</td>
                  <td>{getStatusBadge(ord.status)}</td>
                  <td>
                    <strong>{formatPrice(ord.total)}</strong>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => onViewOrder(ord.id)}
                    >
                      Ver Detalhes →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
