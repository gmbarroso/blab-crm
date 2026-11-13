import { requireOrganization } from "@/server/auth/session";
import type { Metadata } from 'next'
import { ContactsView } from '@/components/contacts/contacts-view'
import { ModuleStatus, PageContainer, PageHeader } from '@/components/shared/page-header'
import { getContacts } from '@/lib/data'

export const metadata: Metadata = { title: 'Contatos' }

export default async function ContactsPage() {
  await requireOrganization();
  const contacts = await getContacts()
  return (
    <PageContainer>
      <PageHeader
        eyebrow={<ModuleStatus />}
        title="Contatos"
        description="Pessoas de contato nas empresas que você atende."
      />
      <ContactsView contacts={contacts} />
    </PageContainer>
  )
}
