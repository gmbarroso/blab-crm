import { requireOrganization } from "@/server/auth/session";
import type { Metadata } from 'next'
import {
  ConversionTrendChart,
  LeadsBySourceChart,
  OpportunitiesByStageChart,
  RevenueChart,
} from '@/components/charts/crm-charts'
import { PageContainer, PageHeader } from '@/components/shared/page-header'
import { SectionCard } from '@/components/shared/section-card'
import { getReports } from '@/lib/data'

export const metadata: Metadata = { title: 'Relatórios' }

export default async function ReportsPage() {
  await requireOrganization();
  const reports = await getReports()
  const funnelMax = Math.max(...reports.conversionFunnel.map((step) => step.value), 1)

  return (
    <PageContainer>
      <PageHeader
        title="Relatórios"
        description="Os relatórios serão exibidos quando houver dados comerciais."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Taxa de conversão" description="Leads convertidos em clientes por mês">
          <ConversionTrendChart data={reports.conversionTrend} />
          <ol className="mt-5 flex flex-col gap-2" aria-label="Funil de conversão">
            {reports.conversionFunnel.map((step) => (
              <li key={step.step} className="flex items-center gap-3 text-xs">
                <span className="w-28 shrink-0 text-muted-foreground">{step.step}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${(step.value / funnelMax) * 100}%` }}
                  />
                </span>
                <span className="w-8 text-right font-mono tabular-nums">{step.value}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
        <SectionCard title="Leads por origem" description="Distribuição dos últimos 30 dias">
          <LeadsBySourceChart data={reports.leadsBySource} className="h-80 w-full" />
        </SectionCard>
        <SectionCard title="Vendas por período" description="Receita ganha vs. prevista" className="lg:col-span-2">
          <RevenueChart data={reports.revenueByMonth} className="h-72 w-full" />
        </SectionCard>
        <SectionCard title="Oportunidades por etapa" description="Quantidade atual em cada etapa do pipeline" className="lg:col-span-2">
          <OpportunitiesByStageChart data={reports.opportunitiesByStage} />
        </SectionCard>
      </div>
    </PageContainer>
  )
}
