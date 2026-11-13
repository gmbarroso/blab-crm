'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { FormDialog } from '@/components/shared/form-dialog'
import { Button } from '@/components/ui/button'
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
import { DEMO_TOAST, SEGMENTS } from '@/lib/constants'

const segmentItems = SEGMENTS.map((segment) => ({ value: segment, label: segment }))
const sizeItems = ['1–10', '11–50', '51–200', '201–500', '500+'].map((size) => ({
  value: size,
  label: `${size} funcionários`,
}))

export function NewCompanyButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus data-icon="inline-start" />
        Nova empresa
      </Button>
      <NewCompanyDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

function NewCompanyDialog({
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
      title="Nova empresa"
      description="Cadastre uma conta de cliente ou prospect."
      submitLabel="Cadastrar empresa"
      onSubmit={async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        toast.info(`Empresa "${data.get('name')}" simulada`, { description: DEMO_TOAST })
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="company-name">Nome da empresa</Label>
        <Input id="company-name" name="name" required placeholder="Ex.: Studio Aurora" autoComplete="organization" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="company-segment">Segmento</Label>
          <Select name="segment" items={segmentItems} required>
            <SelectTrigger id="company-segment" className="w-full">
              <SelectValue placeholder="Selecione" />
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
          <Label htmlFor="company-size">Porte</Label>
          <Select name="employees" items={sizeItems}>
            <SelectTrigger id="company-size" className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {sizeItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_6rem]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="company-city">Cidade</Label>
          <Input id="company-city" name="city" placeholder="São Paulo" autoComplete="address-level2" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="company-state">UF</Label>
          <Input id="company-state" name="state" placeholder="SP" maxLength={2} className="uppercase" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="company-website">Site</Label>
        <Input id="company-website" name="website" type="url" placeholder="https://empresa.com.br" autoComplete="url" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="company-description">Descrição</Label>
        <Textarea id="company-description" name="description" rows={3} placeholder="O que a empresa faz e qual o potencial de negócio…" />
      </div>
    </FormDialog>
  )
}
