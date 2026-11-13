import type {
  ActivityStatus,
  ActivityType,
  LeadSource,
  LeadStatus,
  PipelineStage,
  Priority,
} from '@/lib/types'

export type Tone = 'neutral' | 'primary' | 'cyan' | 'violet' | 'success' | 'warning' | 'danger'

export const LEAD_STATUS: Record<LeadStatus, { label: string; tone: Tone }> = {
  novo: { label: 'Novo', tone: 'primary' },
  em_contato: { label: 'Em contato', tone: 'cyan' },
  qualificado: { label: 'Qualificado', tone: 'violet' },
  convertido: { label: 'Convertido', tone: 'success' },
  desqualificado: { label: 'Desqualificado', tone: 'neutral' },
}

export const PRIORITY: Record<Priority, { label: string; tone: Tone }> = {
  alta: { label: 'Alta', tone: 'danger' },
  media: { label: 'Média', tone: 'warning' },
  baixa: { label: 'Baixa', tone: 'neutral' },
}

export const LEAD_SOURCES: LeadSource[] = [
  'Instagram',
  'WhatsApp',
  'Indicação',
  'Site',
  'Prospecção ativa',
  'Evento',
]

export const PIPELINE_STAGES: { id: PipelineStage; label: string; tone: Tone }[] = [
  { id: 'novo_lead', label: 'Novo lead', tone: 'neutral' },
  { id: 'contato_realizado', label: 'Contato realizado', tone: 'primary' },
  { id: 'aguardando_resposta', label: 'Aguardando resposta', tone: 'warning' },
  { id: 'interessado', label: 'Interessado', tone: 'cyan' },
  { id: 'demonstracao', label: 'Demonstração apresentada', tone: 'cyan' },
  { id: 'proposta_enviada', label: 'Proposta enviada', tone: 'violet' },
  { id: 'negociacao', label: 'Negociação', tone: 'violet' },
  { id: 'ganho', label: 'Ganho', tone: 'success' },
  { id: 'perdido', label: 'Perdido', tone: 'danger' },
]

export const STAGE_LABEL = Object.fromEntries(
  PIPELINE_STAGES.map((stage) => [stage.id, stage.label]),
) as Record<PipelineStage, string>

export const ACTIVITY_TYPE: Record<ActivityType, string> = {
  ligacao: 'Ligação',
  reuniao: 'Reunião',
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  tarefa: 'Tarefa',
  demonstracao: 'Demonstração',
}

export const ACTIVITY_STATUS: Record<ActivityStatus, { label: string; tone: Tone }> = {
  pendente: { label: 'Pendente', tone: 'primary' },
  atrasada: { label: 'Atrasada', tone: 'danger' },
  concluida: { label: 'Concluída', tone: 'success' },
}

export const SEGMENTS = [
  'Varejo',
  'Saúde',
  'Educação',
  'Alimentação',
  'Tecnologia',
  'Serviços',
  'Indústria',
  'Beleza e estética',
]
