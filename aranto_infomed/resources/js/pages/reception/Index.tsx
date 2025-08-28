import { Head, useForm } from "@inertiajs/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { useReceptionStore } from "@/stores/useReceptionStore"
import { useState, useEffect } from "react"

type Service = { id: number; name: string; price_sale: number }
type Professional = { id: number; name: string; last_name: string; full_name: string ; lastname:string }
type Patient = { id: number; full_name: string; seguro_id: number; seguro_name: string }

interface ReceptionProps {
  services: Service[]
  professionals: Professional[]
  patients: Patient[]
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Recepción", href: "/reception" }]

export default function Index({ services, professionals }: ReceptionProps) {
  const { patient, professional, cart, setPatient, setProfessional, addService, updateQty, updateDiscount, removeService } = useReceptionStore()
  const [searchPatient, setSearchPatient] = useState("")
  const [searchProfessional, setSearchProfessional] = useState("")
  const [searchService, setSearchService] = useState("")
  const [resultsPatients, setResultsPatients] = useState<Patient[]>([])
  const [resultsProfessionals, setResultsProfessionals] = useState<Professional[]>([])
  const [resultsServices, setResultsServices] = useState<Service[]>([]) 

useEffect(() => {
  if (searchPatient.length > 2) {
    fetch(`/reception/patients/search?q=${searchPatient}`)
      .then(res => {
        if (!res.ok) throw new Error("Error en la búsqueda de pacientes");
        return res.json();
      })
      .then(data => setResultsPatients(data))
      .catch(err => {
        console.error(err);
        setResultsPatients([]);
      });
  } else {
    setResultsPatients([]);
  }
}, [searchPatient]);

useEffect(() => {
  if (searchProfessional.length > 2) {
    fetch(`/reception/professionals/search?q=${searchProfessional}`)
      .then(res => {
        if (!res.ok) throw new Error("Error en la búsqueda de profesionales");
        return res.json();
      })
      .then(data => setResultsProfessionals(data))
      .catch(err => {
        console.error(err);
        setResultsProfessionals([]);
      });
  } else {
    setResultsProfessionals([]);
  }
}, [searchProfessional]);

useEffect(() => {
  if (searchService.length > 2) {
    fetch(`/reception/services/search?q=${searchService}`)
      .then(res => {
        if (!res.ok) throw new Error("Error en la búsqueda de servicios");
        return res.json();
      })
      .then(data => setResultsServices(data))
      .catch(err => {
        console.error(err);
        setResultsServices([]);
      });
  } else {
    setResultsServices([]);
  }
}, [searchService]);



const visitForm = useForm<{
  patient_id: string
  professional_id: string
  cart: ServiceItem[]
}>({
  patient_id: "",
  professional_id: "",
  cart: [],
})

type ServiceItem = Service & {
  qty: number
  discount: number
  price_sale: number
}

  const total = cart.reduce((sum, item) => {
    const subtotal = item.qty * item.price_sale
    return sum + (subtotal - (subtotal * item.discount) / 100)
  }, 0)

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Recepción" />
      <div className="grid gap-6 p-6 grid-cols-2">
        {/* Paciente */}
       {/* Paciente */}
        <Card>
        <CardContent className="space-y-3">
            <h2 className="text-xl font-bold">Paciente</h2>

            {/* Input de búsqueda */}
            <Input
            placeholder="Buscar paciente..."
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
            />

            {/* Resultados de búsqueda */}
            {searchPatient.length > 2 && (
            <div className="border rounded p-2 max-h-40 overflow-y-auto">
               {resultsPatients.map((p) => (
                <div
                    key={p.id}
                    className="cursor-pointer hover:bg-gray-100 p-1"
                    onClick={() => {
                    setPatient(p)
                    setSearchPatient(p.full_name)
                    setResultsPatients([])
                    setSearchPatient("")
                    }}
                >
                    {p.full_name}{"-"}{p.seguro_name}
                </div>
                ))}


                {/* Botón para registrar un nuevo paciente */}
                <Button variant="outline" size="sm" className="mt-2 w-full">
                + Registrar nuevo paciente
                </Button>
            </div>
            )}

            {/* Paciente seleccionado */}
            {patient && (
            <p className="text-sm text-green-600">
                ✔ {patient.full_name}{"-"}{patient.seguro_name} seleccionado
            </p>
            )}
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
                        setSearchProfessional(p.name +' ' + p.last_name )
                        setSearchProfessional("")
                      }}
                    >
                      {p.full_name}
                    </div>
                  ))}
              </div>
            )}
            {professional && <p className="text-sm text-green-600">✔ {professional.full_name } seleccionado</p>}
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
                        addService({
                          id: s.id,
                          name: s.name,
                          price_sale: s.price_sale,
                          qty: 1,
                          discount: 0,
                        })
                        setSearchService("")
                      }}
                    >
                      {s.name} - ${s.price_sale}
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
                      console.log(item)
                  const subtotal = item.qty * item.price_sale
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
                      <TableCell>${item.price_sale}</TableCell>
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
                ...visitForm.data,
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
