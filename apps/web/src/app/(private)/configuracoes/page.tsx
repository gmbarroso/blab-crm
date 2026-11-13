import type { Metadata } from 'next'
import { PageContainer, PageHeader } from '@/components/shared/page-header'
import { SettingsView } from '@/components/settings/settings-view'
import { requireOrganization } from '@/server/auth/session'

export const metadata: Metadata = { title: 'Configurações' }

export default async function SettingsPage() {
  const { user, organization, membership } = await requireOrganization()
  return (
    <PageContainer>
      <PageHeader title="Configurações" description="Consulte seu perfil e organização e ajuste o tema da interface." />
      <SettingsView user={{ name: user.name, email: user.email }} organization={organization.name} role={membership.role} />
    </PageContainer>
  )
}
