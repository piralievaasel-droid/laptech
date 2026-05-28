import { state } from '../state'
import { navigate } from '../app'
import { showProfileModal } from '../utils/profile-modal'

export function renderNavbar(container: HTMLElement) {
  const userBadgeHtml = state.currentUser ? `<button id="profile-btn" class="user-badge" type="button">${state.currentUser.name}</button>` : ''
  const authLink = state.currentUser ? '<button id="logout-btn" class="nav-button">Выйти</button>' : '<a href="#auth" class="nav-link">Войти</a>'
  container.innerHTML = `
    <div class="navbar-inner">
      <div class="logo-block">
        <a href="#home" class="brand">LapTech</a>
        <span class="tag">Каталог ноутбуков</span>
      </div>
      <nav class="nav-links">
        <a href="#catalog" class="nav-link">Каталог</a>
        <a href="#cart" class="nav-link">Корзина</a>
        <a href="#compare" class="nav-link">Сравнить</a>
        ${state.currentUser?.role === 'admin' ? '<a href="#admin" class="nav-link">Админ</a>' : ''}
      </nav>
      <div class="nav-controls">
        <form id="search-form" class="search-form">
          <input type="search" name="q" placeholder="Поиск ноутбука" autocomplete="off" />
          <button type="submit">Найти</button>
        </form>
        ${userBadgeHtml}
        ${authLink}
      </div>
    </div>
  `

  const profileBtn = container.querySelector<HTMLButtonElement>('#profile-btn')
  if (profileBtn) {
    profileBtn.addEventListener('click', showProfileModal)
  }

  const logoutBtn = container.querySelector<HTMLButtonElement>('#logout-btn')
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.logout()
      navigate('#home')
    })
  }

  const searchForm = container.querySelector<HTMLFormElement>('#search-form')
  if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const form = event.currentTarget as HTMLFormElement
      const data = new FormData(form)
      const value = String(data.get('q') || '').trim()
      navigate(value ? `#catalog?q=${encodeURIComponent(value)}` : '#catalog')
    })
  }
}
