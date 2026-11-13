import type { Activity, Lead, Opportunity } from '@/lib/types'

export const mockLeads: Lead[] = [
  { id: 'lead-01', company: 'Café Tropeiro', segment: 'Alimentação', source: 'Instagram', status: 'novo', priority: 'alta', lastContact: null, nextActivity: '2026-11-13T13:00:00Z' },
  { id: 'lead-02', company: 'Academia Movimento', segment: 'Saúde', source: 'Indicação', status: 'em_contato', priority: 'media', lastContact: '2026-11-10T15:00:00Z', nextActivity: '2026-11-14T10:00:00Z' },
  { id: 'lead-03', company: 'Livraria Página 9', segment: 'Varejo', source: 'Site', status: 'qualificado', priority: 'alta', lastContact: '2026-11-11T09:30:00Z', nextActivity: '2026-11-12T16:00:00Z' },
  { id: 'lead-04', company: 'Pet Shop Amigo Fiel', segment: 'Varejo', source: 'WhatsApp', status: 'em_contato', priority: 'baixa', lastContact: '2026-11-06T11:00:00Z', nextActivity: null },
  { id: 'lead-05', company: 'Instituto Saber Mais', segment: 'Educação', source: 'Evento', status: 'qualificado', priority: 'media', lastContact: '2026-11-09T14:00:00Z', nextActivity: '2026-11-18T09:00:00Z' },
  { id: 'lead-06', company: 'Barbearia Navalha', segment: 'Beleza e estética', source: 'Instagram', status: 'novo', priority: 'media', lastContact: null, nextActivity: '2026-11-13T17:00:00Z' },
  { id: 'lead-07', company: 'Construtora Pilar', segment: 'Indústria', source: 'Prospecção ativa', status: 'desqualificado', priority: 'baixa', lastContact: '2026-10-30T10:00:00Z', nextActivity: null },
  { id: 'lead-08', company: 'Hamburgueria Brasa', segment: 'Alimentação', source: 'Instagram', status: 'convertido', priority: 'alta', lastContact: '2026-11-08T18:00:00Z', nextActivity: '2026-11-20T15:00:00Z' },
  { id: 'lead-09', company: 'Ótica Visão Clara', segment: 'Saúde', source: 'Site', status: 'em_contato', priority: 'media', lastContact: '2026-11-07T13:20:00Z', nextActivity: '2026-11-15T11:00:00Z' },
  { id: 'lead-10', company: 'Floricultura Jardim', segment: 'Varejo', source: 'WhatsApp', status: 'novo', priority: 'baixa', lastContact: null, nextActivity: null },
  { id: 'lead-11', company: 'Data Sul Sistemas', segment: 'Tecnologia', source: 'Indicação', status: 'qualificado', priority: 'alta', lastContact: '2026-11-11T16:40:00Z', nextActivity: '2026-11-13T14:30:00Z' },
  { id: 'lead-12', company: 'Lavanderia Express', segment: 'Serviços', source: 'Prospecção ativa', status: 'em_contato', priority: 'media', lastContact: '2026-11-04T10:15:00Z', nextActivity: '2026-11-16T10:00:00Z' },
]

