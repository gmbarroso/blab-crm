'use client'

import { CalendarCheck, Check } from 'lucide-react'
import { ActivityCard } from '@/components/shared/activity-card'
import { EmptyState } from '@/components/shared/empty-state'
import { ToneDot } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Tone } from '@/lib/constants'
import type { Activity } from '@/lib/types'

type Item = Activity & { companyName: string }
type GroupId = 'today' | 'overdue' | 'upcoming' | 'done'

const GROUPS: { id: GroupId; label: string; tone: Tone; empty: string }[] = [
  { id: 'today', label: 'Hoje', tone: 'primary', empty: 'Nenhuma atividade para hoje.' },
  { id: 'overdue', label: 'Atrasadas', tone: 'danger', empty: 'Tudo em dia — nenhuma atividade atrasada.' },
  { id: 'upcoming', label: 'Próximas', tone: 'cyan', empty: 'Nenhuma atividade agendada.' },
  { id: 'done', label: 'Concluídas', tone: 'success', empty: 'Nenhuma atividade concluída ainda.' },
]

export function ActivitiesView({ groups }: { groups: Record<GroupId, Item[]> }) {
  return (
    <Tabs defaultValue="today" className="gap-4">
      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <TabsList className="w-max">
          {GROUPS.map((group) => (
            <TabsTrigger key={group.id} value={group.id}>
              <ToneDot tone={group.tone} />
              {group.label}
              <span className="font-mono text-xs text-muted-foreground">{groups[group.id].length}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {GROUPS.map((group) => (
        <TabsContent key={group.id} value={group.id}>
          {groups[group.id].length === 0 ? (
            <EmptyState icon={CalendarCheck} title={`${group.label}: vazio`} description={group.empty} />
          ) : (
            <ul className="flex flex-col gap-2">
              {groups[group.id].map((activity) => (
                <li key={activity.id}>
                  <ActivityCard
                    activity={activity}
                    action={
                      activity.status !== 'concluida' && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled title="Conclusão de atividades em preparação"
                        >
                          <Check />
                          <span className="sr-only">Marcar “{activity.title}” como concluída</span>
                        </Button>
                      )
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
