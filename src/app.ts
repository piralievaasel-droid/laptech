import { state } from './state'
import { initDb } from './db'
import { routes } from './routes'
import { renderNavbar } from './components/navbar'
import { animateTransition } from './utils/animation'

const root = document.querySelector('#app') as HTMLElement
const header = document.createElement('header')
const main = document.createElement('main')
const footer = document.createElement('footer')

interface RouteParams {
  query: URLSearchParams
}

function parseRoute(hash: string) {
  const raw = hash.replace(/^#/, '') || 'home'
  const [path, query = ''] = raw.split('?')
  return { path, query: new URLSearchParams(query) }
}

async function renderPage() {
  const { path, query } = parseRoute(window.location.hash)
  const page = routes[path] ?? routes.home
  const content = await page.render({ query })

  root.innerHTML = ''
  header.className = 'page-header'
  main.className = 'page-main'
  footer.className = 'page-footer'

  renderNavbar(header)
  main.replaceChildren(content)
  footer.innerHTML = 'LapTech — премиум-каталог ноутбуков, профили, оплата и поддержка. <a href="mailto:support@laptech.kz">support@laptech.kz</a>'

  root.append(header, main, footer)
  animateTransition(main)
}

export async function initApp() {
  await initDb()
  state.loadSession()
  window.addEventListener('hashchange', renderPage)
  await renderPage()
}

export function navigate(path: string) {
  window.location.hash = path
}
