import { getAllProducts, getAllOrders, saveProduct, deleteProduct } from '../db'
import { state } from '../state'
import { formatPrice } from '../utils/format'

export const adminPage = {
  render: async () => {
    const container = document.createElement('section')
    container.className = 'page-section page-admin'
    if (!state.currentUser || state.currentUser.role !== 'admin') {
      container.innerHTML = `
        <div class="section-head">
          <h2>Админ-панель</h2>
          <p>Доступ закрыт. Для управления товарами нужен аккаунт администратора.</p>
        </div>
        <div class="empty-state">
          Войдите как администратор или используйте админить через <a href="#auth">авторизацию</a>.
        </div>
      `
      return container
    }

    let products = await getAllProducts()
    const orders = await getAllOrders()

    container.innerHTML = `
      <div class="section-head">
        <h2>Админ-панель</h2>
        <p>Добавляйте, редактируйте, удаляйте товары и отслеживайте заказы.</p>
      </div>
      <div class="admin-grid">
        <div class="admin-card">
          <h3>Новый товар</h3>
          <form id="product-form" class="admin-form">
            <label>Название<input name="title" required /></label>
            <label>Бренд<input name="brand" required /></label>
            <label>Описание<textarea name="description" rows="3" required></textarea></label>
            <label>Изображение URL<input name="image_url" required /></label>
            <label>CPU<input name="cpu" required /></label>
            <label>RAM<input name="ram" required /></label>
            <label>Хранилище<input name="storage" required /></label>
            <label>GPU<input name="gpu" required /></label>
            <label>Экран<input name="display_size" required /></label>
            <label>Цена<input type="number" name="price" required min="0" /></label>
            <label>Наличие<input type="number" name="stock" required min="0" /></label>
            <label class="checkbox-label"><input type="checkbox" name="featured" /> В топ</label>
            <button type="submit" class="button button-primary">Сохранить товар</button>
          </form>
          <div class="alert" id="admin-alert"></div>
        </div>
        <div class="admin-card admin-orders">
          <h3>Последние заказы</h3>
          <div class="order-list">
            ${orders
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 8)
              .map(
                (order) => `
                <article class="order-item">
                  <div><strong>Заказ:</strong> ${order.id.slice(0, 8)}</div>
                  <div><strong>Покупатель:</strong> ${order.userId}</div>
                  <div><strong>Сумма:</strong> ${formatPrice(order.total)}</div>
                  <div><strong>Оплата:</strong> ${order.paymentMethod}</div>
                </article>
              `
              )
              .join('')}
          </div>
        </div>
      </div>
      <div class="admin-products">
        <h3>Товары</h3>
        <div class="product-table"></div>
      </div>
    `

    const alertBox = container.querySelector<HTMLDivElement>('#admin-alert')!
    const form = container.querySelector<HTMLFormElement>('#product-form')!
    const productTable = container.querySelector<HTMLDivElement>('.product-table')!

    function renderProductRows(items: typeof products) {
      if (!items.length) {
        productTable.innerHTML = '<div class="empty-state">Список товаров пуст.</div>'
        return
      }

      productTable.innerHTML = items
        .map(
          (product) => `
            <div class="product-row" data-id="${product.id}">
              <div>${product.title}</div>
              <div>${product.brand}</div>
              <div>${formatPrice(product.price)}</div>
              <div>${product.stock}</div>
              <button class="button button-tertiary" data-action="delete" data-id="${product.id}">Удалить</button>
            </div>
          `
        )
        .join('')
    }

    renderProductRows(products)

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      alertBox.textContent = ''
      const formData = new FormData(form)
      try {
        const product = {
          id: crypto.randomUUID(),
          title: String(formData.get('title') || '').trim(),
          brand: String(formData.get('brand') || '').trim(),
          description: String(formData.get('description') || '').trim(),
          image_url: String(formData.get('image_url') || '').trim(),
          cpu: String(formData.get('cpu') || '').trim(),
          ram: String(formData.get('ram') || '').trim(),
          storage: String(formData.get('storage') || '').trim(),
          gpu: String(formData.get('gpu') || '').trim(),
          display_size: String(formData.get('display_size') || '').trim(),
          price: Number(formData.get('price') || 0),
          stock: Number(formData.get('stock') || 0),
          featured: Boolean(formData.get('featured')),
        }
        await saveProduct(product)
        products = [product, ...products]
        renderProductRows(products)
        alertBox.textContent = 'Товар сохранён и добавлен в список.'
        form.reset()
      } catch (error) {
        alertBox.textContent = String(error instanceof Error ? error.message : 'Ошибка сохранения')
      }
    })

    container.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement
      const id = target.dataset.id
      if (target.dataset.action === 'delete' && id) {
        try {
          await deleteProduct(id)
          products = products.filter((product) => product.id !== id)
          renderProductRows(products)
          alertBox.textContent = 'Товар удалён.'
        } catch (error) {
          alertBox.textContent = String(error instanceof Error ? error.message : 'Ошибка удаления')
        }
      }
    })

    return container
  },
}
