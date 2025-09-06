"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
//import { Badge } from "@/components/ui/badge"

import { useSearchServices } from "@/hooks/useSearchServices"
import { formatPrice } from "@/utils/formatPrice"
import { ServiceItem } from "@/types/services"
import { Seguro } from "@/types/seguro"

interface CartTableProps {
  seguro: Seguro | null
  profesional: { id: number; full_name: string } | null
  cart: ServiceItem[]
  addService: (s: ServiceItem) => void
  updateQty: (id: number, qty: number) => void
  updateDiscountPercent: (id: number, discount: number) => void
  updateDiscountAmount: (id: number, discount: number) => void
  removeService: (id: number) => void
}

export function CartTable({
  seguro,
  cart,
  addService,
  updateQty,
  updateDiscountPercent,
  updateDiscountAmount,
  removeService,
}: CartTableProps) {
  const [searchService, setSearchService] = useState("")

const resultsServices = useSearchServices(
  searchService,
  seguro ? { id: seguro.id } : { id: 1 }
)

 const total = cart.reduce((sum, item) => {
  const subtotal = item.qty * item.price_sale
  const final = subtotal - item.discount_amount
  return sum + final
}, 0)


  return (
    <Card className="col-span-2">
      <CardContent className="space-y-3">
        <h2 className="text-xl font-bold">Servicios</h2>

        {/* Buscar servicio */}
        <Input
          placeholder="Buscar servicio..."
          value={searchService}
          onChange={(e) => setSearchService(e.target.value)}
        />

        {resultsServices.length > 0 && (
          <div className="border rounded p-2 max-h-40 overflow-y-auto">
            {resultsServices.map((s) => (
              <div
                key={`${s.id}-${s.seguro_id}`}
                className="cursor-pointer hover:bg-gray-100 p-1"
                onClick={() => {
                  addService({ ...s, qty: 1, discount_percent: 0 })
                  setSearchService("")
                }}
              >
                {s.name} - Gs {formatPrice(Number(s.price_sale))} ({s.seguro_name})
              </div>
            ))}
          </div>
        )}

        {/* Tabla del carrito */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Servicio</TableHead>
              <TableHead>Profesional</TableHead>
              <TableHead>Seguro</TableHead>
              <TableHead>Cant.</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Descuento %</TableHead>
              <TableHead>Descuento Gs</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((item) => {
              const subtotal = item.qty * item.price_sale
              const final = subtotal - (subtotal * item.discount_percent) / 100
              return (
                <TableRow key={`${item.id}-${item.seguro_id}`}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.professional.full_name}</TableCell>
                  <TableCell>{item.seguro_name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        updateQty(item.id, Number(e.target.value))
                      }
                      className="w-16"
                    />
                  </TableCell>
                  <TableCell>{formatPrice(Number(item.price_sale))}</TableCell>
                  <TableCell>
                    {/* % de descuento */}
                    <div className="flex items-center gap-2 mb-1">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={item.discount_percent}
                        onChange={(e) =>
                          updateDiscountPercent(item.id, Number(e.target.value))
                        }
                        className="w-25"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                   </TableCell>
                  <TableCell>
                    {/* monto fijo */}
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        max={item.price_sale}
                      
                        min={0}
                        value={formatPrice(item.discount_amount)}
                        onChange={(e) =>
                          updateDiscountAmount(item.id, Number(e.target.value))
                        }
                        className="w-25"
                      />
                      <span className="text-sm text-gray-600">Gs</span>
                    </div>
                  </TableCell>

                  <TableCell>{formatPrice(final)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeService(item.id)}
                    >
                      X
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <div className="text-right font-bold text-lg">
          Total: Gs {formatPrice(total)}.-
        </div>
      </CardContent>
    </Card>
  )
}


export default CartTable