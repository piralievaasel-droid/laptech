import { Product, User, Order } from './types'

const API_BASE = '/api'
const SESSION_KEY = 'laptech-session'

// Встроенные тестовые данные для GitHub Pages (когда API недоступен)
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    brand: 'ASUS',
    title: 'ASUS ROG Strix G16',
    description: 'Игровой ноутбук на Intel Core i9, RTX 4070 и 16" QHD для сложных задач.',
    price: 679990,
    stock: 5,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60',
    cpu: 'Intel Core i9-13900HX',
    ram: '32 ГБ DDR5',
    storage: '1 ТБ NVMe SSD',
    gpu: 'NVIDIA RTX 4070',
    display_size: '16" QHD (2560x1600), 165Hz',
  },
  {
    id: '2',
    brand: 'Apple',
    title: 'MacBook Pro 14',
    description: 'Профессиональная станция на Apple M3 Pro с 14" Liquid Retina и сверхбыстрой памятью.',
    price: 549990,
    stock: 3,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60',
    cpu: 'Apple M3 Pro',
    ram: '16 ГБ',
    storage: '512 ГБ SSD',
    gpu: '10-core GPU',
    display_size: '14" Liquid Retina XDR',
  },
  {
    id: '3',
    brand: 'Lenovo',
    title: 'ThinkPad X1 Carbon',
    description: 'Бизнес-ноутбук нового поколения с Intel Core i7, 16 часов автономности.',
    price: 289990,
    stock: 7,
    featured: false,
    image_url: 'https://images.unsplash.com/photo-1588872657840-790ff3d952df?auto=format&fit=crop&w=500&q=60',
    cpu: 'Intel Core i7-1365U',
    ram: '16 ГБ LPDDR5',
    storage: '512 ГБ SSD',
    gpu: 'Intel Iris Xe',
    display_size: '14" IPS WUXGA (1920x1200)',
  },
  {
    id: '4',
    brand: 'Dell',
    title: 'XPS 13 Plus',
    description: 'Ультратонкий премиум-ноутбук с OLED экраном и инновационным дизайном.',
    price: 349990,
    stock: 4,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=60',
    cpu: 'Intel Core Ultra 5',
    ram: '16 ГБ LPDDR5X',
    storage: '512 ГБ SSD',
    gpu: 'Intel Arc',
    display_size: '13.3" OLED (1920x1200)',
  },
  {
    id: '5',
    brand: 'HP',
    title: 'Pavilion 16',
    description: 'Мощный ноутбук для контента и гейминга с RTX 4050 по доступной цене.',
    price: 199990,
    stock: 6,
    featured: false,
    image_url: 'https://images.unsplash.com/photo-1588872657840-790ff3d952df?auto=format&fit=crop&w=500&q=60',
    cpu: 'AMD Ryzen 7 7840H',
    ram: '16 ГБ DDR5',
    storage: '512 ГБ SSD',
    gpu: 'NVIDIA RTX 4050',
    display_size: '16" FHD+ (1920x1200), 144Hz',
  },
]

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || response.statusText)
  }
  return response.json()
}

function getAuthHeaders(): Record<string, string> {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as { currentUser: User | null }
    if (!parsed.currentUser?.id) return {}
    return { Authorization: `Bearer ${parsed.currentUser.id}` }
  } catch {
    return {}
  }
}

export async function initDb() {
  try {
    await fetch(`${API_BASE}/status`)
  } catch (error) {
    console.warn('API не доступен', error)
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    return await handleResponse<Product[]>(await fetch(`${API_BASE}/products`))
  } catch (error) {
    console.warn('API getAllProducts failed, using mock data:', error)
    return MOCK_PRODUCTS
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    return await handleResponse<Product>(await fetch(`${API_BASE}/products/${id}`))
  } catch (error) {
    console.warn('API getProductById failed, using mock data:', error)
    return MOCK_PRODUCTS.find((p) => p.id === id)
  }
}

export async function createUser(user: User): Promise<User> {
  try {
    return await handleResponse<User>(
      await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
    )
  } catch (error) {
    console.warn('API createUser failed, creating local user:', error)
    // В режиме offline создаём пользователя локально
    return {
      id: crypto.randomUUID(),
      name: user.name || 'User',
      email: user.email,
      password: '',
      role: 'user',
    }
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    const payload = await handleResponse<{ user: User }>(response)
    return payload.user
  } catch (error) {
    console.warn('API loginUser failed, creating demo user:', error)
    // В режиме offline создаём демо пользователя
    return {
      id: crypto.randomUUID(),
      name: 'Demo User',
      email,
      password: '',
      role: 'user',
    }
  }
}

export async function saveOrder(order: Omit<Order, 'status' | 'createdAt'> & { status?: string; createdAt?: number }): Promise<Order> {
  try {
    return await handleResponse<Order>(
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(order),
      })
    )
  } catch (error) {
    console.warn('API saveOrder failed, creating local order:', error)
    // В режиме offline создаём заказ локально
    return {
      id: crypto.randomUUID(),
      userId: 'local',
      items: order.items,
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status || 'Локально сохранён',
      createdAt: order.createdAt || Date.now(),
    }
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    return await handleResponse<Order[]>(
      await fetch(`${API_BASE}/orders`, {
        headers: getAuthHeaders(),
      })
    )
  } catch (error) {
    console.warn('API getAllOrders failed:', error)
    return []
  }
}

export async function saveProduct(product: Product): Promise<Product> {
  try {
    return await handleResponse<Product>(
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(product),
      })
    )
  } catch (error) {
    console.warn('API saveProduct failed:', error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await handleResponse(
      await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
    )
  } catch (error) {
    console.warn('API deleteProduct failed:', error)
    throw error
  }
}
