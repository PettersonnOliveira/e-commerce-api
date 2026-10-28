import { useState } from 'react'
import '../../styles/admin.css'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminLayout({ user, currentTab, onSelectTab, onBackToStore, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const titles = {
    dashboard: 'Visão Geral do E-commerce',
    products: 'Catálogo de Produtos',
    categories: 'Gerenciamento de Categorias',
    orders: 'Gestão de Pedidos',
  }

  return (
    <div className="admin-wrapper">
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        onBackToStore={onBackToStore}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <AdminHeader
          user={user}
          title={titles[currentTab] || 'Painel Administrativo'}
          onLogout={onLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}
