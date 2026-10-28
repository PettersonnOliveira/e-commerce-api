import { useState, useEffect, useMemo } from 'react'
import { adminService } from '../../services/adminService'
import ProductTable from '../../components/admin/ProductTable'
import ProductForm from '../../components/admin/ProductForm'
import ConfirmModal from '../../components/admin/ConfirmModal'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [successNotice, setSuccessNotice] = useState('')
  const [search, setSearch] = useState('')

  // Modais
  const [formOpen, setFormOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  // Carrega produtos e categorias em paralelo
  async function loadData() {
    try {
      setLoading(true)
      setError('')
      const [prodsData, catsData] = await Promise.all([
        adminService.getProducts(),
        adminService.getCategories(),
      ])
      setProducts(Array.isArray(prodsData) ? prodsData : [])
      setCategories(Array.isArray(catsData) ? catsData : [])
    } catch (err) {
      console.error('Erro ao carregar produtos/categorias:', err)
      setError(err.message || 'Não foi possível carregar os produtos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filtro de busca por nome
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [products, search])

  // Abertura do formulário para criação
  function handleOpenCreate() {
    setProductToEdit(null)
    setFormOpen(true)
  }

  // Abertura do formulário para edição
  function handleOpenEdit(product) {
    setProductToEdit(product)
    setFormOpen(true)
  }

  // Salvar produto (criação ou edição)
  async function handleSaveProduct(formData) {
    try {
      setActionLoading(true)
      setError('')
      setSuccessNotice('')

      if (productToEdit) {
        // PUT /products/{id}
        const updated = await adminService.updateProduct(productToEdit.id, formData)
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        )
        setSuccessNotice(`Produto "${updated.name}" atualizado com sucesso!`)
      } else {
        // POST /products
        const created = await adminService.createProduct(formData)
        setProducts((prev) => [created, ...prev])
        setSuccessNotice(`Produto "${created.name}" cadastrado com sucesso!`)
      }

      setFormOpen(false)
      setProductToEdit(null)
    } catch (err) {
      console.error('Erro ao salvar produto:', err)
      setError(err.message || 'Erro ao processar a operação no produto.')
    } finally {
      setActionLoading(false)
    }
  }

  // Abertura do modal de confirmação de exclusão
  function handleOpenDelete(product) {
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  // Confirmação de exclusão
  async function handleConfirmDelete() {
    if (!productToDelete) return

    try {
      setActionLoading(true)
      setError('')
      setSuccessNotice('')

      await adminService.deleteProduct(productToDelete.id)

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      setSuccessNotice(`Produto "${productToDelete.name}" excluído com sucesso!`)
      setDeleteModalOpen(false)
      setProductToDelete(null)
    } catch (err) {
      console.error('Erro ao excluir produto:', err)
      setError(
        err.message ||
        'Não foi possível excluir o produto. Verifique se ele não possui pedidos vinculados.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="admin-page-container">
      {/* Cabeçalho da página */}
      <div className="admin-page-header">
        <div>
          <h2>Gerenciamento de Produtos</h2>
          <p className="admin-page-description">
            Cadastre, edite especificações, altere preços e gerencie o estoque da loja.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleOpenCreate}
        >
          <span>+</span> Novo Produto
        </button>
      </div>

      {/* Avisos de Sucesso ou Erro */}
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

      {/* Tabela de Produtos */}
      {loading ? (
        <div className="admin-loading-state">
          <div className="admin-spinner"></div>
          <p>Carregando produtos...</p>
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          search={search}
          onSearchChange={setSearch}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Modal de Formulário */}
      <ProductForm
        isOpen={formOpen}
        onClose={() => {
          if (!actionLoading) {
            setFormOpen(false)
            setProductToEdit(null)
          }
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories}
        loading={actionLoading}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Confirmar Exclusão de Produto"
        message={
          productToDelete
            ? `Tem certeza que deseja excluir o produto "${productToDelete.name}" (ID #${productToDelete.id})? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmText="Sim, excluir produto"
        isDanger
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!actionLoading) {
            setDeleteModalOpen(false)
            setProductToDelete(null)
          }
        }}
      />
    </div>
  )
}
