import { createFileRoute } from '@tanstack/react-router'
import { PublicShell, PublicCta } from '~/components/layout/PublicShell'
import { Hero } from '~/components/home/Hero'
import { NewsPreview } from '~/components/home/NewsPreview'
import { MemberCounter } from '~/components/home/MemberCounter'
import { AgendaList } from '~/components/home/AgendaList'
import { getHomeData, getMemberCount } from '~/server/queries'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => {
    const [home, memberCount] = await Promise.all([
      getHomeData(),
      getMemberCount(),
    ])
    return {
      news: home.news,
      agenda: home.agenda,
      memberCount: memberCount || home.memberCount || 1280,
      newsCount: home.news.length + 12,
      agendaCount: home.agenda.length + 5,
    }
  },
})

function HomePage() {
  const { news, agenda, memberCount, newsCount, agendaCount } = Route.useLoaderData()

  return (
    <PublicShell>
      <Hero memberCount={memberCount} newsCount={newsCount} agendaCount={agendaCount} />
      <NewsPreview news={news} />
      <MemberCounter target={memberCount || 1280} />
      <AgendaList agenda={agenda} />
      <PublicCta />
    </PublicShell>
  )
}
