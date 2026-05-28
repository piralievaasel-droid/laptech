import { Product, User, Order } from './types'

const API_BASE = '/api'
const SESSION_KEY = 'laptech-session'

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
  return handleResponse<Product[]>(await fetch(`${API_BASE}/products`))
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return handleResponse<Product>(await fetch(`${API_BASE}/products/${id}`))
}

export async function createUser(user: User): Promise<User> {
  return handleResponse<User>(
    await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
  )
}

export async function loginUser(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  const payload = await handleResponse<{ user: User }>(response)
  return payload.user
}

export async function saveOrder(order: Omit<Order, 'status' | 'createdAt'> & { status?: string; createdAt?: number }): Promise<Order> {
  return handleResponse<Order>(
    await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(order),
    })
  )
}

export async function getAllOrders(): Promise<Order[]> {
  return handleResponse<Order[]>(
    await fetch(`${API_BASE}/orders`, {
      headers: getAuthHeaders(),
    })
  )
}

export async function saveProduct(product: Product): Promise<Product> {
  return handleResponse<Product>(
    await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(product),
    })
  )
}

export async function deleteProduct(id: string): Promise<void> {
  await handleResponse(
    await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
  )
}
