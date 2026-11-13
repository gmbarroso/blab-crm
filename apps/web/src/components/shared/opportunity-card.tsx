import { CalendarClock, GripVertical } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { PRIORITY } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import type { Opportunity } from '@/lib/types'
import { cn } from '@/lib/utils'

export type OpportunityCardData = Pick<
  Opportunity,
  'id' | 'title' | 'value' | 'priority' | 'nextActivity' | 'stage'
> & { companyName: string }

/**
 * Presentational card. Exposes `data-opportunity-id`/`data-stage` and accepts
 * drag handle props so a DnD library (e.g. dnd-kit) can be wired in later.
 */
export function OpportunityCard({
  opportunity,
  draggable = false,
  dragHandleProps,
  className,
}: {
  opportunity: OpportunityCardData
  draggable?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
  className?: string
}) {
  const priority = PRIORITY[opportunity.priority]

  return (
    <article
      data-opportunity-id={opportunity.id}
      data-stage={opportunity.stage}
      className={cn(
        'group/card flex flex-col gap-3 rounded-lg border bg-card p-3 text-card-foreground transition-colors hover:border-primary/40',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-xs font-medium text-muted-foreground">{opportunity.companyName}</p>
          <h3 className="text-sm leading-snug font-semibold text-pretty">{opportunity.title}</h3>
        </div>
        {draggable && (
          <button
            type="button"
            className="-mr-1 flex size-6 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground/50 opacity-0 transition-opacity group-hover/card:opacity-100 hover:bg-muted hover:text-foreground focus-visible:opacity-100"
            aria-label={`Mover ${opportunity.title}`}
            {...dragHandleProps}
          >
            <GripVertical className="size-4" />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-semibold tabular-nums">
          {formatCurrency(opportunity.value)}
        </span>
        <StatusBadge tone={priority.tone}>{priority.label}</StatusBadge>
      </div>
      {opportunity.nextActivity && (
        <p className="flex items-center gap-1.5 border-t pt-2.5 text-xs text-muted-foreground">
          <CalendarClock className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{opportunity.nextActivity}</span>
        </p>
      )}
    </article>
  )
}
