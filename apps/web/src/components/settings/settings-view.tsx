'use client'

import { Building2, Monitor, Moon, Palette, SlidersHorizontal, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEMO_TOAST } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { initials } from '@/lib/format'
import type { OrganizationRole } from '@blab/types'

function Panel({
  title,
  description,
  children,
  demoSave = true,
}: {
  title: string
  description: string
  children: React.ReactNode
  demoSave?: boolean
}) {
  return (
    <form
      className="flex flex-col rounded-xl border bg-card"
      onSubmit={(event) => {
        event.preventDefault()
        toast.info('Alterações simuladas', { description: DEMO_TOAST })
      }}
    >
      <header className="flex flex-col gap-0.5 border-b px-5 py-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </header>
      <div className="flex flex-col gap-5 p-5">{children}</div>
      {demoSave && (
        <footer className="flex items-center justify-between gap-3 border-t px-5 py-3">
          <span className="text-xs text-muted-foreground">Modo demonstração — nada será salvo.</span>
          <Button type="submit" size="sm">
            Salvar alterações
          </Button>
        </footer>
      )}
    </form>
  )
}

function Field({ id, label, ...props }: { id: string; label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  )
}

const PREFERENCES = [
  { id: 'pref-email', label: 'Resumo diário por e-mail', description: 'Receba as atividades do dia às 8h.', defaultChecked: false },
  { id: 'pref-overdue', label: 'Alertas de atividades atrasadas', description: 'Notificação quando um prazo vencer.', defaultChecked: false },
  { id: 'pref-pipeline', label: 'Movimentações no pipeline', description: 'Aviso quando uma oportunidade mudar de etapa.', defaultChecked: false },
  { id: 'pref-compact', label: 'Tabelas compactas', description: 'Reduz o espaçamento das listagens.', defaultChecked: false },
]

const THEMES = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

export function SettingsView({ user, organization, role }: {
  user: { name: string; email: string }
  organization: string
  role: OrganizationRole
}) {
  const { theme, setTheme } = useTheme()

  return (
    <Tabs defaultValue="profile" className="gap-6">
      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <TabsList variant="line" className="w-max">
          <TabsTrigger value="profile"><User aria-hidden="true" /> Perfil</TabsTrigger>
          <TabsTrigger value="organization"><Building2 aria-hidden="true" /> Organização</TabsTrigger>
          <TabsTrigger value="appearance"><Palette aria-hidden="true" /> Aparência</TabsTrigger>
          <TabsTrigger value="preferences"><SlidersHorizontal aria-hidden="true" /> Preferências</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="profile" className="max-w-2xl">
        <Panel title="Perfil" description="Suas informações pessoais exibidas para a equipe.">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback className="bg-primary font-semibold text-primary-foreground">{initials(user.name)}</AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" size="sm" disabled title="Disponível após integração">
              Alterar foto
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="profile-name" label="Nome" defaultValue={user.name} autoComplete="name" />
            <Field id="profile-role" label="Perfil de acesso" value={{ OWNER: "Proprietário", ADMIN: "Administrador", MEMBER: "Membro" }[role]} readOnly />
          </div>
          <Field id="profile-email" label="E-mail" type="email" defaultValue={user.email} autoComplete="email" />
        </Panel>
      </TabsContent>

      <TabsContent value="organization" className="max-w-2xl">
        <Panel title="Organização" description="Dados da empresa usados no CRM.">
          <Field id="org-name" label="Nome da organização" defaultValue={organization} autoComplete="organization" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="org-doc" label="CNPJ" placeholder="Não informado" inputMode="numeric" />
            <Field id="org-site" label="Site" placeholder="Não informado" />
          </div>
          <Field id="org-currency" label="Moeda padrão" defaultValue="Real brasileiro (BRL)" disabled />
        </Panel>
      </TabsContent>

      <TabsContent value="appearance" className="max-w-2xl">
        <Panel
          title="Aparência"
          description="O tema é aplicado imediatamente e guardado apenas neste navegador."
          demoSave={false}
        >
          <RadioGroup
            value={theme ?? 'system'}
            onValueChange={(value) => setTheme(String(value))}
            aria-label="Tema da interface"
            className="grid gap-3 sm:grid-cols-3"
          >
            {THEMES.map(({ value, label, icon: Icon }) => (
              <Label
                key={value}
                htmlFor={`theme-${value}`}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal transition-colors hover:bg-muted/60',
                  theme === value && 'border-primary bg-accent/50',
                )}
              >
                <RadioGroupItem id={`theme-${value}`} value={value} />
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                {label}
              </Label>
            ))}
          </RadioGroup>
        </Panel>
      </TabsContent>

      <TabsContent value="preferences" className="max-w-2xl">
        <Panel title="Preferências" description="Notificações e comportamento da interface.">
          <ul className="flex flex-col divide-y">
            {PREFERENCES.map((pref) => (
              <li key={pref.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor={pref.id}>{pref.label}</Label>
                  <p className="text-xs text-muted-foreground">{pref.description}</p>
                </div>
                <Switch id={pref.id} defaultChecked={pref.defaultChecked} />
              </li>
            ))}
          </ul>
        </Panel>
      </TabsContent>
    </Tabs>
  )
}
