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

// Nuevas interfaces para OrderItem y Order
interface OrderItem {
  id: number;
  service_id: number;
  order_id: number;
  professional: {
    id: string;
    full_name: string;
  };
  service_name: string;
  quantity: number;
  total_price: number;
  unit_price: number;
  total_amount: number;
  status: "pending";
  seguro: {
    id: number;
    name: string;
  };
  discount_percent?: number;
  discount_amount?: number;
}

interface Order {
  id: number;
  status: "pending";
  total_amount_items: number;
  items: OrderItem[];
}

import { Seguro, Professional } from "@/types"

interface CartTableProps {
  order: Order | null;
  addOrderItem: (item: OrderItem) => void;
  updateOrderItem: (item: OrderItem) => void;
  removeOrderItem: (itemId: number) => void;
  seguro: Seguro | null;
  profesional: Professional | null;
}


export function CartTable({ order, addOrderItem, updateOrderItem, removeOrderItem, seguro, profesional }: CartTableProps) {
  const [searchService, setSearchService] = useState("");
  // Filtrar servicios por seguro seleccionado
  const resultsServices = useSearchServices(searchService, seguro ? { id: seguro.id } : { id: 1 });

  const items = order?.items || [];
  const total = items.reduce((sum, item) => sum + item.total_amount, 0);


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
                key={s.id}
                className="cursor-pointer hover:bg-gray-100 p-1"
                onClick={() => {
                  // Adaptar el servicio encontrado a OrderItem, asociando seguro y profesional seleccionados
                  const newItem: OrderItem = {
                    id: Date.now(),
                    service_id: s.id,
                    order_id: order?.id || 0,
                    professional: profesional
                      ? { id: profesional.id.toString(), full_name: profesional.full_name }
                      : { id: "0", full_name: "Sin profesional" },
                    service_name: s.name,
                    quantity: 1,
                    total_price: Number(s.price_sale),
                    unit_price: Number(s.price_sale),
                    total_amount: Number(s.price_sale),
                    status: "pending",
                    seguro: seguro ? { id: seguro.id, name: seguro.name } : { id: 1, name: "Particular" },
                    discount_percent: 0,
                    discount_amount: 0,
                  };
                  addOrderItem(newItem);
                  setSearchService("");
                }}
              >
                {s.name} - Gs {formatPrice(Number(s.price_sale))}
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
            {items.map((item) => {
              // Descuentos sincronizados
              const discountPercent = item.discount_percent ?? 0;
              const discountAmount = item.discount_amount ?? 0;
              const subtotal = item.unit_price * item.quantity;
              const final = subtotal - discountAmount;
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.service_name}</TableCell>
                  <TableCell>{item.professional.full_name}</TableCell>
                  <TableCell>{item.seguro ? item.seguro.name : '-'}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const quantity = Number(e.target.value);
                        const newDiscountAmount = (item.unit_price * quantity * discountPercent) / 100;
                        const updated = {
                          ...item,
                          quantity,
                          discount_amount: newDiscountAmount,
                          total_amount: item.unit_price * quantity - newDiscountAmount,
                        };
                        updateOrderItem(updated);
                      }}
                      className="w-16"
                    />
                  </TableCell>
                  <TableCell>{formatPrice(item.unit_price)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={discountPercent}
                      onChange={(e) => {
                        const percent = Number(e.target.value);
                        const newDiscountAmount = (item.unit_price * item.quantity * percent) / 100;
                        const updated = {
                          ...item,
                          discount_percent: percent,
                          discount_amount: newDiscountAmount,
                          total_amount: item.unit_price * item.quantity - newDiscountAmount,
                        };
                        updateOrderItem(updated);
                      }}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      max={subtotal}
                      value={discountAmount}
                      onChange={(e) => {
                        const amount = Number(e.target.value);
                        const percent = subtotal > 0 ? (amount / subtotal) * 100 : 0;
                        const updated = {
                          ...item,
                          discount_amount: amount,
                          discount_percent: percent,
                          total_amount: subtotal - amount,
                        };
                        updateOrderItem(updated);
                      }}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>{formatPrice(final)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeOrderItem(item.id)}
                    >
                      X
                    </Button>
                  </TableCell>
                </TableRow>
              );
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