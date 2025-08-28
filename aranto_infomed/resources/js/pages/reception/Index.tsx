import { Head, useForm } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { useReceptionStore } from "@/stores/useReceptionStore"
import * as Select from "@radix-ui/react-select"
import { formatPrice } from "@/utils/formatPrice" 

type Professional = { id: number; name: string; last_name: string; full_name: string }
type Patient = { id: number; full_name: string; seguro_id?: number; seguro_name?: string }
type Seguro = { id: number; name: string }
type ServiceItem = { id: number; name: string; price_sale: number; qty: number; discount: number; seguro_id: number; seguro_name: string }

interface ReceptionProps {
  professionals: Professional[]
  seguros: Seguro[]
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Recepción", href: "/reception" }]

export default function Index({ professionals, seguros }: ReceptionProps) {
  const { patient, professional, seguro, cart, setPatient, setProfessional, setSeguro, addService, updateQty, updateDiscount, removeService } = useReceptionStore()

  const [searchPatient, setSearchPatient] = useState("")
  const [searchProfessional, setSearchProfessional] = useState("")
  const [searchService, setSearchService] = useState("")
  const [resultsPatients, setResultsPatients] = useState<Patient[]>([])
  const [resultsProfessionals, setResultsProfessionals] = useState<Professional[]>([])
  const [resultsServices, setResultsServices] = useState<ServiceItem[]>([])

  // Buscar pacientes
  useEffect(() => {
    if (searchPatient.length > 2) {
      fetch(`/reception/patients/search?q=${searchPatient}`)
        .then(res => res.json())
        .then(data => setResultsPatients(data))
        .catch(() => setResultsPatients([]))
    } else setResultsPatients([])
  }, [searchPatient])

  // Buscar profesionales
  useEffect(() => {
    if (searchProfessional.length > 1) {
      setResultsProfessionals(
        professionals.filter(p => p.name.toLowerCase().includes(searchProfessional.toLowerCase()))
      )
    } else setResultsProfessionals([])
  }, [searchProfessional, professionals])

  // Buscar servicios según seguro seleccionado
useEffect(() => {
  const timeout = setTimeout(() => {
    if (searchService.length > 1) {
      const params = new URLSearchParams()
      params.append('q', searchService)
      if (seguro?.id) params.append('seguro_id', seguro.id.toString())

      fetch(`/reception/services/search?${params.toString()}`)
        .then(res => {
          if (!res.ok) throw new Error("Error al buscar servicios")
          return res.json()
        })
        .then(data => setResultsServices(data))
        .catch(() => setResultsServices([]))
    } else {
      setResultsServices([])
    }
  }, 400) // 👈 medio segundo de delay

  return () => clearTimeout(timeout)
}, [searchService, seguro])


useEffect(() => {
  if (!seguro && patient?.seguro_id) {
    setSeguro({ id: patient.seguro_id, name: patient.seguro_name ?? "Particular" })
  }
}, [patient, seguro, setSeguro])



  const visitForm = useForm({
    patient_id: "",
    professional_id: "",
    cart: [] as ServiceItem[],
  })

  const total = cart.reduce((sum, item) => {
    const subtotal = item.qty * item.price_sale
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
            <Input placeholder="Buscar paciente..." value={searchPatient} onChange={e => setSearchPatient(e.target.value)} />
            {searchPatient.length > 2 && (
              <div className="border rounded p-2 max-h-40 overflow-y-auto">
                {resultsPatients.map(p => (
                  <div
                    key={p.id}
                    className="cursor-pointer hover:bg-gray-100 p-1"
                    onClick={() => {
                      setPatient(p)
                      setSeguro({ id: p.seguro_id ?? 0, name: p.seguro_name ?? "Particular" })
                      setSearchPatient("")
                      setResultsPatients([])
                    }}
                  >
                    {p.full_name} - {p.seguro_name ?? "Particular"}
                  </div>
                ))}
              </div>
            )}
            {patient && <p className="text-sm text-green-600">✔ {patient.full_name} - {seguro?.name}</p>}
          </CardContent>
        </Card>

        {/* Seguro */}
        <Card>
          <CardContent className="space-y-3">
            <h2 className="text-xl font-bold">Seguro</h2>
            <Select.Root value={seguro?.id?.toString() || ""} onValueChange={val => {
              const s = seguros.find(s => s.id.toString() === val)
              if (s) setSeguro(s)
            }}>
              <Select.Trigger className="w-full border rounded px-3 py-2 flex justify-between items-center">
                <Select.Value placeholder="Selecciona un seguro" />
                <Select.Icon />
              </Select.Trigger>
              <Select.Content className="bg-white border rounded shadow-md mt-1 z-50">
                <Select.ScrollUpButton />
                <Select.Viewport className="p-1 max-h-60 overflow-y-auto">
                  {seguros.map(s => (
                    <Select.Item key={s.id} value={s.id.toString()} className="px-3 py-1 cursor-pointer rounded hover:bg-gray-100">
                      <Select.ItemText>{s.name}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton />
              </Select.Content>
            </Select.Root>
            {seguro && <p className="text-sm text-green-600">✔ Seguro seleccionado: {seguro.name}</p>}
          </CardContent>
        </Card>

        {/* Profesional */}
        <Card>
          <CardContent className="space-y-3">
            <h2 className="text-xl font-bold">Profesional</h2>
            <Input placeholder="Buscar profesional..." value={searchProfessional} onChange={e => setSearchProfessional(e.target.value)} />
            {resultsProfessionals.length > 0 && (
              <div className="border rounded p-2 max-h-40 overflow-y-auto">
                {resultsProfessionals.map(p => (
                  <div
                    key={p.id}
                    className="cursor-pointer hover:bg-gray-100 p-1"
                    onClick={() => {
                      setProfessional(p)
                      setSearchProfessional("")
                    }}
                  >
                    {p.full_name}
                  </div>
                ))}
              </div>
            )}
            {professional && <p className="text-sm text-green-600">✔ {professional.full_name}</p>}
          </CardContent>
        </Card>

        {/* Servicios / carrito */}
        <Card className="col-span-2">
          <CardContent className="space-y-3">
            <h2 className="text-xl font-bold">Servicios</h2>
            <Input placeholder="Buscar servicio..." value={searchService} onChange={e => setSearchService(e.target.value)} />
            {resultsServices.length > 0 && (
              <div className="border rounded p-2 max-h-40 overflow-y-auto">
                {resultsServices.map(s => (
                  <div
                    key={`${s.id}-${s.seguro_id}`}
                    className="cursor-pointer hover:bg-gray-100 p-1"
                    onClick={() => {
                      addService({ ...s, qty: 1, discount: 0 })
                      setSearchService("")
                    }}
                  >
                    {s.name} - Gs {formatPrice(s.price_sale)} ({s.seguro_name})
                  </div>
                ))}
              </div>
            )}

            {/* Tabla del carrito */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Seguro</TableHead>
                  <TableHead>Cant.</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Desc. % </TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map(item => {
                  const subtotal = item.qty * item.price_sale
                  const final = subtotal - (subtotal * item.discount) / 100
                  return (
                    <TableRow key={`${item.id}-${item.seguro_id}`}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.seguro_name}</TableCell>
                      <TableCell>
                        <Input type="number" min={1} value={item.qty} onChange={e => updateQty(item.id, Number(e.target.value))} className="w-16" />
                      </TableCell>
                      <TableCell>{formatPrice(item.price_sale)}</TableCell>
                      <TableCell>
                        <Input type="number" min={0} max={100} value={item.discount} onChange={e => updateDiscount(item.id, Number(e.target.value))} className="w-16" />
                      </TableCell>
                      <TableCell>{formatPrice(final)}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => removeService(item.id)}>X</Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <div className="text-right font-bold text-lg">Total: Gs {formatPrice(total)}.-</div>
          </CardContent>
        </Card>

        {/* Confirmar */}
        <div className="col-span-2 flex justify-end">
          <Button onClick={() => {
            visitForm.setData({ ...visitForm.data })
            visitForm.post(route("reception.confirmVisit"))
          }}>
            Confirmar y Enviar a Caja
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
