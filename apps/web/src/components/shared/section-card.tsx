import { cn } from '@/lib/utils'

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <section className={cn('flex min-w-0 flex-col rounded-xl border bg-card text-card-foreground', className)}>
      <header className="flex items-start justify-between gap-4 px-5 pt-5">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      <div className={cn('flex-1 p-5', contentClassName)}>{children}</div>
    </section>
  )
}
