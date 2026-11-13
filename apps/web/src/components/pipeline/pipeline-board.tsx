import { Inbox } from 'lucide-react'
import { OpportunityCard, type OpportunityCardData } from '@/components/shared/opportunity-card'
import { ToneDot } from '@/components/shared/status-badge'
import type { Tone } from '@/lib/constants'
import { formatCompactCurrency } from '@/lib/format'
import type { PipelineStage } from '@/lib/types'

export interface PipelineColumn {
  id: PipelineStage
  label: string
  tone: Tone
  total: number
  items: OpportunityCardData[]
}

/**
 * Columns are rendered as droppable regions (`data-droppable-stage`) and cards
 * expose drag handles, so a DnD library can be layered on without restructuring.
 */
export function PipelineBoard({ columns }: { columns: PipelineColumn[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
      <ol className="flex w-max gap-3" aria-label="Etapas do pipeline">
        {columns.map((column) => (
          <li
            key={column.id}
            data-droppable-stage={column.id}
            className="flex w-72 shrink-0 flex-col rounded-xl border bg-muted/40"
          >
            <header className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
              <h2 className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                <ToneDot tone={column.tone} />
                <span className="truncate">{column.label}</span>
                <span className="rounded bg-background px-1.5 font-mono text-xs font-medium text-muted-foreground">
                  {column.items.length}
                </span>
              </h2>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {formatCompactCurrency(column.total)}
              </span>
            </header>
            <div className="flex min-h-40 flex-1 flex-col gap-2 p-2">
              {column.items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground">
                  <Inbox className="size-4" aria-hidden="true" />
                  Nenhuma oportunidade
                </div>
              ) : (
                column.items.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} draggable />
                ))
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
