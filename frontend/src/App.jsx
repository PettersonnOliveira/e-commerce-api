import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Auth from './Auth'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'

import { API_URL } from './services/api'

const productImages = {
  1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700',
  2: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700',
  3: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700',
  4: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',
  5: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700',
  6: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700',
  7: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=700',
  8: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700',
  9: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700',
  10: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700',
  11: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',
  12: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=700',
}

const formatPrice = (price) =>
    Number(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

async function apiRequest(path, options = {}) {
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

function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')

  const [cart, setCart] = useState({
    id: null,
    items: [],
    total: 0,
  })

  const [cartOpen, setCartOpen] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  const [cartActionLoading, setCartActionLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [cartError, setCartError] = useState('')
  const [notice, setNotice] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [page, setPage] = useState('store')
  const [adminTab, setAdminTab] = useState('dashboard')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetailLoading, setOrderDetailLoading] = useState(false)

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null
    } catch {
      return null
    }
  })

  // Fecha o menu mobile ao pressionar Escape.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && navOpen) {
        setNavOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navOpen])

  // Carrega os produtos da API.
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_URL}/products`)

        if (!response.ok) {
          throw new Error(`Erro ao buscar produtos: ${response.status}`)
        }

        const data = await response.json()
        setProducts(data)
      } catch (err) {
        console.error('Erro ao carregar produtos:', err)
        setError(
            'Não foi possível carregar os produtos. Verifique se o backend está funcionando.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Carrega o carrinho sempre que um usuário estiver autenticado.
  useEffect(() => {
    let active = true

    async function loadCart() {
      if (!user || !localStorage.getItem('token')) {
        setCart({ id: null, items: [], total: 0 })
        return
      }

      try {
        setCartLoading(true)
        setCartError('')

        const data = await apiRequest('/cart')

        if (active) {
          setCart(data || { id: null, items: [], total: 0 })
        }
      } catch (err) {
        console.error('Erro ao carregar carrinho:', err)

        if (active) {
          setCartError(err.message || 'Não foi possível carregar o carrinho.')
        }
      } finally {
        if (active) {
          setCartLoading(false)
        }
      }
    }

    loadCart()

    return () => {
      active = false
    }
  }, [user])

  const categories = useMemo(() => {
    const names = products
        .map((product) => product.category?.name)
        .filter(Boolean)

    return ['Todos', ...new Set(names)]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productCategory = product.category?.name || ''

      const matchesCategory =
          category === 'Todos' || productCategory === category

      const matchesSearch = product.name
          .toLowerCase()
          .includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [products, category, search])

  const cartItemCount = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
  )

  function handleLoginSuccess(userData) {
    setUser(userData)
    setPage('store')
    setNotice('Login realizado com sucesso!')
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
    setCart({ id: null, items: [], total: 0 })
    setCartOpen(false)
    setCartError('')
    setNotice('Você saiu da sua conta.')
    setPage('store')
  }

  async function handleAddToCart(product) {
    if (!user) {
      setNotice('Entre na sua conta para adicionar produtos ao carrinho.')
      setPage('auth')
      return
    }

    try {
      setCartActionLoading(true)
      setCartError('')
      setNotice('')

      const data = await apiRequest('/cart/items', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      })

      setCart(data)
      setNotice(`${product.name} adicionado ao carrinho.`)
    } catch (err) {
      console.error('Erro ao adicionar produto:', err)
      setCartError(err.message || 'Não foi possível adicionar o produto.')
    } finally {
      setCartActionLoading(false)
    }
  }

  async function handleUpdateQuantity(item, newQuantity) {
    if (newQuantity < 1) {
      return
    }

    try {
      setCartActionLoading(true)
      setCartError('')

      const data = await apiRequest(`/cart/items/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      })

      setCart(data)
    } catch (err) {
      console.error('Erro ao atualizar quantidade:', err)
      setCartError(err.message || 'Não foi possível atualizar a quantidade.')
    } finally {
      setCartActionLoading(false)
    }
  }

  async function handleRemoveItem(itemId) {
    try {
      setCartActionLoading(true)
      setCartError('')

      const data = await apiRequest(`/cart/items/${itemId}`, {
        method: 'DELETE',
      })

      setCart(data)
    } catch (err) {
      console.error('Erro ao remover item:', err)
      setCartError(err.message || 'Não foi possível remover o produto.')
    } finally {
      setCartActionLoading(false)
    }
  }

  async function handleClearCart() {
    try {
      setCartActionLoading(true)
      setCartError('')

      await apiRequest('/cart', {
        method: 'DELETE',
      })

      setCart({
        ...cart,
        items: [],
        total: 0,
      })

      setNotice('Carrinho esvaziado.')
    } catch (err) {
      console.error('Erro ao esvaziar carrinho:', err)
      setCartError(err.message || 'Não foi possível esvaziar o carrinho.')
    } finally {
      setCartActionLoading(false)
    }
  }

  // Finaliza a compra usando os itens já salvos no carrinho do usuário.
  async function handleCheckout() {
    if (!user || cart.items.length === 0 || checkoutLoading) {
      return
    }

    const purchasedItems = [...cart.items]

    try {
      setCheckoutLoading(true)
      setCartError('')
      setNotice('')

      const order = await apiRequest('/orders/checkout', {
        method: 'POST',
      })

      // Atualiza o estoque mostrado na vitrine com base nos itens comprados.
      setProducts((currentProducts) =>
          currentProducts.map((product) => {
            const purchasedItem = purchasedItems.find(
                (item) => item.productId === product.id
            )

            if (!purchasedItem) {
              return product
            }

            return {
              ...product,
              stock: Math.max(0, product.stock - purchasedItem.quantity),
            }
          })
      )

      setCart({
        id: cart.id,
        items: [],
        total: 0,
      })

      setCartOpen(false)
      setNotice(
          order?.id
              ? `Compra realizada com sucesso! Seu pedido #${order.id} foi criado.`
              : 'Compra realizada com sucesso! Seu pedido foi criado.'
      )
    } catch (err) {
      console.error('Erro ao finalizar compra:', err)
      setCartError(err.message || 'Não foi possível finalizar sua compra.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  async function handleOpenOrders() {
    if (!user) {
      setNotice('Entre na sua conta para consultar seus pedidos.')
      setPage('auth')
      return
    }

    setPage('orders')
    setSelectedOrder(null)
    setOrdersLoading(true)
    setOrdersError('')

    try {
      const data = await apiRequest('/orders')
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err)
      setOrdersError(err.message || 'Não foi possível carregar seus pedidos.')
    } finally {
      setOrdersLoading(false)
    }
  }

  async function handleViewOrder(orderId) {
    setOrderDetailLoading(true)
    setOrdersError('')

    try {
      const data = await apiRequest(`/orders/${orderId}`)
      setSelectedOrder(data)
    } catch (err) {
      console.error('Erro ao carregar detalhes do pedido:', err)
      setOrdersError(err.message || 'Não foi possível carregar os detalhes.')
    } finally {
      setOrderDetailLoading(false)
    }
  }

  function formatOrderDate(value) {
    if (!value) return 'Data não disponível'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('pt-BR')
  }

  function getStatusLabel(status) {
    return ({
      PENDING: 'Pendente',
      PAID: 'Pago',
      SHIPPED: 'Enviado',
      CANCELLED: 'Cancelado',
    })[status] || status || 'Indefinido'
  }

  if (page === 'auth') {
    return (
        <Auth
            onSuccess={handleLoginSuccess}
            onBack={() => {
              setPage('store')
              setNotice('')
            }}
        />
    )
  }

  // Proteção da rota administrativa no frontend:
  // Se o usuário não for ADMIN, redireciona imediatamente para a vitrine
  if (page === 'admin') {
    if (!user || user.role !== 'ADMIN') {
      setPage('store')
      setNotice('Acesso negado: área restrita para administradores.')
      return null
    }

    return (
      <AdminLayout
        user={user}
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onBackToStore={() => setPage('store')}
        onLogout={handleLogout}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard onNavigateTab={setAdminTab} />
        )}

        {adminTab === 'products' && (
          <AdminProducts />
        )}

        {adminTab === 'categories' && (
          <AdminCategories />
        )}

        {adminTab === 'orders' && (
          <AdminOrders />
        )}
      </AdminLayout>
    )
  }

  return (
      <div className="store">
        <div className="announcement">
          FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 299 <span>|</span> 10% OFF NA
          PRIMEIRA COMPRA
        </div>

        <header className="header">
          <button className="nav-toggle" type="button" onClick={() => setNavOpen(prev => !prev)} aria-label="Abrir menu">
            ☰
          </button>
          <a href="#home" className="brand">
            NEXUS<span>STORE.</span>
          </a>

          <nav className={`navigation ${navOpen ? 'open' : ''}`}>
            <a href="#home" onClick={() => setNavOpen(false)}>Início</a>
            <a href="#products" onClick={() => setNavOpen(false)}>Produtos</a>
            <a href="#categories" onClick={() => setNavOpen(false)}>Categorias</a>
            <a href="#footer" onClick={() => setNavOpen(false)}>Sobre</a>
          </nav>

          <div className="header-actions">
            <div className="search-box">
              <span>⌕</span>
              <input
                  placeholder="Buscar produtos..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {user ? (
                <div className="account-actions">
              <span className="account-name">
                Olá, {user.name}
              </span>

                  {user.role === 'ADMIN' && (
                    <button
                      type="button"
                      className="account-button admin-badge-button"
                      style={{
                        backgroundColor: '#f47738',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontWeight: '700',
                        fontSize: '11px',
                        letterSpacing: '0.5px'
                      }}
                      onClick={() => setPage('admin')}
                    >
                      Painel Admin
                    </button>
                  )}

                  <button
                      type="button"
                      className="account-button orders-nav-button"
                      onClick={handleOpenOrders}
                  >
                    Meus pedidos
                  </button>

                  <button
                      type="button"
                      className="account-button"
                      onClick={handleLogout}
                  >
                    Sair
                  </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="account-button"
                    onClick={() => setPage('auth')}
                >
                  Entrar
                </button>
            )}

            <button
                className="cart-button"
                type="button"
                onClick={() => {
                  if (!user) {
                    setNotice('Entre na sua conta para acessar seu carrinho.')
                    setPage('auth')
                    return
                  }

                  setCartOpen(true)
                  setCartError('')
                }}
                aria-label="Abrir carrinho"
            >
              ♡ <span>{cartItemCount}</span>
            </button>
          </div>
        </header>

        {notice && (
            <div className="store-notice">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice('')}>
                ×
              </button>
            </div>
        )}

        <main>
          {page === 'orders' ? (
              <section className="orders-page">
                <div className="orders-heading">
                  <div>
                    <span className="eyebrow">ÁREA DO CLIENTE</span>
                    <h1>{selectedOrder ? `Pedido #${selectedOrder.id}` : 'Meus pedidos'}</h1>
                    <p>Acompanhe suas compras realizadas na NEXUS STORE.</p>
                  </div>
                  <button className="orders-back-button" type="button" onClick={() => {
                    if (selectedOrder) { setSelectedOrder(null); setOrdersError('') }
                    else setPage('store')
                  }}>
                    ← {selectedOrder ? 'Voltar aos pedidos' : 'Voltar à loja'}
                  </button>
                </div>

                {ordersError && <div className="orders-error">{ordersError}</div>}
                {ordersLoading && <div className="orders-empty">Carregando seus pedidos...</div>}
                {orderDetailLoading && <div className="orders-empty">Carregando detalhes do pedido...</div>}

                {!ordersLoading && !selectedOrder && !orderDetailLoading && !ordersError && orders.length === 0 && (
                    <div className="orders-empty">
                      <span>▤</span>
                      <h2>Você ainda não fez nenhum pedido.</h2>
                      <p>Quando finalizar uma compra, ela aparecerá aqui.</p>
                      <button className="orders-back-button" type="button" onClick={() => setPage('store')}>Explorar produtos</button>
                    </div>
                )}

                {!ordersLoading && !selectedOrder && !orderDetailLoading && orders.length > 0 && (
                    <div className="orders-list">
                      {orders.map((order) => (
                          <article className="order-card" key={order.id}>
                            <div className="order-card-main">
                              <div>
                                <span className="order-number">PEDIDO #{order.id}</span>
                                <p>{formatOrderDate(order.createdAt)}</p>
                              </div>
                              <span className={`order-status status-${String(order.status || '').toLowerCase()}`}>{getStatusLabel(order.status)}</span>
                            </div>
                            <div className="order-card-bottom">
                              <span>{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'itens'}</span>
                              <strong>{formatPrice(order.total || 0)}</strong>
                              <button type="button" onClick={() => handleViewOrder(order.id)}>Ver detalhes →</button>
                            </div>
                          </article>
                      ))}
                    </div>
                )}

                {selectedOrder && !orderDetailLoading && (
                    <div className="order-detail">
                      <div className="order-detail-summary">
                        <div><span>Data do pedido</span><strong>{formatOrderDate(selectedOrder.createdAt)}</strong></div>
                        <div><span>Status</span><strong className={`order-status status-${String(selectedOrder.status || '').toLowerCase()}`}>{getStatusLabel(selectedOrder.status)}</strong></div>
                        <div><span>Total</span><strong>{formatPrice(selectedOrder.total || 0)}</strong></div>
                      </div>
                      <h2>Produtos do pedido</h2>
                      {(selectedOrder.items || []).map((item) => (
                          <article className="order-item" key={item.id}>
                            <img src={productImages[item.productId] || 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300'} alt={item.productName} />
                            <div className="order-item-info"><strong>{item.productName}</strong><span>Quantidade: {item.quantity}</span><span>Valor unitário: {formatPrice(item.price)}</span></div>
                            <strong>{formatPrice(Number(item.price) * Number(item.quantity))}</strong>
                          </article>
                      ))}
                      <div className="order-detail-total"><span>Total do pedido</span><strong>{formatPrice(selectedOrder.total || 0)}</strong></div>
                    </div>
                )}
              </section>
          ) : (
              <>
                <section className="hero" id="home">
                  <div className="hero-content">
                    <span className="eyebrow">NOVA COLEÇÃO 2026</span>

                    <h1>
                      Estilo e tecnologia
                      <br />
                      <span>em um só lugar.</span>
                    </h1>

                    <p>
                      Descubra produtos selecionados para transformar sua experiência.
                      Qualidade, inovação e estilo em cada detalhe.
                    </p>

                    <a href="#products" className="primary-button">
                      Explorar produtos <span>→</span>
                    </a>

                    <div className="hero-stats">
                      <div>
                        <strong>+500</strong>
                        <span>Produtos</span>
                      </div>
                      <div>
                        <strong>+2 mil</strong>
                        <span>Clientes</span>
                      </div>
                      <div>
                        <strong>100%</strong>
                        <span>Segurança</span>
                      </div>
                    </div>
                  </div>

                  <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
                        alt="Interior de loja moderna"
                    />

                    <div className="hero-image-label">
                      <span>CURADORIA ESPECIAL</span>
                      <strong>O melhor para você.</strong>
                    </div>
                  </div>
                </section>

                <section className="benefits">
                  {[
                    'Frete grátis|Em compras acima de R$ 299',
                    'Troca facilitada|Até 7 dias após o recebimento',
                    'Pagamento seguro|Seus dados protegidos',
                    'Suporte especializado|Estamos aqui para ajudar',
                  ].map((benefit, index) => {
                    const [title, description] = benefit.split('|')

                    return (
                        <div className="benefit" key={title}>
                <span className="benefit-icon">
                  {['♧', '↺', '♢', '♡'][index]}
                </span>

                          <div>
                            <strong>{title}</strong>
                            <p>{description}</p>
                          </div>
                        </div>
                    )
                  })}
                </section>

                <section className="products-section" id="products">
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">NOSSA SELEÇÃO</span>
                      <h2>
                        Produtos em destaque<span>.</span>
                      </h2>
                      <p>Encontre os produtos ideais para o seu dia a dia.</p>
                    </div>

                    <a href="#products" className="view-all">
                      Ver coleção completa →
                    </a>
                  </div>

                  <div className="categories" id="categories">
                    {categories.map((item) => (
                        <button
                            key={item}
                            className={
                              category === item ? 'category active' : 'category'
                            }
                            onClick={() => setCategory(item)}
                            type="button"
                        >
                          {item}
                        </button>
                    ))}
                  </div>

                  {loading && (
                      <div className="empty-state">
                        <h3>Carregando produtos...</h3>
                        <p>Buscando os produtos da NEXUS STORE.</p>
                      </div>
                  )}

                  {!loading && error && (
                      <div className="empty-state">
                        <h3>Não foi possível carregar a loja.</h3>
                        <p>{error}</p>
                      </div>
                  )}

                  {!loading && !error && (
                      <>
                        <div className="product-grid">
                          {filteredProducts.map((product) => (
                              <article className="product-card" key={product.id}>
                                <div className="product-image">
                                  <img
                                      src={
                                          productImages[product.id] ||
                                          'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=700'
                                      }
                                      alt={product.name}
                                  />

                                  <button
                                      className="favorite-button"
                                      type="button"
                                      aria-label={`Favoritar ${product.name}`}
                                  >
                                    ♡
                                  </button>
                                </div>

                                <div className="product-info">
                      <span className="product-category">
                        {product.category?.name || 'Sem categoria'}
                      </span>

                                  <h3>{product.name}</h3>
                                  <p>{product.description}</p>

                                  <div className="product-prices">
                                    <strong>{formatPrice(product.price)}</strong>
                                  </div>

                                  <p>Estoque: {product.stock}</p>

                                  <button
                                      className="add-button"
                                      type="button"
                                      disabled={product.stock <= 0 || cartActionLoading}
                                      onClick={() => handleAddToCart(product)}
                                  >
                                    {product.stock > 0
                                        ? cartActionLoading
                                            ? 'Aguarde...'
                                            : 'Adicionar ao carrinho'
                                        : 'Indisponível'}
                                    <span>+</span>
                                  </button>
                                </div>
                              </article>
                          ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="empty-state">
                              <h3>Nenhum produto encontrado.</h3>
                              <p>
                                Tente pesquisar por outro nome ou selecionar outra
                                categoria.
                              </p>
                            </div>
                        )}
                      </>
                  )}
                </section>

                <section className="newsletter">
                  <div>
                    <span className="eyebrow">NOVIDADES NEXUS</span>
                    <h2>Fique por dentro das novidades.</h2>
                    <p>Uma seleção especial de ofertas e lançamentos.</p>
                  </div>

                  <a href="#products" className="newsletter-button">
                    Explorar ofertas →
                  </a>
                </section>
              </>
          )}
        </main>

        <footer className="footer" id="footer">
          <div className="footer-main">
            <div>
              <a href="#home" className="brand footer-brand">
                NEXUS<span>STORE.</span>
              </a>
              <p>
                Tecnologia, estilo e qualidade.
                <br />
                Uma experiência de compra diferente.
              </p>
            </div>

            <div>
              <strong>Institucional</strong>
              <a href="#home">Sobre a loja</a>
              <a href="#products">Nossos produtos</a>
            </div>

            <div>
              <strong>Atendimento</strong>
              <a href="#footer">Central de ajuda</a>
              <a href="#footer">Política de privacidade</a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 NEXUS STORE. Todos os direitos reservados.</span>
            <span>Desenvolvido para fins de portfólio.</span>
          </div>

          <div className="footer-dev-signature">
            <div className="dev-signature-content">
              <span className="dev-icon-code">&lt;/&gt;</span>
              <span className="dev-text">Desenvolvido por </span>
              <a
                href="https://github.com/PettersonnOliveira"
                target="_blank"
                rel="noopener noreferrer"
                className="dev-github-link"
              >
                <svg className="dev-github-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>Petterson Oliveira</span>
              </a>
              <span className="dev-text"> com React e Spring Boot.</span>
            </div>
            <div className="dev-tech-badges">
              <span className="tech-badge">React</span>
              <span className="tech-badge">Java</span>
              <span className="tech-badge">Spring Boot</span>
              <span className="tech-badge">API REST</span>
              <span className="tech-badge">MySQL</span>
            </div>
          </div>
        </footer>

        {cartOpen && (
            <div
                className="cart-overlay"
                onClick={() => setCartOpen(false)}
            >
              <aside
                  className="cart-drawer"
                  onClick={(event) => event.stopPropagation()}
              >
                <div className="cart-header">
                  <div>
                    <span className="eyebrow">NEXUS STORE</span>
                    <h2>Meu carrinho</h2>
                  </div>

                  <button
                      type="button"
                      className="cart-close"
                      onClick={() => setCartOpen(false)}
                      aria-label="Fechar carrinho"
                  >
                    ×
                  </button>
                </div>

                {cartError && (
                    <div className="cart-error">
                      {cartError}
                    </div>
                )}

                {cartLoading ? (
                    <div className="cart-empty">
                      <p>Carregando seu carrinho...</p>
                    </div>
                ) : cart.items.length === 0 ? (
                    <div className="cart-empty">
                      <span className="cart-empty-icon">♡</span>
                      <h3>Seu carrinho está vazio.</h3>
                      <p>Explore nossos produtos e escolha seus favoritos.</p>

                      <button
                          type="button"
                          className="cart-continue"
                          onClick={() => setCartOpen(false)}
                      >
                        Continuar comprando
                      </button>
                    </div>
                ) : (
                    <>
                      <div className="cart-items">
                        {cart.items.map((item) => (
                            <article className="cart-item" key={item.id}>
                              <img
                                  src={
                                      productImages[item.productId] ||
                                      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300'
                                  }
                                  alt={item.productName}
                              />

                              <div className="cart-item-info">
                                <h3>{item.productName}</h3>
                                <strong>{formatPrice(item.unitPrice)}</strong>

                                <div className="cart-item-actions">
                                  <div className="quantity-control">
                                    <button
                                        type="button"
                                        disabled={cartActionLoading || checkoutLoading || item.quantity <= 1}
                                        onClick={() =>
                                            handleUpdateQuantity(item, item.quantity - 1)
                                        }
                                    >
                                      −
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        type="button"
                                        disabled={cartActionLoading || checkoutLoading}
                                        onClick={() =>
                                            handleUpdateQuantity(item, item.quantity + 1)
                                        }
                                    >
                                      +
                                    </button>
                                  </div>

                                  <button
                                      type="button"
                                      className="remove-item"
                                      disabled={cartActionLoading || checkoutLoading}
                                      onClick={() => handleRemoveItem(item.id)}
                                  >
                                    Remover
                                  </button>
                                </div>
                              </div>

                              <strong className="cart-item-subtotal">
                                {formatPrice(item.subtotal)}
                              </strong>
                            </article>
                        ))}
                      </div>

                      <div className="cart-summary">
                        <button
                            type="button"
                            className="clear-cart"
                            disabled={cartActionLoading || checkoutLoading}
                            onClick={handleClearCart}
                        >
                          Esvaziar carrinho
                        </button>

                        <div className="cart-total">
                          <span>Total</span>
                          <strong>{formatPrice(cart.total)}</strong>
                        </div>

                        <button
                            type="button"
                            className="checkout-button"
                            onClick={handleCheckout}
                            disabled={cartActionLoading || checkoutLoading || cart.items.length === 0}
                        >
                          {checkoutLoading ? 'Processando compra...' : 'Finalizar compra'}
                        </button>

                        <p className="checkout-note">
                          {checkoutLoading
                              ? 'Estamos confirmando seu pedido. Não feche esta janela.'
                              : 'Compra segura e vinculada à sua conta.'}
                        </p>
                      </div>
                    </>
                )}
              </aside>
            </div>
        )}
      </div>
  )
}

export default App