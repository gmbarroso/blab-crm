'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FlaskConical } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { BrandMark, BrandWordmark } from '@/components/layout/brand-mark'
import { primaryNav, secondaryNav, type NavItem } from '@/components/layout/nav-config'

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={active}
                  tooltip={item.title}
                  render={
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => isMobile && setOpenMobile(false)}
                    />
                  }
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="B.lab CRM" render={<Link href="/dashboard" />}>
              <BrandMark />
              <BrandWordmark />
              <span className="sr-only">Ir para o dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Comercial" items={primaryNav} />
        <NavGroup label="Gestão" items={secondaryNav} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-start gap-2 rounded-lg border border-dashed p-3 text-xs leading-relaxed text-muted-foreground group-data-[collapsible=icon]:hidden">
          <FlaskConical className="mt-0.5 size-4 shrink-0 text-brand-violet" aria-hidden="true" />
          <p>
            <span className="font-semibold text-foreground">Modo demonstração.</span> Os dados exibidos
            são fictícios e nada é salvo.
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
