"use client"

import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Professional, Seguro, Patient } from "@/types"
import { BreadcrumbItem } from "@/types/index.d"
import { useReceptionStore } from "@/stores/useReceptionStore"

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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => {
            // aquí va la lógica del formulario (visitForm o similar)
            console.log("Confirmar y enviar a caja", { patient, professional, seguro, cart })
          }}
        >
          Confirmar y Enviar a Caja
        </button>
      </div>
    </AppLayout>
  )
}
