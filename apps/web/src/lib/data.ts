import 'server-only'

import { PIPELINE_STAGES } from '@/lib/constants'
import type { Activity, Company, CompanyEvent, CompanyNote, Contact, Lead, Metric, Opportunity } from '@/lib/types'

// Módulos comerciais ainda sem persistência: exibem estados vazios, sem fixtures.
export type WithCompany<T> = T & { companyName: string }

type CompanyDetail = {
  company: Company
  contacts: Contact[]
  opportunities: WithCompany<Opportunity>[]
  events: CompanyEvent[]
  notes: CompanyNote[]
}

export async function getDashboardMetrics(): Promise<Metric[]> {
  return [
    { id: 'pipeline', label: 'Valor em pipeline', value: '—', change: null, hint: 'Sem dados' },
    { id: 'new-leads', label: 'Novos leads', value: '—', change: null, hint: 'Sem dados' },
    { id: 'conversion', label: 'Taxa de conversão', value: '—', change: null, hint: 'Sem dados' },
    { id: 'won', label: 'Receita ganha', value: '—', change: null, hint: 'Sem dados' },
  ]
}

export async function getLeads(): Promise<Lead[]> { return [] }
export async function getCompanies(): Promise<Company[]> { return [] }
export async function getContacts(): Promise<WithCompany<Contact>[]> { return [] }
export async function getOpportunities(): Promise<WithCompany<Opportunity>[]> { return [] }

export async function getCompany(id: string): Promise<Company | null> {
  return (await getCompanies()).find((company) => company.id === id) ?? null
}

export async function getCompanyDetail(id: string): Promise<CompanyDetail | null> {
  const company = await getCompany(id)
  return company ? { company, contacts: [], opportunities: [], events: [], notes: [] } : null
}

export async function getRecentOpportunities(limit = 5) {
  return (await getOpportunities()).slice(0, limit)
}

export async function getPipelineColumns() {
  return PIPELINE_STAGES.map((stage) => ({ ...stage, items: [] as WithCompany<Opportunity>[], total: 0 }))
}

export async function getActivityGroups(): Promise<Record<'today' | 'overdue' | 'upcoming' | 'done', WithCompany<Activity>[]>> {
  return { today: [], overdue: [], upcoming: [], done: [] }
}

export async function getUpcomingActivities(limit = 5) {
  const groups = await getActivityGroups()
  return [...groups.today, ...groups.overdue, ...groups.upcoming].slice(0, limit)
}

export async function getReports() {
  return {
    conversionTrend: [] as { month: string; taxa: number }[],
    conversionFunnel: [] as { step: string; value: number }[],
    leadsBySource: [] as { source: string; leads: number }[],
    revenueByMonth: [] as { month: string; ganho: number; previsto: number }[],
    opportunitiesByStage: [] as { stage: string; quantidade: number; valor: number }[],
  }
}

export async function getRevenueByMonth() { return (await getReports()).revenueByMonth }
