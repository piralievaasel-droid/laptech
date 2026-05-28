import { createUser, loginUser } from '../db'
import { state } from '../state'
import { navigate } from '../app'

export const authPage = {
  render: async () => {
    const container = document.createElement('section')
    container.className = 'page-section page-auth'
    container.innerHTML = `
      <div class="section-head">
        <h2>Вход и регистрация</h2>
        <p>Создайте аккаунт или войдите, чтобы сохранить корзину и оформить заказ.</p>
      </div>
      <div class="auth-panel">
        <div class="auth-tabs">
          <button type="button" class="auth-tab auth-tab--active" data-target="login">Вход</button>
          <button type="button" class="auth-tab" data-target="register">Регистрация</button>
        </div>
        <div class="auth-window">
          <form id="login-form" class="auth-card auth-card--active">
            <h3>Войти</h3>
            <label>Почта<input type="email" name="email" required autocomplete="email" /></label>
            <label>Пароль<input type="password" name="password" required minlength="6" autocomplete="current-password" /></label>
            <button type="submit" class="button button-primary">Войти</button>
            <div class="alert" id="login-alert"></div>
          </form>
          <form id="register-form" class="auth-card">
            <h3>Регистрация</h3>
            <label>Имя<input type="text" name="name" required autocomplete="name" /></label>
            <label>Почта<input type="email" name="email" required autocomplete="email" /></label>
            <label>Пароль<input type="password" name="password" required minlength="6" autocomplete="new-password" /></label>
            <button type="submit" class="button button-secondary">Зарегистрироваться</button>
            <div class="alert" id="register-alert"></div>
          </form>
        </div>
      </div>
    `

    const tabs = Array.from(container.querySelectorAll<HTMLButtonElement>('.auth-tab'))
    const cards = Array.from(container.querySelectorAll<HTMLFormElement>('.auth-card'))
    const loginForm = container.querySelector<HTMLFormElement>('#login-form')!
    const registerForm = container.querySelector<HTMLFormElement>('#register-form')!
    const loginAlert = container.querySelector<HTMLDivElement>('#login-alert')!
    const registerAlert = container.querySelector<HTMLDivElement>('#register-alert')!

    function switchTab(target: string) {
      tabs.forEach((tab) => {
        tab.classList.toggle('auth-tab--active', tab.dataset.target === target)
      })
      cards.forEach((card) => {
        card.classList.toggle('auth-card--active', card.id === `${target}-form`)
      })
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => switchTab(tab.dataset.target || 'login'))
    })

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault()
      loginAlert.textContent = ''
      const form = new FormData(loginForm)
      const email = String(form.get('email') || '').trim()
      const password = String(form.get('password') || '').trim()
      try {
        const user = await loginUser(email, password)
        state.login(user)
        navigate('#catalog')
      } catch (error) {
        loginAlert.textContent = String(error instanceof Error ? error.message : 'Ошибка входа')
      }
    })

    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault()
      registerAlert.textContent = ''
      const form = new FormData(registerForm)
      const name = String(form.get('name') || '').trim()
      const email = String(form.get('email') || '').trim()
      const password = String(form.get('password') || '').trim()
      try {
        await createUser({
          id: crypto.randomUUID(),
          name,
          email,
          password,
          role: 'user',
        })
        registerAlert.textContent = 'Учетная запись создана. Выполните вход.'
        switchTab('login')
      } catch (error) {
        registerAlert.textContent = String(error instanceof Error ? error.message : 'Ошибка регистрации')
      }
    })

    return container
  },
}
