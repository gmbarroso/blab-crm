'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterDefinition {
  id: string
  label: string
  options: FilterOption[]
}

export const ALL = 'all'

export function FilterBar({
  filters,
  values,
  onChange,
  onReset,
  children,
  className,
}: {
  filters: FilterDefinition[]
  values: Record<string, string>
  onChange: (id: string, value: string) => void
  onReset: () => void
  children?: React.ReactNode
  className?: string
}) {
  const active = Object.values(values).some((value) => value !== ALL)

  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center', className)}>
      {children}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const items = [{ value: ALL, label: `${filter.label}: todos` }, ...filter.options]
          return (
            <Select
              key={filter.id}
              items={items}
              value={values[filter.id] ?? ALL}
              onValueChange={(value) => onChange(filter.id, (value as string) ?? ALL)}
            >
              <SelectTrigger className="h-9 min-w-36" aria-label={`Filtrar por ${filter.label.toLowerCase()}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {items.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        })}
        {active && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
            <X data-icon="inline-start" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
