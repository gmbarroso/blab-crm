'use client'

import { FileText, Handshake, History, Mail, MessageCircle, StickyNote, Users } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { OpportunityCard } from '@/components/shared/opportunity-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { PIPELINE_STAGES, STAGE_LABEL } from '@/lib/constants'
import { formatCurrency, formatDateTime, initials } from '@/lib/format'
import type { Company, CompanyEvent, CompanyNote, Contact, Opportunity } from '@/lib/types'

const stageTone = Object.fromEntries(PIPELINE_STAGES.map((stage) => [stage.id, stage.tone]))

export function CompanyDetailTabs({
  company,
  contacts,
  opportunities,
  events,
  notes,
}: {
  company: Company
  contacts: Contact[]
  opportunities: (Opportunity & { companyName: string })[]
  events: CompanyEvent[]
  notes: CompanyNote[]
}) {
  const openValue = opportunities
    .filter((opp) => opp.stage !== 'ganho' && opp.stage !== 'perdido')
    .reduce((sum, opp) => sum + opp.value, 0)

  return (
    <Tabs defaultValue="overview" className="gap-6">
      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <TabsList variant="line" className="w-max">
          <TabsTrigger value="overview">
            <FileText aria-hidden="true" /> Visão geral
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Users aria-hidden="true" /> Contatos
            <span className="font-mono text-xs text-muted-foreground">{contacts.length}</span>
          </TabsTrigger>
          <TabsTrigger value="opportunities">
            <Handshake aria-hidden="true" /> Oportunidades
            <span className="font-mono text-xs text-muted-foreground">{opportunities.length}</span>
          </TabsTrigger>
          <TabsTrigger value="history">
            <History aria-hidden="true" /> Histórico
          </TabsTrigger>
          <TabsTrigger value="notes">
            <StickyNote aria-hidden="true" /> Notas
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="grid gap-4 lg:grid-cols-3">
        <section className="flex flex-col gap-3 rounded-xl border bg-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold">Sobre a empresa</h2>
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{company.description}</p>
        </section>
        <dl className="grid grid-cols-2 gap-4 rounded-xl border bg-card p-5 text-sm">
          {[
            ['Segmento', company.segment],
            ['Porte', company.employees],
            ['Localização', `${company.city}, ${company.state}`],
            ['Site', company.website ?? '—'],
            ['Contatos', String(contacts.length)],
            ['Em aberto', formatCurrency(openValue)],
          ].map(([term, value]) => (
            <div key={term} className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">{term}</dt>
              <dd className="truncate font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </TabsContent>

      <TabsContent value="contacts">
        {contacts.length === 0 ? (
          <EmptyState icon={Users} title="Nenhum contato associado" description="Os contatos desta empresa aparecerão aqui." />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {contacts.map((contact) => (
              <li key={contact.id} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <Avatar>
                  <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                    {initials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-sm font-semibold">{contact.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{contact.role}</p>
                </div>
                <Button variant="ghost" size="icon-sm" render={<a href={`mailto:${contact.email}`} />}>
                  <Mail />
                  <span className="sr-only">Enviar e-mail para {contact.name}</span>
                </Button>
                <Button variant="ghost" size="icon-sm" disabled title="Disponível após integração">
                  <MessageCircle />
                  <span className="sr-only">WhatsApp (em preparação)</span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="opportunities">
        {opportunities.length === 0 ? (
          <EmptyState icon={Handshake} title="Nenhuma oportunidade" description="Ainda não há negociações com esta empresa." />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {opportunities.map((opp) => (
              <li key={opp.id} className="flex flex-col gap-2">
                <StatusBadge tone={stageTone[opp.stage]} className="self-start">
                  {STAGE_LABEL[opp.stage]}
                </StatusBadge>
                <OpportunityCard opportunity={opp} />
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="history">
        {events.length === 0 ? (
          <EmptyState icon={History} title="Sem histórico" description="Interações registradas aparecerão em ordem cronológica." />
        ) : (
          <ol className="flex flex-col rounded-xl border bg-card p-5">
            {events.map((event, index) => (
              <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                {index < events.length - 1 && (
                  <span className="absolute top-3 left-1 h-full w-px bg-border" aria-hidden="true" />
                )}
                <span className="relative mt-1.5 size-2 shrink-0 rounded-full bg-primary ring-4 ring-card" aria-hidden="true" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.author} · <time dateTime={event.at}>{formatDateTime(event.at)}</time>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </TabsContent>

      <TabsContent value="notes" className="flex flex-col gap-4">
        <form
          className="flex flex-col gap-2 rounded-xl border bg-card p-4"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <label htmlFor="new-note" className="sr-only">
            Nova nota
          </label>
          <Textarea id="new-note" name="note" disabled required rows={3} placeholder="Escreva uma nota sobre esta empresa…" />
          <div className="flex items-center justify-between gap-2">

            <Button type="submit" size="sm" disabled title="Notas em preparação">
              Adicionar nota
            </Button>
          </div>
        </form>
        {notes.length === 0 ? (
          <EmptyState icon={StickyNote} title="Nenhuma nota" description="Registre contexto e combinados com o cliente." />
        ) : (
          <ul className="flex flex-col gap-3">
            {notes.map((note) => (
              <li key={note.id} className="flex flex-col gap-2 rounded-xl border bg-card p-4">
                <p className="text-sm leading-relaxed">{note.content}</p>
                <p className="text-xs text-muted-foreground">
                  {note.author} · <time dateTime={note.at}>{formatDateTime(note.at)}</time>
                </p>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  )
}
