"use client"

import { useState } from "react"
import { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from "lucide-react"
import { GenericDataTable } from "@/components/common/GenericDataTable"
import AppLayout from "@/layouts/app-layout"
import { Head, router } from "@inertiajs/react"
import { BreadcrumbItem } from "@/types/index.d"
import TooltipComponent from "@/components/common/TooltipComponent"
import { PatientVisit, VisitsRegisteredProps } from "@/types/reception"
import { ModalItemsGeneric } from "@/components/common/ModalItemsGeneric"
import { StatusIcon, OrderStatus } from "@/components/common/StatusIcons"
import { ModalAlertGeneric } from "@/components/common/ModalAlertGeneric"
import { toast } from "sonner"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Recepción", href: "/reception" },
  { title: "Visitas registradas", href: "/reception/visits" },
]

export default function VisitsRegistered({ data: paginatedData }: VisitsRegisteredProps) {
  const [loading, setLoading] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<PatientVisit | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [visitToCancel, setVisitToCancel] = useState<PatientVisit | null>(null)

  const handleView = (visit: PatientVisit) => {
    setSelectedVisit(visit)
    setModalOpen(true)
  }

  const handleCancelClick = (visit: PatientVisit) => {
    setVisitToCancel(visit)
    setAlertOpen(true)
  }

  const handleConfirmCancel = () => {
    if (!visitToCancel) return
    setLoading(true)

    router.patch(
      route("reception.cancelVisit", visitToCancel.id),
      { visit_status: "cancelled" },
      {
        preserveScroll: true,
        onProgress: () => toast.loading(`Anulando admisión #${visitToCancel.id}...`),
        onSuccess: () => {
          toast.success(`Admisión #${visitToCancel.id} anulada correctamente.`)
          setVisitToCancel(null)
          setAlertOpen(false)
        },
        onError: () => {
          toast.error("Error al anular la admisión.")
          setVisitToCancel(null)
          setAlertOpen(false)
        },
        onFinish: () => setLoading(false),
      }
    )
  }

  const columns: ColumnDef<PatientVisit>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorFn: (row) => row.patient.full_name, id: "patient_name", header: "Paciente" },
    { accessorFn: (row) => row.professional.full_name, id: "professional_name", header: "Profesional" },
    { accessorFn: (row) => row.seguro.name, id: "seguro_name", header: "Seguro" },
    {
      accessorKey: "visit_status",
      header: "Estado",
      cell: ({ row }: { row: Row<PatientVisit> }) => (
        <StatusIcon status={row.original.visit_status as OrderStatus} />
      ),
    },
    {
      accessorFn: (row) =>
        new Date(row.created_at).toLocaleString("es-PY", { dateStyle: "short", timeStyle: "short" }),
      id: "created_at",
      header: "Fecha",
    },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Visitas registradas" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
       <GenericDataTable
        columns={columns}
        data={paginatedData.data}
        links={paginatedData.links}  
        serverSidePagination
        renderActions={(row) => (
            <div className="flex gap-2">
            <TooltipComponent message={`Ver visita #${row.id}`}>
                <Button  style={{ cursor: "pointer" }} variant="ghost" size="icon" onClick={() => handleView(row)}>
                <Eye className="w-4 h-4 cursor-pointer" />
                </Button>
            </TooltipComponent>
            <TooltipComponent message={`Cancelar admisión #${row.id}`}>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCancelClick(row)} 
                    disabled={loading || row.visit_status === "cancelled"} 
                    style={{ cursor: row.visit_status === "cancelled" ? "not-allowed" : "pointer" }}
                >
                    <Trash2
                        className={`w-4 h-4 ${
                        row.visit_status === "cancelled"
                            ? "opacity-30 text-gray-900  not-allowed"
                            : "text-red-500 cursor-pointer"
                        }`}
                    />
                </Button>
                </TooltipComponent>
            </div>
          )}
        />


        {/* 🔹 Modal reutilizable */}
        {selectedVisit && (
          <ModalItemsGeneric
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title={`Servicios solicitados de ${selectedVisit.patient.full_name}`}
            orders={selectedVisit.orders}
          />
        )}

        <ModalAlertGeneric
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
          title={`Cancelar admisión #${visitToCancel?.id}?`}
          description={`¿Estás seguro que deseas cancelar la admisión de ${visitToCancel?.patient.full_name}? Esta acción no se puede deshacer.`}
          actionText="Anular"
          cancelText="Cancelar"
          onConfirm={handleConfirmCancel}
        />
      </div>
    </AppLayout>
  )
}
