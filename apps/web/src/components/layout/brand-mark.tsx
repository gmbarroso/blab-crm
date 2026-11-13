import Image from 'next/image'
import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-card',
        className,
      )}
    >
      <Image
        src="/brand/blab-frasco-light.png"
        alt=""
        width={64}
        height={64}
        className="size-full object-contain p-0.5 dark:hidden"
        priority
      />
      <Image
        src="/brand/blab-frasco-dark.png"
        alt=""
        width={64}
        height={64}
        className="hidden size-full object-cover dark:block"
        priority
      />
    </span>
  )
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-baseline gap-1.5 leading-none', className)}>
      <span className="text-base font-extrabold tracking-tight text-foreground">
        B<span className="text-brand-cyan">.</span>lab
      </span>
      <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        CRM
      </span>
    </span>
  )
}
