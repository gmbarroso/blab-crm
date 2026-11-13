'use client'

import { Loader2 } from 'lucide-react'
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

/** Sem um handler real, o envio permanece indisponível. */
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
  onSubmit?: (data: FormData) => void | Promise<void>
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
            if (!onSubmit) return
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
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit" disabled={!onSubmit || pending} title={!onSubmit ? "Cadastro em preparação" : undefined}>
              {pending && <Loader2 className="animate-spin" data-icon="inline-start" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
