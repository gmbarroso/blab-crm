import 'server-only'

import { PIPELINE_STAGES } from '@/lib/constants'
import {
  mockConversionFunnel,
  mockConversionTrend,
  mockDashboardMetrics,
  mockLeadsBySource,
  mockRevenueByMonth,
} from '@/lib/mock/analytics'
import { mockActivities, mockLeads, mockOpportunities } from '@/lib/mock/commercial'
import {
  mockCompanies,
  mockCompanyEvents,
  mockCompanyNotes,
  mockContacts,
} from '@/lib/mock/companies'
import type { Activity, Company, Contact, Opportunity } from '@/lib/types'

/**
 * Data access layer. Every function returns demo data today and is the single
 * seam to replace with real API/database calls when the backend is integrated.
 */

export const DEMO_TODAY = '2026-11-12'

export type WithCompany<T> = T & { companyName: string }

function companyName(companyId: string) {
  return mockCompanies.find((company) => company.id === companyId)?.name ?? 'Empresa removida'
}

function withCompany<T extends { companyId: string }>(item: T): WithCompany<T> {
  return { ...item, companyName: companyName(item.companyId) }
}

export async function getDashboardMetrics() {
  return mockDashboardMetrics
}

export async function getLeads() {
  return mockLeads
}

export async function getCompanies() {
  return mockCompanies
}

export async function getCompany(id: string) {
  return mockCompanies.find((company) => company.id === id) ?? null
}

export async function getContacts(): Promise<WithCompany<Contact>[]> {
  return mockContacts.map(withCompany)
}

export async function getCompanyDetail(id: string) {
  const company: Company | undefined = mockCompanies.find((item) => item.id === id)
  if (!company) return null
  return {
    company,
    contacts: mockContacts.filter((contact) => contact.companyId === id),
    opportunities: mockOpportunities.filter((opp) => opp.companyId === id).map(withCompany),
    events: mockCompanyEvents.filter((event) => event.companyId === id),
    notes: mockCompanyNotes.filter((note) => note.companyId === id),
  }
}

export async function getOpportunities(): Promise<WithCompany<Opportunity>[]> {
  return mockOpportunities.map(withCompany)
}

export async function getRecentOpportunities(limit = 5) {
  return [...mockOpportunities]
    .filter((opp) => opp.stage !== 'perdido')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)
    .map(withCompany)
}

export async function getPipelineColumns() {
  return PIPELINE_STAGES.map((stage) => {
    const items = mockOpportunities.filter((opp) => opp.stage === stage.id).map(withCompany)
    return {
      ...stage,
      items,
      total: items.reduce((sum, opp) => sum + opp.value, 0),
    }
  })
}

export async function getActivityGroups() {
  const activities = mockActivities.map(withCompany)
  const isToday = (activity: Activity) => activity.dueAt.startsWith(DEMO_TODAY)
  const byDate = (a: Activity, b: Activity) => a.dueAt.localeCompare(b.dueAt)

  return {
    today: activities.filter((a) => a.status === 'pendente' && isToday(a)).sort(byDate),
    overdue: activities.filter((a) => a.status === 'atrasada').sort(byDate),
    upcoming: activities
      .filter((a) => a.status === 'pendente' && a.dueAt.slice(0, 10) > DEMO_TODAY)
      .sort(byDate),
    done: activities.filter((a) => a.status === 'concluida').sort(byDate).reverse(),
  }
}

export async function getUpcomingActivities(limit = 5) {
  return mockActivities
    .filter((activity) => activity.status !== 'concluida')
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    .slice(0, limit)
    .map(withCompany)
}

export async function getReports() {
  const columns = await getPipelineColumns()
  return {
    conversionTrend: mockConversionTrend,
    conversionFunnel: mockConversionFunnel,
    leadsBySource: mockLeadsBySource,
    revenueByMonth: mockRevenueByMonth,
    opportunitiesByStage: columns.map((column) => ({
      stage: column.label,
      quantidade: column.items.length,
      valor: column.total,
    })),
  }
}

export async function getRevenueByMonth() {
  return mockRevenueByMonth
}
