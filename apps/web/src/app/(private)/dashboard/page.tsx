import { requireOrganization } from "@/server/auth/session";
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LeadsBySourceChart, RevenueChart } from '@/components/charts/crm-charts'
import { ActivityCard } from '@/components/shared/activity-card'
import { MetricCard } from '@/components/shared/metric-card'
import { ModuleStatus, PageContainer, PageHeader } from '@/components/shared/page-header'
import { SectionCard } from '@/components/shared/section-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { PIPELINE_STAGES, STAGE_LABEL } from '@/lib/constants'
import {
  getDashboardMetrics,
  getRecentOpportunities,
  getReports,
  getUpcomingActivities,
} from '@/lib/data'
import { formatCurrency, formatDate } from '@/lib/format'

export const metadata: Metadata = { title: 'Dashboard' }

const stageTone = Object.fromEntries(PIPELINE_STAGES.map((stage) => [stage.id, stage.tone]))

function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <Button variant="ghost" size="sm" className="-mt-1 -mr-2 text-muted-foreground" nativeButton={false} render={<Link href={href} />}>
      {label}
      <ArrowRight data-icon="inline-end" />
    </Button>
  )
}

export default async function DashboardPage() {
  const { user, organization } = await requireOrganization();
  const [metrics, opportunities, activities, reports] = await Promise.all([
    getDashboardMetrics(),
    getRecentOpportunities(5),
    getUpcomingActivities(5),
    getReports(),
  ])

  return (
    <PageContainer>
      <PageHeader
        eyebrow={<ModuleStatus />}
        title={`Olá, ${user.name}`}
        description={`Visão geral de ${organization.name}. Ainda não há dados comerciais.`}
      />

      <section aria-label="Indicadores comerciais" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Receita por mês"
          description="Valor ganho vs. previsto nos últimos 6 meses"
          className="lg:col-span-2"
        >
          <RevenueChart data={reports.revenueByMonth} />
        </SectionCard>
        <SectionCard title="Leads por origem" description="Últimos 30 dias">
          <LeadsBySourceChart data={reports.leadsBySource} />
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <SectionCard
          title="Próximas atividades"
          action={<SeeAll href="/atividades" label="Ver todas" />}
          className="lg:col-span-2"
          contentClassName="pt-3"
        >
          {activities.length === 0 && <p className="py-6 text-sm text-muted-foreground">Nenhuma atividade agendada.</p>}
          <ul className="flex flex-col divide-y">
            {activities.map((activity) => (
              <li key={activity.id} className="py-3 first:pt-0 last:pb-0">
                <ActivityCard activity={activity} compact />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Oportunidades recentes"
          action={<SeeAll href="/pipeline" label="Ver pipeline" />}
          className="lg:col-span-3"
          contentClassName="px-0 pt-3 pb-2"
        >
          {opportunities.length === 0 && <p className="px-5 py-6 text-sm text-muted-foreground">Nenhuma oportunidade cadastrada.</p>}
          <ul className="flex flex-col divide-y">
            {opportunities.map((opp) => (
              <li key={opp.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="truncate text-sm font-semibold">{opp.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {opp.companyName} · {opp.owner} · {formatDate(opp.updatedAt)}
                  </p>
                </div>
                <StatusBadge tone={stageTone[opp.stage]} className="hidden sm:inline-flex">
                  {STAGE_LABEL[opp.stage]}
                </StatusBadge>
                <span className="w-24 shrink-0 text-right font-mono text-sm font-semibold tabular-nums">
                  {formatCurrency(opp.value)}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </PageContainer>
  )
}
