const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const compactCurrency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const shortDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
})

const dateTime = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
})

const time = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
})

export function formatCurrency(value: number) {
  return currency.format(value)
}

export function formatCompactCurrency(value: number) {
  return compactCurrency.format(value)
}

export function formatDate(iso: string | null) {
  if (!iso) return '—'
  return shortDate.format(new Date(iso)).replace('.', '')
}

export function formatDateTime(iso: string) {
  return dateTime.format(new Date(iso)).replace('.', '')
}

export function formatTime(iso: string) {
  return time.format(new Date(iso))
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
