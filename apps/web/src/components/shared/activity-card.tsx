import {
  CalendarCheck,
  CheckSquare,
  Mail,
  MessageCircle,
  Phone,
  Presentation,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { ACTIVITY_STATUS, ACTIVITY_TYPE } from '@/lib/constants'
import { formatDateTime } from '@/lib/format'
import type { Activity, ActivityType } from '@/lib/types'
import { cn } from '@/lib/utils'

const typeIcon: Record<ActivityType, LucideIcon> = {
  ligacao: Phone,
  reuniao: Users,
  email: Mail,
  whatsapp: MessageCircle,
  tarefa: CheckSquare,
  demonstracao: Presentation,
}

export function ActivityIcon({ type, className }: { type: ActivityType; className?: string }) {
  const Icon = typeIcon[type] ?? CalendarCheck
  return (
    <span
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground',
        className,
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </span>
  )
}

export function ActivityCard({
  activity,
  compact = false,
  action,
}: {
  activity: Activity & { companyName: string }
  compact?: boolean
  action?: React.ReactNode
}) {
  const status = ACTIVITY_STATUS[activity.status]
  const done = activity.status === 'concluida'

  return (
    <article
      className={cn(
        'flex items-center gap-3',
        !compact && 'rounded-lg border bg-card p-3 text-card-foreground',
      )}
    >
      <ActivityIcon type={activity.type} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className={cn('truncate text-sm font-semibold', done && 'text-muted-foreground line-through')}>
          {activity.title}
        </h3>
        <p className="truncate text-xs text-muted-foreground">
          {activity.companyName} · {ACTIVITY_TYPE[activity.type]}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <time dateTime={activity.dueAt} className="font-mono text-xs tabular-nums text-muted-foreground">
          {formatDateTime(activity.dueAt)}
        </time>
        {!compact && <StatusBadge tone={status.tone}>{status.label}</StatusBadge>}
      </div>
      {action}
    </article>
  )
}
