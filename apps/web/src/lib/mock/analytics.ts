import type { Metric } from '@/lib/types'

export const mockDashboardMetrics: Metric[] = [
  { id: 'pipeline', label: 'Valor em pipeline', value: 'R$ 214,6 mil', change: 12.4, hint: 'vs. mês anterior' },
  { id: 'new-leads', label: 'Novos leads', value: '48', change: 8.1, hint: 'últimos 30 dias' },
  { id: 'conversion', label: 'Taxa de conversão', value: '23,5%', change: -1.8, hint: 'lead → cliente' },
  { id: 'won', label: 'Receita ganha', value: 'R$ 34 mil', change: 18.2, hint: 'neste mês' },
]

export const mockRevenueByMonth = [
  { month: 'Jun', ganho: 18400, previsto: 26000 },
  { month: 'Jul', ganho: 22100, previsto: 28500 },
  { month: 'Ago', ganho: 19800, previsto: 30200 },
  { month: 'Set', ganho: 27600, previsto: 33800 },
  { month: 'Out', ganho: 28800, previsto: 36500 },
  { month: 'Nov', ganho: 34000, previsto: 41200 },
]

export const mockLeadsBySource = [
  { source: 'Instagram', leads: 18 },
  { source: 'Indicação', leads: 11 },
  { source: 'Site', leads: 8 },
  { source: 'WhatsApp', leads: 6 },
  { source: 'Prospecção', leads: 3 },
  { source: 'Evento', leads: 2 },
]

export const mockConversionFunnel = [
  { step: 'Leads', value: 48 },
  { step: 'Qualificados', value: 29 },
  { step: 'Propostas', value: 17 },
  { step: 'Ganhos', value: 11 },
]

export const mockConversionTrend = [
  { month: 'Jun', taxa: 18.2 },
  { month: 'Jul', taxa: 19.6 },
  { month: 'Ago', taxa: 21.1 },
  { month: 'Set', taxa: 24.8 },
  { month: 'Out', taxa: 25.3 },
  { month: 'Nov', taxa: 23.5 },
]
