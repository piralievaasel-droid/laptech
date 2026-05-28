import { getAllProducts } from '../db'
import { createProductCard } from '../components/product-card'
import { state } from '../state'
import { formatPrice } from '../utils/format'
import { navigate } from '../app'
import { showToast } from '../utils/notifications'

function buildFilterSection(query = '') {
  return `
    <div class="catalog-filters">
      <div class="filter-group">
        <label>Поиск</label>
        <input type="search" id="filter-search" placeholder="Введите модель или бренд" value="${query}" />
      </div>
      <div class="filter-group">
        <label>Бренд</label>
        <select id="filter-brand">
          <option value="all">Все</option>
          <option value="ASUS">ASUS</option>
          <option value="Apple">Apple</option>
          <option value="Lenovo">Lenovo</option>
          <option value="Dell">Dell</option>
          <option value="Acer">Acer</option>
          <option value="MSI">MSI</option>
        </select>
      </div>
      <div class="filter-group range-group">
        <label>Цена от</label>
        <input type="number" id="filter-min" min="0" value="0" />
      </div>
      <div class="filter-group range-group">
        <label>до</label>
        <input type="number" id="filter-max" min="0" value="1000000" />
      </div>
    </div>
  `
}

interface CatalogParams {
  query: URLSearchParams
}

export const catalogPage = {
  render: async ({ query }: CatalogParams) => {
    const container = document.createElement('section')
    container.className = 'page-section page-catalog'
    container.innerHTML = `
      <div class="section-head">
        <h2>Каталог ноутбуков</h2>
        <p>Фильтруйте, сравнивайте и добавляйте лучшие модели в корзину.</p>
      </div>
      ${buildFilterSection(query.get('q') || '')}
      <div class="catalog-summary"></div>
      <div class="product-grid"></div>
    `

    const products = await getAllProducts()
    const grid = container.querySelector<HTMLDivElement>('.product-grid')!
    const summary = container.querySelector<HTMLDivElement>('.catalog-summary')!
    const searchInput = container.querySelector<HTMLInputElement>('#filter-search')!
    const brandSelect = container.querySelector<HTMLSelectElement>('#filter-brand')!
    const minInput = container.querySelector<HTMLInputElement>('#filter-min')!
    const maxInput = container.querySelector<HTMLInputElement>('#filter-max')!

    function renderProducts() {
      const queryText = searchInput.value.trim().toLowerCase()
      const minPrice = Number(minInput.value) || 0
      const maxPrice = Number(maxInput.value) || 1000000
      const brand = brandSelect.value

      const filtered = products.filter((product) => {
        const matchesQuery = [product.title, product.brand, product.description]
          .join(' ')
          .toLowerCase()
          .includes(queryText)
        const matchesBrand = brand === 'all' || product.brand === brand
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice
        return matchesQuery && matchesBrand && matchesPrice
      })

      grid.innerHTML = ''
      if (!filtered.length) {
        grid.innerHTML = '<div class="empty-state">Ничего не найдено по вашему запросу.</div>'
      }
      filtered.forEach((product) => {
        const card = createProductCard(product)
        grid.append(card)
      })
      summary.innerHTML = `<span>Найдено моделей: <strong>${filtered.length}</strong></span> <span>Выбрано для сравнения: <strong>${state.compareIds.length}</strong></span>`
    }

    container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.dataset.action === 'buy') {
        const id = target.dataset.id
        const product = products.find((item) => item.id === id)
        if (!state.currentUser) {
          showToast('Войдите, чтобы сохранить корзину и оформить заказ.', 'warning')
          navigate('#auth')
          return
        }
        if (product) {
          const result = state.addToCart(product)
          showToast(result === 'exists' ? 'Товар уже в корзине, количество увеличено.' : 'Товар добавлен в корзину.', 'success')
        }
      }
    })

    container.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement
      if (target.dataset.action === 'compare') {
        const id = target.dataset.id
        if (id) {
          state.toggleCompare(id)
          renderProducts()
        }
      }
    })

    ;[searchInput, brandSelect, minInput, maxInput].forEach((input) => {
      input.addEventListener('input', renderProducts)
    })

    renderProducts()
    return container
  },
}
