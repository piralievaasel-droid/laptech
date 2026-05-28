import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import initSqlJs from 'sql.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const sqlJsPath = path.dirname(require.resolve('sql.js'))
const SQL = await initSqlJs({ locateFile: () => path.join(sqlJsPath, 'sql-wasm.wasm') })
const dbPath = path.join(__dirname, 'store.sqlite')

let db

function saveDb() {
  const data = db.export()
  fs.writeFileSync(dbPath, Buffer.from(data))
}

function runSql(sql, params = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  stmt.step()
  stmt.free()
  saveDb()
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const rows = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject())
  }
  stmt.free()
  return rows
}

function queryOne(sql, params = []) {
  const rows = queryAll(sql, params)
  return rows.length ? rows[0] : null
}

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      cpu TEXT NOT NULL,
      ram TEXT NOT NULL,
      storage TEXT NOT NULL,
      gpu TEXT NOT NULL,
      display_size TEXT NOT NULL,
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      featured INTEGER NOT NULL
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      items TEXT NOT NULL,
      total INTEGER NOT NULL,
      paymentMethod TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    )
  `)
}

function seedData() {
  const productCount = queryOne('SELECT COUNT(*) AS count FROM products').count
  if (productCount === 0) {
    const initialProducts = [
      {
        id: 'p-001',
        title: 'ASUS ROG Strix G16',
        brand: 'ASUS',
        description: 'Игровой ноутбук на Intel Core i9, RTX 4070 и 16" QHD для сложных задач.',
        image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
        cpu: 'Intel Core i9-13900HX',
        ram: '32 ГБ',
        storage: '1 ТБ SSD',
        gpu: 'NVIDIA RTX 4070',
        display_size: '16" QHD',
        price: 679990,
        stock: 12,
        featured: 1,
      },
      {
        id: 'p-002',
        title: 'MacBook Pro 14',
        brand: 'Apple',
        description: 'Профессиональная станция на Apple M3 Pro с 14" Liquid Retina и сверхбыстрой памятью.',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
        cpu: 'Apple M3 Pro',
        ram: '16 ГБ',
        storage: '512 ГБ SSD',
        gpu: '10-core GPU',
        display_size: '14" Liquid Retina',
        price: 549990,
        stock: 8,
        featured: 1,
      },
      {
        id: 'p-003',
        title: 'Lenovo Legion 7',
        brand: 'Lenovo',
        description: 'Ноутбук с AMD Ryzen 9, RTX 4080 и мощной системой охлаждения для стрима и монтажа.',
        image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
        cpu: 'AMD Ryzen 9 7945HX',
        ram: '32 ГБ',
        storage: '1 ТБ SSD',
        gpu: 'NVIDIA RTX 4080',
        display_size: '16" QHD',
        price: 729990,
        stock: 10,
        featured: 0,
      },
      {
        id: 'p-004',
        title: 'Dell XPS 15',
        brand: 'Dell',
        description: 'Ультратонкий ноутбук для дизайна и инженерии с 15" OLED и Intel Core i7.',
        image_url: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=900&q=80',
        cpu: 'Intel Core i7-13700H',
        ram: '16 ГБ',
        storage: '1 ТБ SSD',
        gpu: 'Intel Iris Xe',
        display_size: '15" OLED',
        price: 429990,
        stock: 14,
        featured: 0,
      },
      {
        id: 'p-005',
        title: 'Acer Swift X',
        brand: 'Acer',
        description: 'Легкий ноутбук для бизнеса и поездок с Ryzen 7 и 14" дисплеем.',
        image_url: 'https://images.unsplash.com/photo-1587825140708-3946c2d38f48?auto=format&fit=crop&w=900&q=80',
        cpu: 'AMD Ryzen 7 7840U',
        ram: '16 ГБ',
        storage: '512 ГБ SSD',
        gpu: 'NVIDIA RTX 4050',
        display_size: '14" IPS',
        price: 329990,
        stock: 20,
        featured: 0,
      },
      {
        id: 'p-006',
        title: 'MSI Prestige 16',
        brand: 'MSI',
        description: 'Тонкий и стильный ноутбук для профессионалов с Intel Core i7 и геометрией корпуса.',
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
        cpu: 'Intel Core i7-13620H',
        ram: '32 ГБ',
        storage: '1 ТБ SSD',
        gpu: 'NVIDIA RTX 4060',
        display_size: '16"',
        price: 459990,
        stock: 11,
        featured: 0,
      },
    ]
    for (const item of initialProducts) {
      db.run(
        `INSERT INTO products (id, title, brand, description, image_url, cpu, ram, storage, gpu, display_size, price, stock, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.title,
          item.brand,
          item.description,
          item.image_url,
          item.cpu,
          item.ram,
          item.storage,
          item.gpu,
          item.display_size,
          item.price,
          item.stock,
          item.featured,
        ]
      )
    }
    saveDb()
  }

  const admin = queryOne('SELECT id FROM users WHERE lower(email) = ?', ['admin@laptech.kz'])
  if (!admin) {
    const stmt = db.prepare(`
      INSERT INTO users (id, email, name, password, role)
      VALUES (?, ?, ?, ?, ?)
    `)
    stmt.bind([crypto.randomUUID(), 'admin@laptech.kz', 'Администратор', 'Admin1234', 'admin'])
    stmt.step()
    stmt.free()
    saveDb()
  }
}

