import type { Metadata } from 'next'
import { Plus } from 'lucide-react'
import { ActivitiesView } from '@/components/activities/activities-view'
import { DemoBadge, PageContainer, PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { getActivityGroups } from '@/lib/data'

export const metadata: Metadata = { title: 'Atividades' }

export default async function ActivitiesPage() {
  const groups = await getActivityGroups()
  return (
    <PageContainer>
      <PageHeader
        eyebrow={<DemoBadge />}
        title="Atividades"
        description="Ligações, reuniões e tarefas organizadas por prazo."
        actions={
          <Button disabled title="Disponível após integração com o backend">
            <Plus data-icon="inline-start" />
            Nova atividade
          </Button>
        }
      />
      <ActivitiesView groups={groups} />
    </PageContainer>
  )
}
