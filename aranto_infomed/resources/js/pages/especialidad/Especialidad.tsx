"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Check, X } from "lucide-react"
import { toast } from "sonner" // ✅ usar sonner
import { GenericDataTable } from "@/components/common/GenericDataTable"
import { EspecialidadModal } from "./EspecialidadModal"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { BreadcrumbItem } from "@/types"  


export interface Especialidad {
  id: number
  nombre: string
  active: boolean
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Especialidades',
        href: '/especialidades',
    },      
] 

export default function Especialidad({ data }: { data: Especialidad[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Especialidad | null>(null)

  const handleToggleActive = (esp: Especialidad) => {
    // Aquí iría tu petición API real con Inertia o fetch
    toast.success(
      esp.active
        ? "Especialidad desactivada correctamente."
        : "Especialidad activada correctamente."
    )
  }

  const handleEdit = (esp: Especialidad) => {
    setSelected(esp)
    setModalOpen(true)
  }

  const handleNew = () => {
    setSelected(null)
    setModalOpen(true)
  }

  const columns: ColumnDef<Especialidad>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    {
      accessorKey: "active",
      header: "Activo",
      cell: ({ row }) => {
        const esp = row.original
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleToggleActive(esp)}
          >
            {!esp.active ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
          </Button>
        )
      },
    },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Especialidades" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        
      <div className="flex justify-end">
        <Button onClick={handleNew}>Nueva Especialidad</Button>
      </div>

      <GenericDataTable
        columns={columns}
        data={data}
        filterColumn="nombre"
        renderActions={(row) => (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleActive(row)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        )}
      />

      {modalOpen && (
        <EspecialidadModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          especialidad={selected}
        />
      )}
    </div>
    </AppLayout>
  )
}
