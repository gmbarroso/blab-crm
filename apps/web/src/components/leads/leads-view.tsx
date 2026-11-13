'use client'

import { Plus, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DataTable, type DataTableColumn } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { ALL, FilterBar, type FilterDefinition } from '@/components/shared/filter-bar'
import { ModuleStatus, PageHeader } from '@/components/shared/page-header'
import { SearchInput } from '@/components/shared/search-input'
import { StatusBadge } from '@/components/shared/status-badge'
import { NewLeadDialog } from '@/components/leads/new-lead-dialog'
import { Button } from '@/components/ui/button'
import { LEAD_SOURCES, LEAD_STATUS, PRIORITY } from '@/lib/constants'
import { formatDate, formatDateTime } from '@/lib/format'
import type { Lead } from '@/lib/types'

const filters: FilterDefinition[] = [
  {
    id: 'status',
    label: 'Status',
    options: Object.entries(LEAD_STATUS).map(([value, { label }]) => ({ value, label })),
  },
  {
    id: 'priority',
    label: 'Prioridade',
    options: Object.entries(PRIORITY).map(([value, { label }]) => ({ value, label })),
  },
  {
    id: 'source',
    label: 'Origem',
    options: LEAD_SOURCES.map((source) => ({ value: source, label: source })),
  },
]

const initialFilters = { status: ALL, priority: ALL, source: ALL }

const columns: DataTableColumn<Lead>[] = [
  {
    id: 'company',
    header: 'Empresa',
    cell: (lead) => <span className="font-semibold">{lead.company}</span>,
  },
  {
    id: 'segment',
    header: 'Segmento',
    cell: (lead) => <span className="text-muted-foreground">{lead.segment}</span>,
    className: 'hidden md:table-cell',
  },
  {
    id: 'source',
    header: 'Origem',
    cell: (lead) => <span className="text-muted-foreground">{lead.source}</span>,
    className: 'hidden lg:table-cell',
  },
  {
    id: 'status',
    header: 'Status',
    cell: (lead) => (
      <StatusBadge tone={LEAD_STATUS[lead.status].tone}>{LEAD_STATUS[lead.status].label}</StatusBadge>
    ),
  },
  {
    id: 'priority',
    header: 'Prioridade',
    cell: (lead) => (
      <StatusBadge tone={PRIORITY[lead.priority].tone}>{PRIORITY[lead.priority].label}</StatusBadge>
    ),
    className: 'hidden sm:table-cell',
  },
  {
    id: 'lastContact',
    header: 'Último contato',
    cell: (lead) => (
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        {formatDate(lead.lastContact)}
      </span>
    ),
    className: 'hidden xl:table-cell',
  },
  {
    id: 'nextActivity',
    header: 'Próxima atividade',
    cell: (lead) =>
      lead.nextActivity ? (
        <span className="font-mono text-xs tabular-nums">{formatDateTime(lead.nextActivity)}</span>
      ) : (
        <span className="text-xs text-muted-foreground">Sem agendamento</span>
      ),
    className: 'hidden lg:table-cell',
  },
]

export function LeadsView({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState('')
  const [values, setValues] = useState<Record<string, string>>(initialFilters)
  const [dialogOpen, setDialogOpen] = useState(false)

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase()
    return leads.filter(
      (lead) =>
        (!term || lead.company.toLowerCase().includes(term) || lead.segment.toLowerCase().includes(term)) &&
        (values.status === ALL || lead.status === values.status) &&
        (values.priority === ALL || lead.priority === values.priority) &&
        (values.source === ALL || lead.source === values.source),
    )
  }, [leads, query, values])

  const reset = () => {
    setQuery('')
    setValues(initialFilters)
  }

  return (
    <>
      <PageHeader
        eyebrow={<ModuleStatus />}
        title="Leads"
        description="Acompanhe novos contatos e qualifique oportunidades antes de levá-las ao pipeline."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus data-icon="inline-start" />
            Novo lead
          </Button>
        }
      />

      <FilterBar
        filters={filters}
        values={values}
        onChange={(id, value) => setValues((current) => ({ ...current, [id]: value }))}
        onReset={() => setValues(initialFilters)}
      >
        <SearchInput value={query} onChange={setQuery} placeholder="Buscar empresa ou segmento" label="Buscar leads" />
      </FilterBar>

      <DataTable
        caption="Lista de leads"
        columns={columns}
        rows={rows}
        getRowKey={(lead) => lead.id}
        footer={
          <span>
            {rows.length} de {leads.length} leads
          </span>
        }
        empty={
          <EmptyState
            icon={UserPlus}
            title="Nenhum lead encontrado"
            description="Ajuste a busca ou os filtros, ou cadastre um novo lead para começar."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" onClick={reset}>
                  Limpar filtros
                </Button>
                <Button size="sm" onClick={() => setDialogOpen(true)}>
                  <Plus data-icon="inline-start" />
                  Novo lead
                </Button>
              </div>
            }
          />
        }
      />

      <NewLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