export const mockOpportunities: Opportunity[] = [
  { id: 'opp-01', companyId: 'cmp-09', title: 'Gestão de redes sociais', value: 4800, priority: 'media', stage: 'novo_lead', nextActivity: 'Ligação de qualificação', owner: 'Ana Beatriz', updatedAt: '2026-11-11T10:00:00Z' },
  { id: 'opp-02', companyId: 'cmp-04', title: 'Identidade visual completa', value: 7200, priority: 'baixa', stage: 'novo_lead', nextActivity: 'Enviar portfólio', owner: 'Pedro Henrique', updatedAt: '2026-11-10T13:00:00Z' },
  { id: 'opp-03', companyId: 'cmp-06', title: 'Catálogo digital de produtos', value: 9500, priority: 'media', stage: 'contato_realizado', nextActivity: 'Agendar diagnóstico', owner: 'Ana Beatriz', updatedAt: '2026-11-09T15:30:00Z' },
  { id: 'opp-04', companyId: 'cmp-10', title: 'Campanha de captação de pacientes', value: 12000, priority: 'alta', stage: 'contato_realizado', nextActivity: 'Reunião com diretoria', owner: 'Lucas Andrade', updatedAt: '2026-11-11T09:00:00Z' },
  { id: 'opp-05', companyId: 'cmp-08', title: 'Site institucional B2B', value: 18000, priority: 'media', stage: 'aguardando_resposta', nextActivity: 'Follow-up por e-mail', owner: 'Pedro Henrique', updatedAt: '2026-11-04T11:00:00Z' },
  { id: 'opp-06', companyId: 'cmp-02', title: 'Agendamento online integrado', value: 15600, priority: 'alta', stage: 'interessado', nextActivity: 'Preparar demonstração', owner: 'Lucas Andrade', updatedAt: '2026-11-10T17:20:00Z' },
  { id: 'opp-07', companyId: 'cmp-07', title: 'Parceria white label', value: 32000, priority: 'alta', stage: 'demonstracao', nextActivity: 'Coletar feedback técnico', owner: 'Ana Beatriz', updatedAt: '2026-11-11T14:00:00Z' },
  { id: 'opp-08', companyId: 'cmp-03', title: 'Plataforma de matrículas', value: 26500, priority: 'media', stage: 'demonstracao', nextActivity: 'Apresentar à coordenação', owner: 'Pedro Henrique', updatedAt: '2026-11-08T10:30:00Z' },
  { id: 'opp-09', companyId: 'cmp-01', title: 'Rebranding para nova unidade', value: 21000, priority: 'alta', stage: 'proposta_enviada', nextActivity: 'Revisar proposta com sócia', owner: 'Ana Beatriz', updatedAt: '2026-11-10T14:20:00Z' },
  { id: 'opp-10', companyId: 'cmp-05', title: 'Portal do cliente', value: 44000, priority: 'alta', stage: 'negociacao', nextActivity: 'Ajustar condições de pagamento', owner: 'Lucas Andrade', updatedAt: '2026-11-11T16:00:00Z' },
  { id: 'opp-11', companyId: 'cmp-06', title: 'Gestão de tráfego pago', value: 6000, priority: 'baixa', stage: 'ganho', nextActivity: 'Kickoff do projeto', owner: 'Pedro Henrique', updatedAt: '2026-11-07T12:00:00Z' },
  { id: 'opp-12', companyId: 'cmp-09', title: 'E-commerce de orgânicos', value: 28000, priority: 'media', stage: 'ganho', nextActivity: 'Reunião de onboarding', owner: 'Ana Beatriz', updatedAt: '2026-11-03T09:00:00Z' },
  { id: 'opp-13', companyId: 'cmp-08', title: 'Fotografia de produtos', value: 3500, priority: 'baixa', stage: 'perdido', nextActivity: null, owner: 'Lucas Andrade', updatedAt: '2026-10-29T15:00:00Z' },
]

export const mockActivities: Activity[] = [
  { id: 'act-01', title: 'Reunião de diagnóstico', companyId: 'cmp-10', type: 'reuniao', dueAt: '2026-11-12T14:00:00Z', status: 'pendente' },
  { id: 'act-02', title: 'Ligar para confirmar proposta', companyId: 'cmp-01', type: 'ligacao', dueAt: '2026-11-12T16:30:00Z', status: 'pendente' },
  { id: 'act-03', title: 'Enviar apresentação comercial', companyId: 'cmp-02', type: 'email', dueAt: '2026-11-12T18:00:00Z', status: 'pendente' },
  { id: 'act-04', title: 'Follow-up do orçamento', companyId: 'cmp-08', type: 'email', dueAt: '2026-11-10T13:00:00Z', status: 'atrasada' },
  { id: 'act-05', title: 'Responder dúvidas no WhatsApp', companyId: 'cmp-04', type: 'whatsapp', dueAt: '2026-11-11T11:00:00Z', status: 'atrasada' },
  { id: 'act-06', title: 'Demonstração da plataforma', companyId: 'cmp-03', type: 'demonstracao', dueAt: '2026-11-13T10:00:00Z', status: 'pendente' },
  { id: 'act-07', title: 'Revisar contrato', companyId: 'cmp-05', type: 'tarefa', dueAt: '2026-11-14T15:00:00Z', status: 'pendente' },
  { id: 'act-08', title: 'Apresentar case de sucesso', companyId: 'cmp-07', type: 'reuniao', dueAt: '2026-11-17T13:30:00Z', status: 'pendente' },
  { id: 'act-09', title: 'Ligação de qualificação', companyId: 'cmp-09', type: 'ligacao', dueAt: '2026-11-18T09:00:00Z', status: 'pendente' },
  { id: 'act-10', title: 'Kickoff do projeto', companyId: 'cmp-06', type: 'reuniao', dueAt: '2026-11-09T10:00:00Z', status: 'concluida' },
  { id: 'act-11', title: 'Enviar proposta revisada', companyId: 'cmp-01', type: 'email', dueAt: '2026-11-10T14:00:00Z', status: 'concluida' },
  { id: 'act-12', title: 'Mapear decisores', companyId: 'cmp-05', type: 'tarefa', dueAt: '2026-11-08T16:00:00Z', status: 'concluida' },
]
