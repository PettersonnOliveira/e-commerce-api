export default function AdminSidebar({ currentTab, onSelectTab, onBackToStore, isOpen, onCloseMobile }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Produtos', icon: '📦' },
    { id: 'categories', label: 'Categorias', icon: '🏷️' },
    { id: 'orders', label: 'Pedidos', icon: '📑' },
  ]

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-brand">
          NEXUS<span>STORE</span>
          <span className="admin-brand-badge">ADMIN</span>
        </div>
      </div>

      <nav className="admin-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`admin-nav-item ${currentTab === item.id ? 'active' : ''}`}
            onClick={() => {
              onSelectTab(item.id)
              if (onCloseMobile) onCloseMobile()
            }}
          >
            <span className="admin-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="admin-btn-back"
          onClick={onBackToStore}
        >
          <span>←</span>
          <span>Voltar à Loja</span>
        </button>
      </div>
    </aside>
  )
}
