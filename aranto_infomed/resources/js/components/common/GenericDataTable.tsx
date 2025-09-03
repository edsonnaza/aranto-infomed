"use client"

import * as React from "react"
import {
  ColumnDef,
  Row,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { router } from "@inertiajs/react"
// 🔹 Normaliza texto: minúsculas + sin acentos
function normalizeText(text: unknown) {
  return text
    ?.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

// 🔹 Filtro global insensible a acentos/mayúsculas
function globalTextFilter<TData>(row: Row<TData>, columnId: string, filterValue: string) {
  const value = row.getValue(columnId)
  const normalizedValue = normalizeText(value)
  const normalizedFilter = normalizeText(filterValue || "")
  return typeof normalizedValue === "string" && normalizedValue.includes(normalizedFilter || "")
}

interface GenericDataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  links?: { label: string; url: string | null; active: boolean }[]
  renderActions?: (row: TData) => React.ReactNode
  serverSidePagination?: boolean
  filterColumn?: keyof TData
}

export function GenericDataTable<TData>({
  columns,
  data,
  links,
  renderActions,
  serverSidePagination = false,
}: GenericDataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // 🔹 Combinar columnas + columna de acciones
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
    filterFns: { global: globalTextFilter },
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
    manualPagination: serverSidePagination,
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                >
                  {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      {serverSidePagination && links && (
        <div className="flex justify-end gap-2 mt-4">
          {links.map((link, idx) => (
            <Button
              key={idx}
              variant={link.active ? "default" : "outline"}
              size="sm"
              onClick={() => link.url && router.get(link.url)}
              disabled={!link.url}
            >
              <span dangerouslySetInnerHTML={{ __html: link.label }} />
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
