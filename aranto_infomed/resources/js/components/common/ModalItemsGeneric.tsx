// components/common/ModalItemsGeneric.tsx
"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GenericDataTable } from "./GenericDataTable"
import { StatusIcon } from "@/components/common/StatusIcons"
import { Order, OrderItem } from "@/types/reception"
import { ColumnDef, Row } from "@tanstack/react-table"
import { formatPrice } from "@/utils/formatPrice"

interface ModalItemsGenericProps<T> {
  open: boolean
  onClose: () => void
  title?: string
  items?: OrderItem[] // si ya tenés un array de items plano
  orders?: Order[] // si tenés orders con items dentro
  columns?: ColumnDef<T>[] // columnas opcionales, si no se genera por defecto
  footer?: React.ReactNode
  paymentStatus?: "paid" | "cancelled" | "pending"
}




export function ModalItemsGeneric<T>({
  open,
  onClose,
  title = "Detalles",
  items,
  orders,
  footer,
  paymentStatus,
}: ModalItemsGenericProps<T>) {

  // 🔹 Extrae items de orders si se pasó orders
  type OrderItemWithStatus = OrderItem & { orderStatus?: string };

  const processedItems: OrderItemWithStatus[] = React.useMemo(() => {
    if (items) {
      return items.map(item => ({
        ...item,
        professional: item.professional ?? { id: 0, full_name: '' },
      }));
    }
    if (orders) {
      return orders.flatMap(order =>
        order.items.map((item: OrderItem) => ({
          ...item,
          orderStatus: order.status,
          professional: item.professional ?? { id: 0, full_name: '' },
        }))
      );
    }
    return [];
  }, [items, orders]);

  const defaultColumns: ColumnDef<OrderItemWithStatus>[] = React.useMemo(() => [
    { accessorKey: "service_name", header: "Servicio" },
    {
      accessorKey: "professional.full_name",
      header: "Profesional",
      cell: ({ row }: { row: Row<OrderItemWithStatus> }) =>
        row.original.professional?.full_name ?? "—",
    },
    {
      accessorKey: "orderStatus",
      header: "Estado",
      cell: ({ row }: { row: Row<OrderItemWithStatus> }) => (
        <StatusIcon status={row.original.orderStatus ?? "pending"} />
      ),
    },
    { accessorKey: "quantity", header: ()=><div className="text-center">Cantidad</div>,
      cell: ({ getValue }) => {
        const value = getValue<number>()
        return <div className="text-center">{formatPrice(Number(value))}</div>
      }
    },
    {
      accessorKey: "total_price",
      header: () => <div className="text-right">Total c/ Desc.</div>,
      cell: ({ getValue }) => {
        const value = getValue<string>()
        return <div className="text-right">{"Gs " + formatPrice(Number(value))}</div>
      },
    },
    {
      accessorKey: "unit_price",
      header: () => <div className="text-right">Precio unitario</div>,
      cell: ({ getValue }) => {
        const value = getValue<string>()
        return <div className="text-right">{"Gs " + formatPrice(Number(value))}</div>
      },
    },
  ], [])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Estado de cobro */}
        {typeof paymentStatus !== "undefined" && (
          <div className="mb-2">
            <span className="font-semibold">Estado de cobro: </span>
            {paymentStatus === "paid" && (
              <span className="text-green-600 font-semibold">Pagado</span>
            )}
            {paymentStatus === "cancelled" && (
              <span className="text-red-600 font-semibold">Cancelado</span>
            )}
            {paymentStatus === "pending" && (
              <span className="text-yellow-600 font-semibold">Pendiente</span>
            )}
          </div>
        )}

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


