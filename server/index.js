import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as db from './database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/products', (req, res) => {
  res.json(db.getProducts())
})

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id)
  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' })
  }
  res.json(product)
})

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' })
  }
  const exists = db.findUserByEmail(email)
  if (exists) {
    return res.status(409).json({ error: 'Пользователь уже зарегистрирован' })
  }
  const user = { id: crypto.randomUUID(), name, email, password, role: 'user' }
  db.createUser(user)
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  const user = db.verifyUser(email, password)
  if (!user) {
    return res.status(401).json({ error: 'Неверная почта или пароль' })
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: user.id,
  })
})

function getUserFromRequest(req) {
  const header = req.headers.authorization || ''
  const token = header.replace('Bearer ', '').trim()
  if (!token) return null
  return db.findUserById(token) || null
}

app.get('/api/orders', (req, res) => {
  const user = getUserFromRequest(req)
  if (!user) {
    return res.status(401).json({ error: 'Необходим пользователь' })
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Требуется администратор' })
  }
  res.json(db.getOrders())
})

app.post('/api/orders', (req, res) => {
  const user = getUserFromRequest(req)
  if (!user) {
    return res.status(401).json({ error: 'Необходим пользователь' })
  }
  const { items, total, paymentMethod } = req.body
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Пустой заказ' })
  }
  const order = {
    id: crypto.randomUUID(),
    userId: user.id,
    items,
    total,
    paymentMethod,
    status: 'Получен',
    createdAt: Date.now(),
  }
  db.saveOrder(order)
  res.json(order)
})

app.post('/api/products', (req, res) => {
  const user = getUserFromRequest(req)
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Требуется администратор' })
  }
  const product = req.body
  if (!product || !product.id) {
    return res.status(400).json({ error: 'Неверные данные товара' })
  }
  db.createProduct(product)
  res.json(product)
})

app.delete('/api/products/:id', (req, res) => {
  const user = getUserFromRequest(req)
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Требуется администратор' })
  }
  db.removeProduct(req.params.id)
  res.json({ success: true })
})

const staticRoot = path.join(__dirname, '../dist')
if (fs.existsSync(staticRoot)) {
  app.use(express.static(staticRoot))
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticRoot, 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
