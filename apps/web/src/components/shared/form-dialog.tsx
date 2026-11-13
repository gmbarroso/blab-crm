'use client'

import { FlaskConical, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/**
 * Generic form dialog. `onSubmit` receives the FormData and is where a real
 * API call will be plugged in later; today callers only show demo feedback.
 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = 'Salvar',
  onSubmit,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  submitLabel?: string
  onSubmit: (data: FormData) => void | Promise<void>
  children: React.ReactNode
}) {
  const [pending, setPending] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form
          className="flex flex-col gap-5"
          onSubmit={async (event) => {
            event.preventDefault()
            setPending(true)
            await onSubmit(new FormData(event.currentTarget))
            setPending(false)
            onOpenChange(false)
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="flex flex-col gap-4">{children}</div>
          <p className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            <FlaskConical className="size-3.5 shrink-0 text-brand-violet" aria-hidden="true" />
            Modo demonstração: os dados não serão salvos.
          </p>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" data-icon="inline-start" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
