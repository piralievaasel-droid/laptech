export interface Product {
  id: string
  title: string
  brand: string
  description: string
  image_url: string
  cpu: string
  ram: string
  storage: string
  gpu: string
  display_size: string
  price: number
  stock: number
  featured: boolean
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  product: Product
}

export interface User {
  id: string
  email: string
  name: string
  password: string
  role: 'admin' | 'user'
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  paymentMethod: string
  status: string
  createdAt: number
}
