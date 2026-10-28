import { API_URL } from './api'

/**
 * Função utilitária padrão para requisições autenticadas.
 * Reutiliza exatamente o mesmo padrão de headers e token JWT já estabelecido no projeto.
 */
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) {
    return null
  }

  const responseText = await response.text()
  let data = null

  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      responseText ||
      `Erro na requisição: ${response.status}`
    )
  }

  return data
}

export const adminService = {
  // Produtos
  getProducts: () => apiRequest('/products'),
  createProduct: (productData) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),
  updateProduct: (id, productData) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),
  deleteProduct: (id) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Categorias
  getCategories: () => apiRequest('/categories'),
  createCategory: (categoryData) =>
    apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),
  updateCategory: (id, categoryData) =>
    apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }),
  deleteCategory: (id) =>
    apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // Pedidos
  getOrders: () => apiRequest('/orders'),
  getOrderById: (id) => apiRequest(`/orders/${id}`),
  updateOrderStatus: (id, status) =>
    apiRequest(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  deleteOrder: (id) =>
    apiRequest(`/orders/${id}`, {
      method: 'DELETE',
    }),
}
