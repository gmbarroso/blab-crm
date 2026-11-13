import { requireOrganization } from "@/server/auth/session";
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Globe, MapPin } from 'lucide-react'
import { CompanyDetailTabs } from '@/components/companies/company-detail-tabs'
import { PageContainer, PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { getCompany, getCompanyDetail } from '@/lib/data'
import { initials } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await requireOrganization();
  const { id } = await params
  const company = await getCompany(id)
  return { title: company?.name ?? 'Empresa' }
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOrganization();
  const { id } = await params
  const detail = await getCompanyDetail(id)
  if (!detail) notFound()
  const { company } = detail

  return (
    <PageContainer>
      <Button variant="ghost" size="sm" className="-ml-2 self-start text-muted-foreground" nativeButton={false} render={<Link href="/empresas" />}>
        <ArrowLeft data-icon="inline-start" />
        Empresas
      </Button>
      <div className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary font-mono text-lg font-semibold text-primary-foreground">
          {initials(company.name)}
        </span>
        <PageHeader
          className="flex-1"
          title={company.name}
          description={`${company.segment} · ${company.employees}`}
        />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-4" aria-hidden="true" />
          {company.city}, {company.state}
        </span>
        {company.website && (
          <a
            href={`https://${company.website}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <Globe className="size-4" aria-hidden="true" />
            {company.website}
          </a>
        )}
      </div>
      <CompanyDetailTabs {...detail} />
    </PageContainer>
  )
}
