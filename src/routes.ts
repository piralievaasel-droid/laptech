import { homePage } from './views/home'
import { catalogPage } from './views/catalog'
import { authPage } from './views/auth'
import { cartPage } from './views/cart'
import { comparePage } from './views/compare'
import { adminPage } from './views/admin'

interface PageModule {
  render: (params: { query: URLSearchParams }) => Promise<HTMLElement>
}

export const routes: Record<string, PageModule> = {
  home: homePage,
  catalog: catalogPage,
  auth: authPage,
  cart: cartPage,
  compare: comparePage,
  admin: adminPage,
}
