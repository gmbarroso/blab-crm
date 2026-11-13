import { requireOrganization } from "@/server/auth/session";
import type { Metadata } from 'next'
import { NewOpportunityButton } from '@/components/pipeline/new-opportunity-dialog'
import { PipelineBoard } from '@/components/pipeline/pipeline-board'
import { DemoBadge, PageContainer, PageHeader } from '@/components/shared/page-header'
import { getCompanies, getPipelineColumns } from '@/lib/data'
import { formatCurrency } from '@/lib/format'

export const metadata: Metadata = { title: 'Pipeline' }

export default async function PipelinePage() {
  await requireOrganization();
  const [columns, companies] = await Promise.all([getPipelineColumns(), getCompanies()])
  const open = columns.filter((c) => c.id !== 'ganho' && c.id !== 'perdido')
  const openTotal = open.reduce((sum, c) => sum + c.total, 0)
  const openCount = open.reduce((sum, c) => sum + c.items.length, 0)

  const companyOptions = companies.map((company) => ({ value: company.id, label: company.name }))
  const ownerOptions = [...new Set(columns.flatMap((c) => c.items.map((item) => item.owner)))]
    .sort()
    .map((owner) => ({ value: owner, label: owner }))

  return (
    <PageContainer className="max-w-none">
      <PageHeader
        eyebrow={<DemoBadge />}
        title="Pipeline"
        description={`${openCount} oportunidades em aberto · ${formatCurrency(openTotal)} estimados. Arrastar e soltar será habilitado na integração.`}
        actions={<NewOpportunityButton companies={companyOptions} owners={ownerOptions} />}
      />
      <PipelineBoard columns={columns} />
    </PageContainer>
  )
}
