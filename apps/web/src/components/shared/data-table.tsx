import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  id: string
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  empty,
  caption,
  footer,
}: {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  empty?: React.ReactNode
  caption?: string
  footer?: React.ReactNode
}) {
  if (rows.length === 0 && empty) return <>{empty}</>

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  'h-10 text-xs font-semibold tracking-wide text-muted-foreground uppercase first:pl-4 last:pr-4',
                  column.headerClassName ?? column.className,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowKey(row)} className="group/row">
              {columns.map((column) => (
                <TableCell key={column.id} className={cn('py-3 first:pl-4 last:pr-4', column.className)}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {footer && (
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  )
}
