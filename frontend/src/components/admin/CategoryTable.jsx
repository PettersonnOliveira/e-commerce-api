export default function CategoryTable({ categories, onEdit, onDelete, search, onSearchChange }) {
  return (
    <div className="admin-section-block">
      <div className="admin-table-filters">
        <div className="admin-search-input-wrap">
          <span className="admin-search-icon">⌕</span>
          <input
            type="text"
            className="admin-input-search"
            placeholder="Pesquisar categoria..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <span className="admin-table-counter">
          {categories.length} categoria(s) encontrada(s)
        </span>
      </div>

      {categories.length === 0 ? (
        <div className="admin-empty-table">
          <p>Nenhuma categoria encontrada.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>ID</th>
                <th>Nome da Categoria</th>
                <th style={{ textAlign: 'right', width: '180px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <span className="admin-order-id">#{cat.id}</span>
                  </td>
                  <td>
                    <strong>{cat.name}</strong>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-actions-group">
                      <button
                        type="button"
                        className="admin-action-btn edit"
                        onClick={() => onEdit(cat)}
                        title="Editar categoria"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn delete"
                        onClick={() => onDelete(cat)}
                        title="Excluir categoria"
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
