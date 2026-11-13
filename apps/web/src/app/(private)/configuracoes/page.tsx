import type { Metadata } from 'next'
import { PageContainer, PageHeader } from '@/components/shared/page-header'
import { SettingsView } from '@/components/settings/settings-view'

export const metadata: Metadata = { title: 'Configurações' }

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader title="Configurações" description="Gerencie seu perfil, organização e preferências." />
      <SettingsView />
    </PageContainer>
  )
}
