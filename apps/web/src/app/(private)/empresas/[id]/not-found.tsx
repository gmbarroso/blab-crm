import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { PageContainer } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'

export default function CompanyNotFound() {
  return (
    <PageContainer>
      <EmptyState
        icon={Building2}
        title="Empresa não encontrada"
        description="Ela pode ter sido removida ou o endereço está incorreto."
        action={<Button nativeButton={false} render={<Link href="/empresas" />}>Voltar para empresas</Button>}
      />
    </PageContainer>
  )
}
