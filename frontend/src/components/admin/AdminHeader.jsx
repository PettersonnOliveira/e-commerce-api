export default function AdminHeader({ user, title, onLogout, onToggleSidebar }) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A'

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          type="button"
          className="admin-mobile-toggle"
          onClick={onToggleSidebar}
          aria-label="Abrir menu"
        >
          ☰
        </button>
        <div className="admin-header-title">
          <h1>{title}</h1>
        </div>
      </div>

      <div className="admin-header-user">
        <div className="admin-user-profile">
          <div className="admin-user-avatar">{initial}</div>
          <div className="admin-user-meta">
            <span className="admin-user-name">{user?.name || 'Administrador'}</span>
            <span className="admin-user-role">Acesso Geral</span>
          </div>
        </div>

        <button
          type="button"
          className="admin-btn-logout"
          onClick={onLogout}
        >
          Sair
        </button>
      </div>
    </header>
  )
}
