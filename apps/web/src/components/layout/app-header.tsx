'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Bell, LogOut, Search, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { findNavItem } from '@/components/layout/nav-config'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { logout } from '@/features/auth/actions'


interface AppHeaderProps {
  user: { name: string; email: string }
  organization: string
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function AppHeader({ user, organization }: AppHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const current = findNavItem(pathname)

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:px-6">
      <SidebarTrigger className="-ml-1" aria-label="Alternar menu lateral" />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <p className="truncate text-sm font-semibold">{current?.title ?? 'B.lab CRM'}</p>

      <form
        role="search"
        className="relative ml-auto hidden w-full max-w-xs md:block"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <label htmlFor="global-search" className="sr-only">
          Buscar no CRM
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input id="global-search" placeholder="Buscar leads, empresas…" className="h-9 pl-8" disabled title="Busca global em preparação" />
      </form>

      <div className="ml-auto flex items-center gap-1 md:ml-2">
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Buscar" disabled title="Busca global em preparação">
          <Search />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notificações" disabled title="Notificações em preparação">
          <Bell />
        </Button>
        <ThemeToggle />
        <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />
        <div className="hidden flex-col items-end leading-tight sm:flex">
          <span className="max-w-40 truncate text-xs font-semibold">{organization}</span>
          <span className="text-[11px] text-muted-foreground">Organização</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Menu do usuário" />
            }
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
                <span className="truncate">{user.email}</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/configuracoes')}>
                <User /> Meu perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/configuracoes')}>
                <Settings /> Preferências
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => void logout()}>
              <LogOut /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
