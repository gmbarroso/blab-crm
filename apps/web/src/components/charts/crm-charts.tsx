'use client'

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatCompactCurrency, formatCurrency } from '@/lib/format'

function EmptyChart({ className }: { className?: string }) {
  return <div className={`flex items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground ${className ?? 'h-56 w-full'}`}>Sem dados para exibir.</div>
}

const revenueConfig = {
  ganho: { label: 'Ganho', color: 'var(--chart-1)' },
  previsto: { label: 'Previsto', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function RevenueChart({
  data,
  className = 'h-64 w-full',
}: {
  data: { month: string; ganho: number; previsto: number }[]
  className?: string
}) {
  if (data.length === 0) return <EmptyChart className={className} />
  return (
    <ChartContainer config={revenueConfig} className={className}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fill-ganho" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-ganho)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--color-ganho)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={64}
          tickFormatter={(value: number) => formatCompactCurrency(value)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => (
                <div className="flex w-full items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    {revenueConfig[name as keyof typeof revenueConfig]?.label ?? name}
                  </span>
                  <span className="font-mono font-medium tabular-nums">{formatCurrency(Number(value))}</span>
                </div>
              )}
            />
          }
        />
        <Area
          dataKey="previsto"
          type="monotone"
          stroke="var(--color-previsto)"
          strokeDasharray="4 4"
          fill="transparent"
          strokeWidth={2}
        />
        <Area
          dataKey="ganho"
          type="monotone"
          stroke="var(--color-ganho)"
          fill="url(#fill-ganho)"
          strokeWidth={2}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  )
}

const sourceConfig = {
  leads: { label: 'Leads', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function LeadsBySourceChart({
  data,
  className = 'h-64 w-full',
}: {
  data: { source: string; leads: number }[]
  className?: string
}) {
  if (data.length === 0) return <EmptyChart className={className} />
  return (
    <ChartContainer config={sourceConfig} className={className}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="source"
          type="category"
          tickLine={false}
          axisLine={false}
          width={84}
          tickMargin={4}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
        <Bar dataKey="leads" fill="var(--color-leads)" radius={4} barSize={18} />
      </BarChart>
    </ChartContainer>
  )
}

const conversionConfig = {
  taxa: { label: 'Conversão', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function ConversionTrendChart({ data }: { data: { month: string; taxa: number }[] }) {
  if (data.length === 0) return <EmptyChart />
  return (
    <ChartContainer config={conversionConfig} className="h-56 w-full">
      <LineChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          tickFormatter={(value: number) => `${value}%`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="font-mono font-medium tabular-nums">
                  {Number(value).toLocaleString('pt-BR')}%
                </span>
              )}
            />
          }
        />
        <Line
          dataKey="taxa"
          type="monotone"
          stroke="var(--color-taxa)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--color-taxa)' }}
        />
      </LineChart>
    </ChartContainer>
  )
}

const stageConfig = {
  quantidade: { label: 'Oportunidades', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function OpportunitiesByStageChart({
  data,
}: {
  data: { stage: string; quantidade: number; valor: number }[]
}) {
  if (data.length === 0) return <EmptyChart className="h-72 w-full" />
  return (
    <ChartContainer config={stageConfig} className="h-72 w-full">
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={72}
          fontSize={11}
        />
        <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, _name, item) => (
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono font-medium tabular-nums">{String(value)} oportunidade(s)</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(Number(item.payload.valor))} estimados
                  </span>
                </div>
              )}
            />
          }
        />
        <Bar dataKey="quantidade" fill="var(--color-quantidade)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
