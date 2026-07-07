import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ErrorComponent } from '@tanstack/react-router'

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: ErrorComponent,
    scrollRestoration: true,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
