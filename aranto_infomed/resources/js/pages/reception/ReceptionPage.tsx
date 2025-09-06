"use client"

import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Professional, Seguro, Patient } from "@/types"
import { BreadcrumbItem } from "@/types/index.d"
import { useReceptionStore } from "@/stores/useReceptionStore"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { router } from "@inertiajs/react"
import { Loader2 } from "lucide-react"
import { useState } from "react"



import { PatientInput, SeguroSelect, ProfessionalInput, CartTable } from "./index"

interface ReceptionProps {
  seguros: Seguro[]
  professionals: Professional[]
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Ingresar Paciente en Recepción", href: "/reception" }]

export default function ReceptionPage({ seguros, professionals }: ReceptionProps) {
  const [loading, setLoading] = useState(false)
  const { reset } = useReceptionStore()
  const {
    patient,
    setPatient,
    professional,
    setProfessional,
    seguro,
    setSeguro,
    cart,
    addService,
    updateQty,
    updateDiscountPercent,
    updateDiscountAmount,
    removeService,
  } = useReceptionStore()

const preparePayload = () => {
  if (!patient || !professional || !seguro) {
    toast.error("Por favor, seleccione un paciente, profesional y seguro.")
    return
  }

  if (cart.length === 0) {
    toast.error("El carrito está vacío. Agregue al menos un servicio.")
    return
    
  };

  
  const itemsPayload = cart.map((i) => ({
    service_id: i.id,
    professional_id: i.professional.id,
    service_name: i.name,
    quantity: i.qty,
    unit_price: Number(i.price_sale),
    discount_amount: Number((i.price_sale * i.discount_percent) / 100),
    total_price: Number(i.qty * i.price_sale - (i.qty * i.price_sale * i.discount_percent) / 100),
  }));

  const orderPayload = {
    professional_id: professional.id,
    total_amount: itemsPayload.reduce((sum, i) => sum + i.total_price, 0),
    discount_amount: 0,
    discount_percent: 0,
    final_amount: itemsPayload.reduce((sum, i) => sum + i.total_price, 0),
    commission_percentage: Number(professional.comision_percentage ?? 0),
    commission_amount: 0,
    status: "pending",
    created_by: null,
    items: itemsPayload,
  };

  return {
    patient_id: patient.id,
    professional_id: professional.id,
    seguro_id: seguro.id,
    visit_status: "waiting",
    sede_id: 1,
    created_by: null,
    order: orderPayload,
  };
};

// En el botón confirmar
const handleConfirm = () => {
  const payload = preparePayload();
  console.log(payload);
  if (!payload) return toast.error("Faltan datos obligatorios");
  setLoading(true)
  router.post(route("reception.storePatientVisit"), payload, {
    preserveScroll: true,
    onSuccess: () =>{ toast.success("Visita registrada correctamente")
      setLoading(false)
      setPatient(null)
      setProfessional(null)
      reset()
    },
     
    onError: (errors) => {
      // errors es un objeto { campo: [mensajes] }
      // Si quieres mostrar todos los mensajes concatenados:
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
          onSelect={(p: Patient) => {
            setPatient(p)
            setSeguro(
              seguros.find((s: Seguro) => s.id === p.seguro_id) ??
                seguros.find((s: Seguro) => s.name === "Particular") ??
                { id: 1, name: "Particular" }
            )
          }}
        />

        {/* Seguro */}
        <SeguroSelect
          seguros={seguros}
          value={seguro}
          onChange={setSeguro}
        />

        {/* Profesional */}
        <ProfessionalInput
          professionals={professionals}
          value={professional}
          onSelect={setProfessional}
        />

        {/* Carrito */}
        <CartTable
          seguro={seguro}
          profesional={professional}
          cart={cart}
          addService={addService}       
          updateQty={updateQty}
          updateDiscountPercent={updateDiscountPercent}
          updateDiscountAmount={updateDiscountAmount}
          removeService={removeService}
        />
        </div>

      {/* Confirmar */}
      <div className="col-span-2 flex justify-end p-6">
      <Button className="bg-blue-600 cursor-pointer hover:bg-blue-900" onClick={handleConfirm} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? "Guardando..." : "Confirmar y Enviar a Caja"}
      </Button>
      </div>
    </AppLayout>
  )
}