if (fs.existsSync(dbPath)) {
  const data = fs.readFileSync(dbPath)
  db = new SQL.Database(new Uint8Array(data))
} else {
  db = new SQL.Database()
  createTables()
  seedData()
  saveDb()
}

export function getProducts() {
  return queryAll('SELECT * FROM products').map((item) => ({
    ...item,
    featured: Boolean(item.featured),
  }))
}

export function getProductById(id) {
  const item = queryOne('SELECT * FROM products WHERE id = ?', [id])
  return item ? { ...item, featured: Boolean(item.featured) } : null
}

export function createProduct(product) {
  const stmt = db.prepare(`
    INSERT INTO products (id, title, brand, description, image_url, cpu, ram, storage, gpu, display_size, price, stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.bind([
    product.id,
    product.title,
    product.brand,
    product.description,
    product.image_url,
    product.cpu,
    product.ram,
    product.storage,
    product.gpu,
    product.display_size,
    product.price,
    product.stock,
    product.featured ? 1 : 0,
  ])
  stmt.step()
  stmt.free()
  saveDb()
  return product
}

export function removeProduct(id) {
  const stmt = db.prepare('DELETE FROM products WHERE id = ?')
  stmt.bind([id])
  stmt.step()
  stmt.free()
  saveDb()
}

export function getOrders() {
  return queryAll('SELECT * FROM orders ORDER BY createdAt DESC').map((row) => ({
    ...row,
    items: JSON.parse(row.items),
  }))
}

export function saveOrder(order) {
  const stmt = db.prepare(`
    INSERT INTO orders (id, userId, items, total, paymentMethod, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.bind([
    order.id,
    order.userId,
    JSON.stringify(order.items),
    order.total,
    order.paymentMethod,
    order.status,
    order.createdAt,
  ])
  stmt.step()
  stmt.free()
  saveDb()
  return order
}

export function findUserByEmail(email) {
  return queryOne('SELECT * FROM users WHERE lower(email) = ?', [email.toLowerCase()])
}

export function findUserById(id) {
  return queryOne('SELECT * FROM users WHERE id = ?', [id])
}

export function createUser(user) {
  const stmt = db.prepare(`
    INSERT INTO users (id, email, name, password, role)
    VALUES (?, ?, ?, ?, ?)
  `)
  stmt.bind([user.id, user.email.toLowerCase(), user.name, user.password, user.role])
  stmt.step()
  stmt.free()
  saveDb()
}

export function verifyUser(email, password) {
  return queryOne('SELECT * FROM users WHERE lower(email) = ? AND password = ?', [email.toLowerCase(), password])
}
