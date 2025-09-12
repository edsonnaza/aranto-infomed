"use client"

import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types/index.d"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { router } from "@inertiajs/react"
import { useReceptionStore } from "@/stores/useReceptionStore"
import { useReactToPrint } from "react-to-print"
import Ticket from "@/components/common/Ticket"
import {  PatientVisit, PayloadToSave } from "@/types/reception"
import { Seguro, Professional, Patient } from "@/types"

import { PatientInput, CartTable } from "./index"
import { SeguroSelect } from "@/components/SeguroSelect/SeguroSelect"
import { ProfessionalInput } from "@/components/ProfessionalInput/ProfesionalInput"
 

const breadcrumbs: BreadcrumbItem[] = [{ title: "Ingresar Paciente en Recepción", href: "/reception" }]

type ReceptionPageProps = {
  seguros: Seguro[];
  professionals: Professional[];
};

export default function ReceptionPage({ seguros, professionals }: ReceptionPageProps) {
  const [ticketData, setTicketData] = useState<PayloadToSave | null>(null)
  const contentRef = useRef<HTMLDivElement>(null);
  const [seguroSeleccionado, setSeguroSeleccionado] = useState<Seguro | null>(null);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<Professional | null>(null);
  const handlePrint = useReactToPrint({ contentRef });

  // Efecto: cuando ticketData cambie, dispara impresión
  useEffect(() => {
    if (ticketData) {
      handlePrint()
    }
  }, [ticketData, handlePrint])

  const [loading, setLoading] = useState(false)
  const { patient, orders, setPatient, addOrderItem, updateOrderItem, removeOrderItem, reset } = useReceptionStore()

  // Cuando se selecciona un paciente, setear seguro por defecto
  const handleSelectPatient = (p: Patient) => {
    setPatient({ id: String(p.id), full_name: p.full_name });
    if (p && p.seguro) {
      const seguro = seguros.find((s) => s.name === p.seguro.name) || null;
      setSeguroSeleccionado(seguro);
    } else {
      setSeguroSeleccionado(null);
    }
  };


const preparePayload = () => {
  if (!patient || !orders || !orders.items.length) {
    toast.error("Por favor, seleccione un paciente y agregue al menos un servicio.");
    return null;
  }
  return {
    patient,
    orders,
  };
};


// En el botón confirmar
const handleConfirm = () => {
  const payload = preparePayload();
  if (!payload) return;
  setLoading(true);
  router.post(route("reception.storePatientVisit"), payload, {
    preserveScroll: true,
    onSuccess: () => {
      toast.success("Visita registrada correctamente");
      setLoading(false);
      setTicketData(payload);
      reset();
    },
    onError: (errors) => {
      const messages = Object.values(errors).flat().join(". ");
      toast.error(`❌ Error al intentar registrar la visita: ${messages}`);
    },
    onFinish: () => setLoading(false),
  });
};


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Recepción" />



      <div className="grid gap-6 p-6 grid-cols-2">
        {/* Paciente */}
        <PatientInput
          value={patient}
          onSelect={handleSelectPatient}
        />

        {/* Seguro */}
        <SeguroSelect
          seguros={seguros}
          value={seguroSeleccionado}
          onChange={setSeguroSeleccionado}
        />

        {/* Profesional */}
        <ProfessionalInput
          professionals={professionals}
          value={profesionalSeleccionado}
          onSelect={setProfesionalSeleccionado}
        />

        {/* Tabla de órdenes/items */}
        <CartTable
          order={orders}
          addOrderItem={addOrderItem}
          updateOrderItem={updateOrderItem}
          removeOrderItem={removeOrderItem}
          seguro={seguroSeleccionado}
          profesional={profesionalSeleccionado}
        />
      </div>

      {/* Confirmar */}
      <div className="col-span-2 flex justify-end p-6">
      <Button className="bg-blue-600 cursor-pointer hover:bg-blue-900" onClick={handleConfirm} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? "Guardando..." : "Confirmar y Enviar a Caja"}
      </Button>
      </div>
      
      {/* tu UI */}

    <div ref={contentRef}>
      {/* Contenido que se quiere imprimir */}
      <Ticket data={ticketData} />
    </div>

    </AppLayout>
  )
}

