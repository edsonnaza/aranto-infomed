// components/common/ModalItemsGeneric.tsx
"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GenericDataTable } from "./GenericDataTable"
import { StatusIcon, OrderStatus } from "@/components/common/StatusIcons"
import { Orders, Items } from "@/types/reception"
import { ColumnDef, Row } from "@tanstack/react-table"

interface ModalItemsGenericProps<T> {
  open: boolean
  onClose: () => void
  title?: string
  items?: Items[] // si ya tenés un array de items plano
  orders?: Orders[] // si tenés orders con items dentro
  columns?: ColumnDef<T>[] // columnas opcionales, si no se genera por defecto
  footer?: React.ReactNode
}

interface OrderItem {
  id: number
  service_name: string
  quantity: number
  unit_price: string
  total_price: string
  orderStatus: OrderStatus
}


export function ModalItemsGeneric<T>({
  open,
  onClose,
  title = "Detalles",
  items,
  orders,
  footer,
}: ModalItemsGenericProps<T>) {

  // 🔹 Extrae items de orders si se pasó orders
 const processedItems: OrderItem[] = React.useMemo(() => {
  if (items) {
    // convertimos Items a OrderItem si es necesario
    return items.map((item) => ({
      ...item,
      orderStatus: "pending" as OrderStatus, // o algún valor por defecto
    }))
  }
  if (orders) {
    return orders.flatMap(order =>
      order.items.map((item: Items) => ({
        ...item,
        orderStatus: order.status,
      }))
    ) as OrderItem[]
  }
  return []
}, [items, orders])


  // 🔹 Columnas por defecto si no se pasan
const defaultColumns: ColumnDef<OrderItem>[] = React.useMemo(() => [
  { accessorKey: "service_name", header: "Servicio" },
  {
    accessorKey: "orderStatus",
    header: "Estado",
    cell: ({ row }: { row: Row<OrderItem> }) => <StatusIcon status={row.original.orderStatus} />,
  },
  { accessorKey: "quantity", header: "Cantidad" },
  { accessorKey: "unit_price", header: "Precio unitario" },
  { accessorKey: "total_price", header: "Total" },
], [])


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {processedItems.length ? (
          <div className="overflow-x-auto">
            <GenericDataTable columns={defaultColumns} data={processedItems} />
          </div>
        ) : (
          <p className="py-4 text-center text-muted-foreground">No hay registros.</p>
        )}

        {footer && <div className="mt-4">{footer}</div>}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
