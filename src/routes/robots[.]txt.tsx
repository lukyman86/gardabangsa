import { createFileRoute } from '@tanstack/react-router'
import { getRobotsTxt } from '~/server/seo'

export const Route = createFileRoute('/robots.txt')({
  component: Robots,
  loader: () => getRobotsTxt(),
})

function Robots() {
  const txt = Route.useLoaderData()
  return <pre className="overflow-x-auto p-6 text-xs text-sand-800">{txt}</pre>
}
