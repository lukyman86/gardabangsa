import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { getSupabaseServerClient } from '~/integrations/supabase/client.server'

const BASE_URL = process.env.SITE_URL ?? 'http://localhost:3000'

export const getSitemapXml = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = await getSupabaseServerClient()
  const { data: news } = await supabase
    .from('news')
    .select('slug')
    .eq('published', true)

  const staticPaths = ['', '/profil', '/galeri', '/berita', '/kontak', '/auth']
  const urls = [
    ...staticPaths.map(
      (p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`,
    ),
    ...(news ?? []).map(
      (n) =>
        `  <url><loc>${BASE_URL}/berita/${n.slug}</loc><changefreq>daily</changefreq></url>`,
    ),
  ].join('\n')

  setResponseHeader('content-type', 'application/xml')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
})

export const getRobotsTxt = createServerFn({ method: 'GET' }).handler(async () => {
  setResponseHeader('content-type', 'text/plain')
  return `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`
})
