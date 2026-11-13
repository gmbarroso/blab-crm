import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MetricCard({
  label,
  value,
  change,
  hint,
}: {
  label: string
  value: string
  change: number | null
  hint: string
}) {
  const positive = change !== null && change >= 0
  const Arrow = positive ? ArrowUpRight : ArrowDownRight

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <div className="flex items-center gap-2 text-xs">
        {change !== null && <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-semibold tabular-nums',
            positive ? 'bg-success/12 text-success' : 'bg-destructive/10 text-destructive',
          )}
        >
          <Arrow className="size-3" aria-hidden="true" />
          {positive ? '+' : ''}
          {change.toLocaleString('pt-BR')}%
        </span>}
        <span className="text-muted-foreground">{hint}</span>
      </div>
    </div>
  )
}
