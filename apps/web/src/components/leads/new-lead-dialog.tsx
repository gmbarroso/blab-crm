'use client'

import { FormDialog } from '@/components/shared/form-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SEGMENTS } from '@/lib/constants'

const segmentItems = SEGMENTS.map((segment) => ({ value: segment, label: segment }))

export function NewLeadDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Novo lead"
      description="Cadastro rápido para registrar um novo contato comercial."
      submitLabel="Cadastrar lead"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-company">Nome da empresa</Label>
        <Input id="lead-company" name="company" required placeholder="Nome da empresa" autoComplete="organization" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-instagram">Instagram</Label>
          <Input id="lead-instagram" name="instagram" placeholder="@empresa" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-whatsapp">WhatsApp</Label>
          <Input id="lead-whatsapp" name="whatsapp" type="tel" inputMode="tel" placeholder="(11) 90000-0000" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-segment">Segmento</Label>
        <Select name="segment" items={segmentItems}>
          <SelectTrigger id="lead-segment" className="w-full">
            <SelectValue placeholder="Selecione um segmento" />
          </SelectTrigger>
          <SelectContent>
            {segmentItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-notes">Observações</Label>
        <Textarea id="lead-notes" name="notes" rows={3} placeholder="Contexto, interesses, como chegou até nós…" />
      </div>
    </FormDialog>
  )
}
