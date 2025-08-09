"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { router } from "@inertiajs/react"

interface Props {
  open: boolean
  onClose: () => void
  tiposervicio?: { id: number; name: string; active: boolean } | null
}

export function TipoServicioModal({ open, onClose, tiposervicio }: Props) {
  const [name, setName] = useState("")

  useEffect(() => {
    setName(tiposervicio?.name ?? "")
  }, [tiposervicio])

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("El nombre es obligatorio.")
      return
    }

    if (tiposervicio) {
      // Editar
      router.put(
        route("tipo-servicios.update", tiposervicio.id),
        { name, active: tiposervicio.active, sede_id: 1 },
        {
          preserveScroll: true,
          onSuccess: () => {
            toast.success(`Tipo de servicio "${name}" actualizado correctamente.`)
            onClose()
          },
          onError: () => toast.error("Error al actualizar"),
        }
      )
    } else {
      // Nuevo
      router.post(
        route("tipo-servicios.store"),
        { name, active: true, sede_id: 1 },
        {
          preserveScroll: true,
          onSuccess: () => {
            toast.success(`Tipo de servicio "${name}" creado correctamente.`)
            onClose()
          },
          onError: () => toast.error("Error al crear"),
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tiposervicio ? "Editar Tipo de Servicio" : "Nuevo Tipo de Servicio"}
          </DialogTitle>
        </DialogHeader>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del tipo de servicio"
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {tiposervicio ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
