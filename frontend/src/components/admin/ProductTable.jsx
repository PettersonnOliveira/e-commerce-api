export default function ProductTable({ products, onEdit, onDelete, search, onSearchChange }) {
  const formatPrice = (val) =>
    Number(val || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

  return (
    <div className="admin-section-block">
      {/* Barra de Pesquisa e Contador */}
      <div className="admin-table-filters">
        <div className="admin-search-input-wrap">
          <span className="admin-search-icon">⌕</span>
          <input
            type="text"
            className="admin-input-search"
            placeholder="Pesquisar produto pelo nome..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <span className="admin-table-counter">
          {products.length} produto(s) encontrado(s)
        </span>
      </div>

      {products.length === 0 ? (
        <div className="admin-empty-table">
          <p>Nenhum produto corresponde aos critérios de busca.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <span className="admin-order-id">#{prod.id}</span>
                  </td>
                  <td>
                    <strong>{prod.name}</strong>
                    <div className="admin-table-subtext" title={prod.description}>
                      {prod.description}
                    </div>
                  </td>
                  <td>
                    <span className="admin-category-pill">
                      {prod.category?.name || 'Sem categoria'}
                    </span>
                  </td>
                  <td>{formatPrice(prod.price)}</td>
                  <td>
                    <span
                      className={`admin-stock-badge ${
                        prod.stock <= 0 ? 'out' : prod.stock < 5 ? 'low' : 'ok'
                      }`}
                    >
                      {prod.stock} un.
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-actions-group">
                      <button
                        type="button"
                        className="admin-action-btn edit"
                        onClick={() => onEdit(prod)}
                        title="Editar produto"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn delete"
                        onClick={() => onDelete(prod)}
                        title="Excluir produto"
                      >
                        Excluir
                      </button>
                    </div>
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
