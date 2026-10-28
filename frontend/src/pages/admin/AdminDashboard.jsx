import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import StatCard from '../../components/admin/StatCard'

export default function AdminDashboard({ onNavigateTab }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
    recentOrders: [],
  })

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        setError('')

        // Busca simultaneamente produtos e pedidos reais do backend
        const [productsData, ordersData] = await Promise.all([
          adminService.getProducts(),
          adminService.getOrders(),
        ])

        const products = Array.isArray(productsData) ? productsData : []
        const orders = Array.isArray(ordersData) ? ordersData : []

        // Total de pedidos pendentes
        const pending = orders.filter((o) => o.status === 'PENDING').length

        // Total de vendas confirmadas: somente PAID e SHIPPED (exclui PENDING e CANCELLED)
        const sales = orders
          .filter((o) => o.status === 'PAID' || o.status === 'SHIPPED')
          .reduce((acc, order) => acc + (order.total || 0), 0)

        // Pedidos recentes (últimos 5)
        const sortedOrders = [...orders].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime()
          const dateB = new Date(b.createdAt || 0).getTime()
          return dateB - dateA
        })
        const recent = sortedOrders.slice(0, 5)

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrders: pending,
          totalSales: sales,
          recentOrders: recent,
        })
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err)
        setError(err.message || 'Não foi possível carregar os dados do dashboard.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

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

  if (loading) {
    return (
      <div className="admin-loading-state">
        <div className="admin-spinner"></div>
        <p>Carregando indicadores em tempo real...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-error-box">
        <strong>Erro ao carregar dados:</strong> {error}
      </div>
    )
  }

  return (
    <div className="admin-dashboard-container">
      {/* Grid de Cards de Estatísticas */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total de Vendas"
          value={formatPrice(stats.totalSales)}
          icon="💰"
          description="Pedidos pagos e enviados"
          highlight
        />

        <StatCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon="📑"
          description="Todos os pedidos da loja"
        />

        <StatCard
          title="Pedidos Pendentes"
          value={stats.pendingOrders}
          icon="⏳"
          description="Aguardando confirmação de pagamento"
        />

        <StatCard
          title="Produtos Ativos"
          value={stats.totalProducts}
          icon="📦"
          description="Produtos cadastrados no catálogo"
        />
      </div>

      {/* Atalhos Rápidos */}
      <div className="admin-section-block">
        <div className="admin-section-header">
          <h2>Atalhos Rápidos</h2>
        </div>
        <div className="admin-shortcuts-grid">
          <button
            type="button"
            className="admin-shortcut-card"
            onClick={() => onNavigateTab('products')}
          >
            <span className="admin-shortcut-icon">📦</span>
            <div>
              <strong>Gerenciar Produtos</strong>
              <p>Cadastrar, editar preços e alterar estoques</p>
            </div>
          </button>

          <button
            type="button"
            className="admin-shortcut-card"
            onClick={() => onNavigateTab('categories')}
          >
            <span className="admin-shortcut-icon">🏷️</span>
            <div>
              <strong>Gerenciar Categorias</strong>
              <p>Organizar os departamentos da loja</p>
            </div>
          </button>

          <button
            type="button"
            className="admin-shortcut-card"
            onClick={() => onNavigateTab('orders')}
          >
            <span className="admin-shortcut-icon">📑</span>
            <div>
              <strong>Gerenciar Pedidos</strong>
              <p>Consultar pedidos e atualizar status de envio</p>
            </div>
          </button>
        </div>
      </div>

      {/* Tabela de Pedidos Recentes */}
      <div className="admin-section-block">
        <div className="admin-section-header">
          <div>
            <h2>Pedidos Recentes</h2>
            <p className="admin-section-subtitle">Últimas transações realizadas no e-commerce</p>
          </div>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => onNavigateTab('orders')}
          >
            Ver todos os pedidos →
          </button>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="admin-empty-table">
            <p>Nenhum pedido realizado até o momento.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nº Pedido</th>
                  <th>Data</th>
                  <th>Itens</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="admin-order-id">#{order.id}</span>
                    </td>
                    <td>{formatOrderDate(order.createdAt)}</td>
                    <td>{order.items?.length || 0} produto(s)</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <strong>{formatPrice(order.total)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
