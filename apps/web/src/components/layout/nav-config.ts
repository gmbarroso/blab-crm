import {
  BarChart3,
  Building2,
  CalendarCheck,
  KanbanSquare,
  LayoutDashboard,
  Settings,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export const primaryNav: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Leads', href: '/leads', icon: UserPlus },
  { title: 'Empresas', href: '/empresas', icon: Building2 },
  { title: 'Contatos', href: '/contatos', icon: Users },
  { title: 'Pipeline', href: '/pipeline', icon: KanbanSquare },
  { title: 'Atividades', href: '/atividades', icon: CalendarCheck },
]

export const secondaryNav: NavItem[] = [
  { title: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { title: 'Configurações', href: '/configuracoes', icon: Settings },
]

export const allNav = [...primaryNav, ...secondaryNav]

export function findNavItem(pathname: string) {
  return allNav.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
}
