import type { Metadata } from 'next'
import { CompaniesView } from '@/components/companies/companies-view'
import { NewCompanyButton } from '@/components/companies/new-company-dialog'
import { DemoBadge, PageContainer, PageHeader } from '@/components/shared/page-header'
import { getCompanies } from '@/lib/data'

export const metadata: Metadata = { title: 'Empresas' }

export default async function CompaniesPage() {
  const companies = await getCompanies()
  return (
    <PageContainer>
      <PageHeader
        eyebrow={<DemoBadge />}
        title="Empresas"
        description="Contas de clientes e prospects com seus contatos e oportunidades."
        actions={<NewCompanyButton />}
      />
      <CompaniesView companies={companies} />
    </PageContainer>
  )
}
