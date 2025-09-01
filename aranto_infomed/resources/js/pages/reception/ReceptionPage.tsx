"use client"

import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Professional, Seguro, Patient } from "@/types"
import { BreadcrumbItem } from "@/types/index.d"
import { useReceptionStore } from "@/stores/useReceptionStore"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { router } from "@inertiajs/react"



import { PatientInput, SeguroSelect, ProfessionalInput, CartTable } from "./index"

interface ReceptionProps {
  seguros: Seguro[]
  professionals: Professional[]
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Ingresar Paciente en Recepción", href: "/reception" }]

export default function ReceptionPage({ seguros, professionals }: ReceptionProps) {
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
    updateDiscount,
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
    professional_id: professional.id,
    service_name: i.name,
    quantity: i.qty,
    unit_price: Number(i.price_sale),
    discount_amount: Number((i.price_sale * i.discount) / 100),
    total_price: Number(i.qty * i.price_sale - (i.qty * i.price_sale * i.discount) / 100),
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

  router.post(route("reception.storePatientVisit"), payload, {
    preserveScroll: true,
    onSuccess: () => toast.success("Visita registrada correctamente"),
    onError: (errors) => {
      // errors es un objeto { campo: [mensajes] }
      // Si quieres mostrar todos los mensajes concatenados:
      const messages = Object.values(errors).flat().join(". ");
      toast.error(`❌ Error al intentar registrar la visita: ${messages}`);
    },
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
          cart={cart}
          addService={addService}       
          updateQty={updateQty}
          updateDiscount={updateDiscount}
          removeService={removeService}
        />
        </div>

      {/* Confirmar */}
      <div className="col-span-2 flex justify-end p-6">
      <Button onClick={handleConfirm}>
        Confirmar y Enviar a Caja
      </Button>


      </div>
    </AppLayout>
  )
}

