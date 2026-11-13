import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  className,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  eyebrow?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow}
        <h1 className="text-2xl font-bold tracking-tight text-balance">{title}</h1>
        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8', className)}>
      {children}
    </div>
  )
}

export function ModuleStatus() {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-dashed px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
      <span className="size-1.5 rounded-full bg-brand-violet" aria-hidden="true" />
      Em preparação
    </span>
  )
}
