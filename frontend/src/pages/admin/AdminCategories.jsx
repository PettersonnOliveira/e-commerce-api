import { useState, useEffect, useMemo } from 'react'
import { adminService } from '../../services/adminService'
import CategoryTable from '../../components/admin/CategoryTable'
import CategoryForm from '../../components/admin/CategoryForm'
import ConfirmModal from '../../components/admin/ConfirmModal'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [successNotice, setSuccessNotice] = useState('')
  const [search, setSearch] = useState('')

  // Modais
  const [formOpen, setFormOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  async function loadCategories() {
    try {
      setLoading(true)
      setError('')
      const data = await adminService.getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erro ao carregar categorias:', err)
      setError(err.message || 'Não foi possível carregar as categorias.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [categories, search])

  function handleOpenCreate() {
    setCategoryToEdit(null)
    setFormOpen(true)
  }

  function handleOpenEdit(category) {
    setCategoryToEdit(category)
    setFormOpen(true)
  }

  async function handleSaveCategory(formData) {
    try {
      setActionLoading(true)
      setError('')
      setSuccessNotice('')

      if (categoryToEdit) {
        // PUT /categories/{id}
        const updated = await adminService.updateCategory(categoryToEdit.id, formData)
        setCategories((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        )
        setSuccessNotice(`Categoria "${updated.name}" atualizada com sucesso!`)
      } else {
        // POST /categories
        const created = await adminService.createCategory(formData)
        setCategories((prev) => [...prev, created])
        setSuccessNotice(`Categoria "${created.name}" cadastrada com sucesso!`)
      }

      setFormOpen(false)
      setCategoryToEdit(null)
    } catch (err) {
      console.error('Erro ao salvar categoria:', err)
      setError(err.message || 'Erro ao processar a operação na categoria.')
    } finally {
      setActionLoading(false)
    }
  }

  function handleOpenDelete(category) {
    setCategoryToDelete(category)
    setDeleteModalOpen(true)
  }

  async function handleConfirmDelete() {
    if (!categoryToDelete) return

    try {
      setActionLoading(true)
      setError('')
      setSuccessNotice('')

      await adminService.deleteCategory(categoryToDelete.id)

      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id))
      setSuccessNotice(`Categoria "${categoryToDelete.name}" excluída com sucesso!`)
      setDeleteModalOpen(false)
      setCategoryToDelete(null)
    } catch (err) {
      console.error('Erro ao excluir categoria:', err)
      setError(
        'Não foi possível excluir esta categoria. Ela possui produtos vinculados a ela no banco de dados.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2>Gerenciamento de Categorias</h2>
          <p className="admin-page-description">
            Organize as divisões e departamentos de produtos da NEXUS STORE.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleOpenCreate}
        >
          <span>+</span> Nova Categoria
        </button>
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
          <p>Carregando categorias...</p>
        </div>
      ) : (
        <CategoryTable
          categories={filteredCategories}
          search={search}
          onSearchChange={setSearch}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      <CategoryForm
        isOpen={formOpen}
        onClose={() => {
          if (!actionLoading) {
            setFormOpen(false)
            setCategoryToEdit(null)
          }
        }}
        onSave={handleSaveCategory}
        categoryToEdit={categoryToEdit}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Confirmar Exclusão de Categoria"
        message={
          categoryToDelete
            ? `Tem certeza que deseja excluir a categoria "${categoryToDelete.name}" (ID #${categoryToDelete.id})? Se houver produtos associados, o banco de dados rejeitará a operação.`
            : ''
        }
        confirmText="Sim, excluir categoria"
        isDanger
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!actionLoading) {
            setDeleteModalOpen(false)
            setCategoryToDelete(null)
          }
        }}
      />
    </div>
  )
}
