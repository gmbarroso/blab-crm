import type { Metadata } from 'next'
import { LeadsView } from '@/components/leads/leads-view'
import { PageContainer } from '@/components/shared/page-header'
import { getLeads } from '@/lib/data'

export const metadata: Metadata = { title: 'Leads' }

export default async function LeadsPage() {
  const leads = await getLeads()
  return (
    <PageContainer>
      <LeadsView leads={leads} />
    </PageContainer>
  )
}
