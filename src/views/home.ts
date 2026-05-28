import { getAllProducts } from '../db'
import { createProductCard } from '../components/product-card'
import { state } from '../state'
import { navigate } from '../app'
import { showToast } from '../utils/notifications'

export const homePage = {
  render: async () => {
    const container = document.createElement('section')
    container.className = 'page-section page-home'

    const products = await getAllProducts()
    const featured = products.filter((product) => product.featured)

    container.innerHTML = `
      <section class="hero-grid">
        <div class="hero-content">
          <span class="eyebrow">LapTech</span>
          <h1>Каталог ноутбуков премиум-класса</h1>
          <p>Лучшие рабочие и игровыe ноутбуки для бизнеса, учебы и творчества. Быстрая авторизация, удобная корзина, оплата и поддержка в одном приложении.</p>
          <div class="hero-actions">
            <a href="#catalog" class="button button-primary">Перейти в каталог</a>
            <a href="#compare" class="button button-secondary">Сравнить модели</a>
          </div>
        </div>
        <div class="hero-preview">
          <div class="preview-card">
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80" alt="Laptop preview" />
          </div>
        </div>
      </section>
      <section class="home-features">
        <article>
          <h2>Полный каталог</h2>
          <p>Фильтрация, сравнение и удобный вывод товаров по брендам, цене и характеристикам.</p>
        </article>
        <article>
          <h2>Авторизация и админ</h2>
          <p>Вход для клиентов и отдельная панель для администратора, чтобы контролировать товары и заказы.</p>
        </article>
        <article>
          <h2>Платёжный поток</h2>
          <p>Выбирайте способ оплаты и завершайте заказ прямо внутри сайта.</p>
        </article>
      </section>
      <section class="home-products">
        <div class="section-head">
          <h2>Топовые ноутбуки</h2>
          <p>Лучшие предложения каталога в тенге.</p>
        </div>
        <div class="product-grid"></div>
      </section>
    `

    const grid = container.querySelector<HTMLDivElement>('.product-grid')!
    featured.forEach((product) => {
      const card = createProductCard(product, false)
      const buyButton = card.querySelector<HTMLButtonElement>('[data-action="buy"]')
      if (buyButton) {
        buyButton.addEventListener('click', () => {
          if (!state.currentUser) {
            showToast('Войдите, чтобы сохранить корзину и оформить заказ.', 'warning')
            navigate('#auth')
            return
          }
          const result = state.addToCart(product)
          showToast(result === 'exists' ? 'Товар уже в корзине, количество увеличено.' : 'Товар добавлен в корзину.', 'success')
        })
      }
      grid.append(card)
    })

    return container
  },
}
