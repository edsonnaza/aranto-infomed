import { Head, useForm } from "@inertiajs/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { useReceptionStore } from "@/stores/useReceptionStore"
import { useState } from "react"

type Service = { id: number; name: string; price: number }
type Professional = { id: number; name: string }

interface ReceptionProps {
  services: Service[]
  professionals: Professional[]
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Recepción", href: "/reception" }]

export default function Index({ services, professionals }: ReceptionProps) {
  const { patient, professional, cart, setPatient, setProfessional, addService, updateQty, updateDiscount, removeService } = useReceptionStore()
  const [searchPatient, setSearchPatient] = useState("")
  const [searchProfessional, setSearchProfessional] = useState("")
  const [searchService, setSearchService] = useState("")

  const visitForm = useForm({ patient_id: "", professional_id: "", cart: [] })

  const total = cart.reduce((sum, item) => {
    const subtotal = item.qty * item.price
    return sum + (subtotal - (subtotal * item.discount) / 100)
  }, 0)

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Recepción" />
      <div className="grid gap-6 p-6 grid-cols-2">
        {/* Paciente */}
        <Card>
          <CardContent className="space-y-3">
            <h2 className="text-xl font-bold">Paciente</h2>
            <Input
              placeholder="Buscar paciente..."
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
            />
            {/* Simula búsqueda en tiempo real */}
            {searchPatient.length > 2 && (
              <div className="border rounded p-2 max-h-40 overflow-y-auto">
                {["Juan Pérez", "Pedro Gómez", "María López"]
                  .filter((n) => n.toLowerCase().includes(searchPatient.toLowerCase()))
                  .map((n, i) => (
                    <div
                      key={i}
                      className="cursor-pointer hover:bg-gray-100 p-1"
                      onClick={() => {
                        setPatient({ id: i + 1, name: n })
                        setSearchPatient(n)
                      }}
                    >
                      {n}
                    </div>
                  ))}
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  + Registrar nuevo paciente
                </Button>
              </div>
            )}
            {patient && <p className="text-sm text-green-600">✔ {patient.name} seleccionado</p>}
          </CardContent>
        </Card>

        {/* Profesional */}
        <Card>
          <CardContent className="space-y-3">
            <h2 className="text-xl font-bold">Profesional</h2>
            <Input
              placeholder="Buscar profesional..."
              value={searchProfessional}
              onChange={(e) => setSearchProfessional(e.target.value)}
            />
            {searchProfessional.length > 1 && (
              <div className="border rounded p-2 max-h-40 overflow-y-auto">
                {professionals
                  .filter((p) => p.name.toLowerCase().includes(searchProfessional.toLowerCase()))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="cursor-pointer hover:bg-gray-100 p-1"
                      onClick={() => {
                        setProfessional(p)
                        setSearchProfessional(p.name)
                      }}
                    >
                      {p.name}
                    </div>
                  ))}
              </div>
            )}
            {professional && <p className="text-sm text-green-600">✔ {professional.name} seleccionado</p>}
          </CardContent>
        </Card>

        {/* Servicios / carrito */}
        <Card className="col-span-2">
          <CardContent className="space-y-3">
            <h2 className="text-xl font-bold">Servicios</h2>
            <Input
              placeholder="Buscar servicio..."
              value={searchService}
              onChange={(e) => setSearchService(e.target.value)}
            />
            {searchService.length > 1 && (
              <div className="border rounded p-2 max-h-40 overflow-y-auto">
                {services
                  .filter((s) => s.name.toLowerCase().includes(searchService.toLowerCase()))
                  .map((s) => (
                    <div
                      key={s.id}
                      className="cursor-pointer hover:bg-gray-100 p-1"
                      onClick={() => {
                        addService(s)
                        setSearchService("")
                      }}
                    >
                      {s.name} - ${s.price}
                    </div>
                  ))}
              </div>
            )}

            {/* Tabla del carrito */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Cant.</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Desc.</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item) => {
                  const subtotal = item.qty * item.price
                  const final = subtotal - (subtotal * item.discount) / 100
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.qty}
                          min={1}
                          onChange={(e) => updateQty(item.id, Number(e.target.value))}
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.discount}
                          min={0}
                          max={100}
                          onChange={(e) => updateDiscount(item.id, Number(e.target.value))}
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell>${final.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => removeService(item.id)}>
                          X
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <div className="text-right font-bold text-lg">Total: ${total.toFixed(2)}</div>
          </CardContent>
        </Card>

        {/* Confirmar */}
        <div className="col-span-2 flex justify-end">
          <Button
            onClick={() => {
              visitForm.setData({
                patient_id: patient?.id || "",
                professional_id: professional?.id || "",
                cart,
              })
              visitForm.post(route("reception.confirmVisit"))
            }}
          >
            Confirmar y Enviar a Caja
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
