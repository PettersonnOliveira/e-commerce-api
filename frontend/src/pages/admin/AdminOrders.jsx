import { useState, useEffect, useMemo } from 'react'
import { adminService } from '../../services/adminService'
import OrderTable from '../../components/admin/OrderTable'
import OrderDetails from '../../components/admin/OrderDetails'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [successNotice, setSuccessNotice] = useState('')

  // Filtros
  const [searchId, setSearchId] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Modal de Detalhes
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  async function loadOrders() {
    try {
      setLoading(true)
      setError('')
      const data = await adminService.getOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err)
      setError(err.message || 'Não foi possível carregar os pedidos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // Filtragem composta: por ID e por Status
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesId = searchId.trim()
        ? String(order.id).includes(searchId.trim().replace('#', ''))
        : true

      const matchesStatus =
        statusFilter === 'ALL' ? true : order.status === statusFilter

      return matchesId && matchesStatus
    })
  }, [orders, searchId, statusFilter])

  // Abrir detalhes de um pedido
  async function handleViewOrder(orderId) {
    try {
      setActionLoading(true)
      setError('')
      const order = await adminService.getOrderById(orderId)
      setSelectedOrder(order)
      setDetailsOpen(true)
    } catch (err) {
      console.error('Erro ao carregar detalhes do pedido:', err)
      setError(err.message || 'Erro ao carregar dados do pedido.')
    } finally {
      setActionLoading(false)
    }
  }

  // Atualizar status do pedido
  async function handleUpdateStatus(orderId, newStatus) {
    try {
      setActionLoading(true)
      setError('')
      setSuccessNotice('')

      const updated = await adminService.updateOrderStatus(orderId, newStatus)

      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o))
      )
      setSelectedOrder(updated)
      setSuccessNotice(`Status do pedido #${updated.id} atualizado para ${updated.status}!`)
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      setError(err.message || 'Não foi possível atualizar o status do pedido.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2>Gestão de Pedidos</h2>
          <p className="admin-page-description">
            Acompanhe todas as compras da loja, visualize produtos adquiridos e gerencie o fluxo de entrega.
          </p>
        </div>
      </div>

      {successNotice && (
        <div className="admin-alert-success">
          <span>✓ {successNotice}</span>
          <button type="button" onClick={() => setSuccessNotice('')}>
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="admin-error-box">
          <strong>Atenção:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="admin-loading-state">
          <div className="admin-spinner"></div>
          <p>Carregando pedidos...</p>
        </div>
      ) : (
        <OrderTable
          orders={filteredOrders}
          searchId={searchId}
          onSearchIdChange={setSearchId}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onViewOrder={handleViewOrder}
        />
      )}

      {detailsOpen && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => {
            setDetailsOpen(false)
            setSelectedOrder(null)
          }}
          onUpdateStatus={handleUpdateStatus}
          loading={actionLoading}
        />
      )}
    </div>
  )
}
