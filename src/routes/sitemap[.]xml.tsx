import { createFileRoute } from '@tanstack/react-router'
import { getSitemapXml } from '~/server/seo'

export const Route = createFileRoute('/sitemap.xml')({
  component: Sitemap,
  loader: () => getSitemapXml(),
})

function Sitemap() {
  const xml = Route.useLoaderData()
  return (
    <pre className="overflow-x-auto p-6 text-xs text-sand-800">{xml}</pre>
  )
}
