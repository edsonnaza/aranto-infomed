"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender
   
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
 

// 🔹 Normaliza texto: minúsculas + sin acentos
function normalizeText(text: unknown) {
  return text
    ?.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

// 🔹 Filtro global insensible a acentos/mayúsculas
import type { Row } from "@tanstack/react-table"

function globalTextFilter<TData>(row: Row<TData>, columnId: string, filterValue: string) {
  const value = row.getValue(columnId)
  const normalizedValue = normalizeText(value)
  const normalizedFilter = normalizeText(filterValue)
  return (
    typeof normalizedValue === "string" &&
    typeof normalizedFilter === "string" &&
    normalizedValue.includes(normalizedFilter)
  )
}

interface GenericDataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  renderActions?: (row: TData) => React.ReactNode
}

export function GenericDataTable<TData>({
  columns,
  data,
  renderActions,
}: GenericDataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // 🔹 Combinar columnas + columna de acciones si se pasó renderActions
  const enhancedColumns = React.useMemo<ColumnDef<TData>[]>(() => {
    if (!renderActions) return columns
    return [
      ...columns,
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => renderActions(row.original),
      },
    ]
  }, [columns, renderActions])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter, 
      columnVisibility,
      rowSelection,
    },
    filterFns: {
      global: globalTextFilter, 
    },
    globalFilterFn: globalTextFilter, 
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter, 
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="w-full">
      {/* 🔹 Filtro global */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        {/* 🔹 Selector de columnas */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
               <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {typeof column.columnDef.header === "string"
                  ? column.columnDef.header
                  : String(column.id)}
              </DropdownMenuCheckboxItem>

              ))}
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

      {/* 🔹 Tabla */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={enhancedColumns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔹 Paginación */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            Primero
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Último
          </Button>
        </div>
      </div>
</div>
  )
}
