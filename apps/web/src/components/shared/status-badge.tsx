import type { Tone } from '@/lib/constants'
import { cn } from '@/lib/utils'

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  cyan: 'bg-brand-cyan/15 text-foreground',
  violet: 'bg-brand-violet/12 text-brand-violet',
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/15 text-foreground',
  danger: 'bg-destructive/10 text-destructive',
}

const dotClasses: Record<Tone, string> = {
  neutral: 'bg-muted-foreground/60',
  primary: 'bg-primary',
  cyan: 'bg-brand-cyan',
  violet: 'bg-brand-violet',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
}

export function StatusBadge({
  tone,
  children,
  className,
}: {
  tone: Tone
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs font-medium whitespace-nowrap',
        toneClasses[tone],
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', dotClasses[tone])} aria-hidden="true" />
      {children}
    </span>
  )
}

export function ToneDot({ tone, className }: { tone: Tone; className?: string }) {
  return <span className={cn('size-2 rounded-full', dotClasses[tone], className)} aria-hidden="true" />
}
