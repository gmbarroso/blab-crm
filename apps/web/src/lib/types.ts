export type Priority = 'alta' | 'media' | 'baixa'

export type LeadStatus =
  | 'novo'
  | 'em_contato'
  | 'qualificado'
  | 'desqualificado'
  | 'convertido'

export type LeadSource =
  | 'Instagram'
  | 'WhatsApp'
  | 'Indicação'
  | 'Site'
  | 'Prospecção ativa'
  | 'Evento'

export type PipelineStage =
  | 'novo_lead'
  | 'contato_realizado'
  | 'aguardando_resposta'
  | 'interessado'
  | 'demonstracao'
  | 'proposta_enviada'
  | 'negociacao'
  | 'ganho'
  | 'perdido'

export type ActivityType = 'ligacao' | 'reuniao' | 'email' | 'whatsapp' | 'tarefa' | 'demonstracao'

export type ActivityStatus = 'pendente' | 'atrasada' | 'concluida'

export interface Lead {
  id: string
  company: string
  segment: string
  source: LeadSource
  status: LeadStatus
  priority: Priority
  lastContact: string | null
  nextActivity: string | null
}

export interface Company {
  id: string
  name: string
  segment: string
  city: string
  state: string
  website: string | null
  description: string
  employees: string
  contactIds: string[]
}

export interface Contact {
  id: string
  name: string
  companyId: string
  role: string
  email: string
  whatsapp: string
  instagram: string | null
}

export interface Opportunity {
  id: string
  companyId: string
  title: string
  value: number
  priority: Priority
  stage: PipelineStage
  nextActivity: string | null
  owner: string
  updatedAt: string
}

export interface Activity {
  id: string
  title: string
  companyId: string
  type: ActivityType
  dueAt: string
  status: ActivityStatus
}

export interface CompanyEvent {
  id: string
  companyId: string
  description: string
  author: string
  at: string
}

export interface CompanyNote {
  id: string
  companyId: string
  content: string
  author: string
  at: string
}

export interface Metric {
  id: string
  label: string
  value: string
  change: number | null
  hint: string
}
