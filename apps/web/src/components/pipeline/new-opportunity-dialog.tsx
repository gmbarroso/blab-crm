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
import { DEMO_TOAST, PIPELINE_STAGES, PRIORITY } from '@/lib/constants'

export interface Option {
  value: string
  label: string
}

const stageItems = PIPELINE_STAGES.filter((stage) => stage.id !== 'perdido').map((stage) => ({
  value: stage.id,
  label: stage.label,
}))
const priorityItems = Object.entries(PRIORITY).map(([value, { label }]) => ({ value, label }))

export function NewOpportunityButton({ companies, owners }: { companies: Option[]; owners: Option[] }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus data-icon="inline-start" />
        Nova oportunidade
      </Button>
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Nova oportunidade"
        description="Adicione um negócio ao pipeline comercial."
        submitLabel="Adicionar ao pipeline"
        onSubmit={async (data) => {
          await new Promise((resolve) => setTimeout(resolve, 500))
          toast.info(`Oportunidade "${data.get('title')}" simulada`, { description: DEMO_TOAST })
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="opp-title">Título</Label>
          <Input id="opp-title" name="title" required placeholder="Ex.: Gestão de tráfego pago" />
        </div>
        <SelectField id="opp-company" name="companyId" label="Empresa" items={companies} placeholder="Selecione a empresa" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="opp-value">Valor estimado (R$)</Label>
            <Input id="opp-value" name="value" type="number" inputMode="decimal" min={0} step={100} placeholder="5000" required />
          </div>
          <SelectField id="opp-priority" name="priority" label="Prioridade" items={priorityItems} defaultValue="media" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField id="opp-stage" name="stage" label="Etapa inicial" items={stageItems} defaultValue={stageItems[0]?.value} />
          <SelectField id="opp-owner" name="owner" label="Responsável" items={owners} defaultValue={owners[0]?.value} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="opp-next">Próxima atividade</Label>
          <Input id="opp-next" name="nextActivity" placeholder="Ex.: Agendar reunião de diagnóstico" />
        </div>
      </FormDialog>
    </>
  )
}

function SelectField({
  id,
  name,
  label,
  items,
  placeholder = 'Selecione',
  defaultValue,
}: {
  id: string
  name: string
  label: string
  items: Option[]
  placeholder?: string
  defaultValue?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select name={name} items={items} defaultValue={defaultValue}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
