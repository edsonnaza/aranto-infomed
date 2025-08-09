"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Check, X } from "lucide-react"
import { toast } from "sonner"
import { GenericDataTable } from "@/components/common/GenericDataTable"
import { TipoServicioModal } from "./TipoServicioModal"
import AppLayout from "@/layouts/app-layout"
import { Head, router } from "@inertiajs/react"
import { BreadcrumbItem } from "@/types"  
import TooltipComponent  from "@/components/common/TooltipComponent"

export interface TipoServicio {
  id: number
  name: string
  active: boolean
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tipos de Servicio',
        href: '/tipo-servicios',
    },      
] 

export default function TipoServicios({ data }: { data: TipoServicio[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<TipoServicio | null>(null)

  const handleToggleActive = (ts: TipoServicio) => {
    router.post(
      route("tipo-servicios.toggleActive", ts.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success(
            ts.active
              ? "Tipo de servicio desactivado correctamente."
              : "Tipo de servicio activado correctamente."
          )
        },
        onError: () => toast.error("Error al cambiar el estado"),
      }
    )
  }

  const handleEdit = (ts: TipoServicio) => {
    setSelected(ts)
    setModalOpen(true)
  }

  const handleNew = () => {
    setSelected(null)
    setModalOpen(true)
  }

  const columns: ColumnDef<TipoServicio>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Nombre" },
    {
      accessorKey: "active",
      header: "Activo",
      cell: ({ row }) => {
        const ts = row.original
        return (
          <TooltipComponent message={ts.active ? `Desactivar ${ts.name} ?` : `Activar ${ts.name} ?`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleActive(ts)}
            >
              {ts.active ? (
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
      <Head title="Tipos de Servicio" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        
        <div className="flex justify-end">
          <Button onClick={handleNew}>Nuevo Tipo de Servicio</Button>
        </div>

        <GenericDataTable
          columns={columns}
          data={data}
          filterColumn="name"
          renderActions={(row) => (
            <div className="flex gap-2">
              <TooltipComponent message={`Editar ${row.name} ?`}> 
                <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </TooltipComponent>
              
              <TooltipComponent message={row.active ? `Desactivar ${row.name} ?` : `Activar ${row.name} ?`}>
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
          <TipoServicioModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            tiposervicio={selected}
          />
        )}
      </div>
    </AppLayout>
  )
}
