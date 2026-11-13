'use client'

import Link from 'next/link'
import { Building2, ChevronRight, ExternalLink } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DataTable, type DataTableColumn } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { ALL, FilterBar } from '@/components/shared/filter-bar'
import { SearchInput } from '@/components/shared/search-input'
import { Button } from '@/components/ui/button'
import { SEGMENTS } from '@/lib/constants'
import { initials } from '@/lib/format'
import type { Company } from '@/lib/types'

const columns: DataTableColumn<Company>[] = [
  {
    id: 'name',
    header: 'Nome',
    cell: (company) => (
      <Link
        href={`/empresas/${company.id}`}
        className="flex items-center gap-3 rounded-md font-semibold outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent font-mono text-xs font-semibold text-accent-foreground">
          {initials(company.name)}
        </span>
        {company.name}
      </Link>
    ),
  },
  {
    id: 'segment',
    header: 'Segmento',
    cell: (company) => <span className="text-muted-foreground">{company.segment}</span>,
    className: 'hidden sm:table-cell',
  },
  {
    id: 'location',
    header: 'Localização',
    cell: (company) => (
      <span className="text-muted-foreground">
        {company.city}, {company.state}
      </span>
    ),
    className: 'hidden md:table-cell',
  },
  {
    id: 'website',
    header: 'Site',
    cell: (company) =>
      company.website ? (
        <a
          href={`https://${company.website}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          {company.website}
          <ExternalLink className="size-3" aria-hidden="true" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
    className: 'hidden lg:table-cell',
  },
  {
    id: 'contacts',
    header: 'Contatos',
    cell: (company) => (
      <span className="font-mono text-sm tabular-nums">{company.contactIds.length}</span>
    ),
    className: 'hidden sm:table-cell',
  },
  {
    id: 'open',
    header: '',
    cell: (company) => (
      <Button variant="ghost" size="icon-sm" nativeButton={false} render={<Link href={`/empresas/${company.id}`} />}>
        <ChevronRight />
        <span className="sr-only">Ver detalhes de {company.name}</span>
      </Button>
    ),
    className: 'w-10 text-right',
  },
]

export function CompaniesView({ companies }: { companies: Company[] }) {
  const [query, setQuery] = useState('')
  const [values, setValues] = useState<Record<string, string>>({ segment: ALL })

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase()
    return companies.filter(
      (company) =>
        (!term ||
          company.name.toLowerCase().includes(term) ||
          company.city.toLowerCase().includes(term)) &&
        (values.segment === ALL || company.segment === values.segment),
    )
  }, [companies, query, values])

  return (
    <>
      <FilterBar
        filters={[
          { id: 'segment', label: 'Segmento', options: SEGMENTS.map((s) => ({ value: s, label: s })) },
        ]}
        values={values}
        onChange={(id, value) => setValues((current) => ({ ...current, [id]: value }))}
        onReset={() => setValues({ segment: ALL })}
      >
        <SearchInput value={query} onChange={setQuery} placeholder="Buscar nome ou cidade" label="Buscar empresas" />
      </FilterBar>
      <DataTable
        caption="Lista de empresas"
        columns={columns}
        rows={rows}
        getRowKey={(company) => company.id}
        footer={<span>{rows.length} empresas</span>}
        empty={
          <EmptyState
            icon={Building2}
            title="Nenhuma empresa encontrada"
            description="Tente outro termo de busca ou remova o filtro de segmento."
          />
        }
      />
    </>
  )
}
