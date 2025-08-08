"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner" // ✅ usar sonner

interface Props {
  open: boolean
  onClose: () => void
  especialidad?: { id: number; nombre: string; active: boolean } | null
}

export function EspecialidadModal({ open, onClose, especialidad }: Props) {
  const [nombre, setNombre] = useState("")

  useEffect(() => {
    setNombre(especialidad?.nombre ?? "")
  }, [especialidad])

  const handleSave = () => {
    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio.")
      return
    }

    if (especialidad) {
      // actualizar
      toast.success(`Especialidad "${nombre}" actualizada correctamente.`)
    } else {
      // crear nueva
      toast.success(`Especialidad "${nombre}" creada correctamente.`)
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {especialidad ? "Editar Especialidad" : "Nueva Especialidad"}
          </DialogTitle>
        </DialogHeader>

        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la especialidad"
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {especialidad ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
