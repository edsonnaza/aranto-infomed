"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Check, X } from "lucide-react"
import { toast } from "sonner"
import { GenericDataTable } from "@/components/common/GenericDataTable"
import AppLayout from "@/layouts/app-layout"
import { Head, router } from "@inertiajs/react"
import TooltipComponent from "@/components/common/TooltipComponent"
import { ProfesionalModal } from "./ProfesionalModal"
import { BreadcrumbItem } from "@/types"

export interface Especialidad {
  id: number
  nombre: string
}

export interface Profesional {
  id: number
  name: string
  last_name: string
  especialidad: Especialidad | null
  active: boolean
  comision_percentage?: number
  email?: string
  phone_number?: string
  fecha_alta?: string
  doc_cdi?: string
  comision_interno?: string
  comision_externo?: string
}

interface Props {
  data: Profesional[]
  especialidades: Especialidad[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Profesionales",
    href: "/profesionales",
  },
]

export default function Profesionales({ data, especialidades }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Profesional | null>(null)

  const handleToggleActive = (prof: Profesional) => {
    router.post(
      route("profesionales.toggleActive", prof.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success(
            prof.active
              ? "Profesional desactivado correctamente."
              : "Profesional activado correctamente."
          )
        },
        onError: () => toast.error("Error al cambiar el estado"),
      }
    )
  }

  const handleEdit = (prof: Profesional) => {
    setSelected(prof)
    setModalOpen(true)
  }

  const handleNew = () => {
    setSelected(null)
    setModalOpen(true)
  }

  const columns: ColumnDef<Profesional>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "last_name", header: "Apellido" },
    {
      accessorKey: "especialidad.nombre",
      header: "Especialidad",
      cell: ({ row }) => row.original.especialidad?.nombre ?? "—",
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone_number", header: "Teléfono" },
    { accessorKey: "comision_percentage", header: "Comisión %" },
    {
      accessorKey: "active",
      header: "Activo",
      cell: ({ row }) => {
        const prof = row.original
        return (
          <TooltipComponent
            message={
              prof.active
                ? `Desactivar ${prof.name} ${prof.last_name}?`
                : `Activar ${prof.name} ${prof.last_name}?`
            }
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleActive(prof)}
            >
              {prof.active ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
            </Button>
          </TooltipComponent>
        )
      },
    },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profesionales" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="flex justify-end">
          <Button onClick={handleNew}>Nuevo Profesional</Button>
        </div>

        <GenericDataTable
          columns={columns}
          data={data}
          filterColumn="name"
          renderActions={(row) => (
            <div className="flex gap-2">
              <TooltipComponent
                message={`Editar ${row.name} ${row.last_name}?`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(row)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </TooltipComponent>

              <TooltipComponent
                message={
                  row.active
                    ? `Desactivar ${row.name}?`
                    : `Activar ${row.name}?`
                }
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleActive(row)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TooltipComponent>
            </div>
          )}
        />

        {modalOpen && (
          <ProfesionalModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            profesional={selected}
            especialidades={especialidades}
          />
        )}
      </div>
    </AppLayout>
  )
}
