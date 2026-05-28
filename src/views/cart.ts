import { saveOrder } from '../db'
import { state } from '../state'
import { formatPrice } from '../utils/format'
import { navigate } from '../app'
import { showToast } from '../utils/notifications'

export const cartPage = {
  render: async () => {
    const container = document.createElement('section')
    container.className = 'page-section page-cart'
    container.innerHTML = `
      <div class="section-head">
        <h2>Корзина</h2>
        <p>Проверьте содержимое, выберите способ оплаты и оформите заказ.</p>
      </div>
      <div class="cart-grid"></div>
    `

    const cartGrid = container.querySelector<HTMLDivElement>('.cart-grid')!

    if (!state.currentUser) {
      cartGrid.innerHTML = `
        <div class="empty-state">
          Чтобы оформить заказ, пожалуйста, <a href="#auth">войдите</a> или зарегистрируйтесь.
        </div>
      `
      return container
    }

    function renderCart() {
      if (!state.cart.length) {
        cartGrid.innerHTML = '<div class="empty-state">Ваша корзина пуста.</div>'
        return
      }

      const itemsHtml = state.cart
        .map(
          (item) => `
            <div class="cart-item">
              <img src="${item.product.image_url}" alt="${item.product.title}" />
              <div class="cart-item-info">
                <h3>${item.product.title}</h3>
                <p>${item.product.brand} · ${item.product.cpu}, ${item.product.ram}, ${item.product.storage}</p>
                <div class="cart-controls">
                  <input type="number" min="1" max="${item.product.stock}" data-action="quantity" data-id="${item.id}" value="${item.quantity}" />
                  <button class="button button-tertiary" data-action="remove" data-id="${item.id}">Удалить</button>
                </div>
              </div>
              <strong>${formatPrice(item.product.price * item.quantity)}</strong>
            </div>
          `
        )
        .join('')

      const total = state.cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
      cartGrid.innerHTML = `
        <div class="cart-list">${itemsHtml}</div>
        <div class="checkout-card">
          <div class="checkout-block">
            <p>Покупатель</p>
            <strong>${state.currentUser?.name || 'Пользователь'}</strong>
          </div>
          <div class="checkout-block">
            <p>Итог</p>
            <strong>${formatPrice(total)}</strong>
          </div>
          <button class="button button-primary" id="checkout-button">Оформить заказ</button>
          <div class="payment-form" id="payment-form" style="display: none;">
            <div class="checkout-block">
              <label>Способ оплаты</label>
              <select id="payment-method">
                <option value="Картой">Картой</option>
                <option value="Kaspi">Kaspi</option>
                <option value="Наличные при получении">Наличные при получении</option>
              </select>
            </div>
            <div class="checkout-block card-fields">
              <label>Номер карты<input type="text" id="card-number" placeholder="0000 0000 0000 0000" maxlength="19" /></label>
              <label>Срок действия<input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" /></label>
              <label>CVV<input type="text" id="card-cvc" placeholder="123" maxlength="4" /></label>
            </div>
            <button class="button button-primary" id="confirm-checkout">Подтвердить оплату</button>
            <button class="button button-secondary" id="cancel-checkout">Отмена</button>
          </div>
          <div class="alert" id="checkout-alert"></div>
        </div>
      `

      const paymentSelect = cartGrid.querySelector<HTMLSelectElement>('#payment-method')
      const cardFields = cartGrid.querySelector<HTMLDivElement>('.card-fields')
      if (paymentSelect && cardFields) {
        cardFields.style.display = paymentSelect.value === 'Картой' ? 'grid' : 'none'
      }
    }

    cartGrid.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.dataset.action === 'remove') {
        state.removeFromCart(target.dataset.id || '')
        renderCart()
      }
    })

    cartGrid.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement
      if (target.dataset.action === 'quantity') {
        const id = target.dataset.id || ''
        state.updateCartQuantity(id, Number(target.value))
        renderCart()
      }
      if (target.id === 'payment-method') {
        const cardFields = container.querySelector<HTMLDivElement>('.card-fields')!
        cardFields.style.display = target.value === 'Картой' ? 'grid' : 'none'
      }
    })

    cartGrid.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement
      if (target.id === 'checkout-button') {
        const paymentForm = container.querySelector<HTMLDivElement>('#payment-form')!
        paymentForm.style.display = 'grid'
      }
      if (target.id === 'cancel-checkout') {
        const paymentForm = container.querySelector<HTMLDivElement>('#payment-form')!
        paymentForm.style.display = 'none'
      }
      if (target.id === 'confirm-checkout') {
        const alertBox = container.querySelector<HTMLDivElement>('#checkout-alert')!
        alertBox.textContent = ''
        const payment = (container.querySelector<HTMLSelectElement>('#payment-method')?.value || 'Картой')
        const total = state.cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
        if (!state.cart.length) {
          alertBox.textContent = 'Корзина пуста.'
          return
        }
        if (payment === 'Картой') {
          const cardNumber = String(container.querySelector<HTMLInputElement>('#card-number')?.value || '').replace(/\s+/g, '')
          const cardExpiry = String(container.querySelector<HTMLInputElement>('#card-expiry')?.value || '')
          const cardCvc = String(container.querySelector<HTMLInputElement>('#card-cvc')?.value || '')
          if (!/^\d{16}$/.test(cardNumber)) {
            alertBox.textContent = 'Введите корректный номер карты из 16 цифр.'
            return
          }
          if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
            alertBox.textContent = 'Введите срок действия в формате MM/YY.'
            return
          }
          if (!/^\d{3,4}$/.test(cardCvc)) {
            alertBox.textContent = 'Введите CVV из 3 или 4 цифр.'
            return
          }
        }
        try {
          await saveOrder({
            id: crypto.randomUUID(),
            userId: state.currentUser!.id,
            items: state.cart,
            total,
            paymentMethod: payment,
            status: 'Получен',
            createdAt: Date.now(),
          })
          state.clearCart()
          showToast('Заказ успешно оформлен.', 'success')
          navigate('#home')
        } catch (error) {
          alertBox.textContent = String(error instanceof Error ? error.message : 'Ошибка оформления')
        }
      }
    })

    renderCart()
    return container
  },
}
