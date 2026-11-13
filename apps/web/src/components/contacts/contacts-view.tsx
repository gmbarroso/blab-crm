'use client'

import Link from 'next/link'
import { Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DataTable, type DataTableColumn } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { SearchInput } from '@/components/shared/search-input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials } from '@/lib/format'
import type { Contact } from '@/lib/types'

type Row = Contact & { companyName: string }

const columns: DataTableColumn<Row>[] = [
  {
    id: 'name',
    header: 'Nome',
    cell: (contact) => (
      <div className="flex items-center gap-3">
        <Avatar size="sm">
          <AvatarFallback className="bg-accent text-[11px] font-semibold text-accent-foreground">
            {initials(contact.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-semibold">{contact.name}</span>
          <span className="truncate text-xs text-muted-foreground sm:hidden">{contact.companyName}</span>
        </div>
      </div>
    ),
  },
  {
    id: 'company',
    header: 'Empresa',
    cell: (contact) => (
      <Link href={`/empresas/${contact.companyId}`} className="hover:text-primary hover:underline">
        {contact.companyName}
      </Link>
    ),
    className: 'hidden sm:table-cell',
  },
  {
    id: 'role',
    header: 'Cargo',
    cell: (contact) => <span className="text-muted-foreground">{contact.role}</span>,
    className: 'hidden md:table-cell',
  },
  {
    id: 'email',
    header: 'E-mail',
    cell: (contact) => (
      <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-foreground">
        {contact.email}
      </a>
    ),
    className: 'hidden lg:table-cell',
  },
  {
    id: 'whatsapp',
    header: 'WhatsApp',
    cell: (contact) => <span className="font-mono text-xs tabular-nums">{contact.whatsapp}</span>,
    className: 'hidden xl:table-cell',
  },
  {
    id: 'instagram',
    header: 'Instagram',
    cell: (contact) => (
      <span className="text-muted-foreground">{contact.instagram ?? '—'}</span>
    ),
    className: 'hidden xl:table-cell',
  },
]

export function ContactsView({ contacts }: { contacts: Row[] }) {
  const [query, setQuery] = useState('')
  const rows = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return contacts
    return contacts.filter((contact) =>
      [contact.name, contact.companyName, contact.role, contact.email].some((value) =>
        value.toLowerCase().includes(term),
      ),
    )
  }, [contacts, query])

  return (
    <>
      <SearchInput value={query} onChange={setQuery} placeholder="Buscar nome, empresa ou cargo" label="Buscar contatos" />
      <DataTable
        caption="Lista de contatos"
        columns={columns}
        rows={rows}
        getRowKey={(contact) => contact.id}
        footer={<span>{rows.length} contatos</span>}
        empty={
          <EmptyState icon={Users} title="Nenhum contato encontrado" description="Tente buscar por outro nome, empresa ou cargo." />
        }
      />
    </>
  )
}
