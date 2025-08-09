"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { router } from "@inertiajs/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Especialidad, Profesional } from "./Profesionales"

interface Props {
  open: boolean
  onClose: () => void
  profesional?: Profesional | null
  especialidades: Especialidad[]
}

export function ProfesionalModal({ open, onClose, profesional, especialidades }: Props) {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [especialidadId, setEspecialidadId] = useState<string>("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [comisionPercentage, setComisionPercentage] = useState("")

  useEffect(() => {
    setName(profesional?.name ?? "")
    setLastName(profesional?.last_name ?? "")
    setEspecialidadId(profesional?.especialidad?.id?.toString() ?? "")
    setEmail(profesional?.email ?? "")
    setPhoneNumber(profesional?.phone_number ?? "")
    setComisionPercentage(profesional?.comision_percentage?.toString() ?? "")
  }, [profesional])

  const handleSave = () => {
    if (!name.trim() || !lastName.trim()) {
      toast.error("Nombre y apellido son obligatorios.")
      return
    }

    if (!especialidadId) {
      toast.error("Debe seleccionar una especialidad.")
      return
    }

    const payload = {
      name,
      last_name: lastName,
      especialidad_id: Number(especialidadId),
      email,
      phone_number: phoneNumber,
      comision_percentage: comisionPercentage ? Number(comisionPercentage) : null,
      active: profesional ? profesional.active : true,
      sede_id: 1,
    }

    if (profesional) {
      router.put(
        route("profesionales.update", profesional.id),
        payload,
        {
          preserveScroll: true,
          onSuccess: () => {
            toast.success(`Profesional "${name} ${lastName}" actualizado correctamente.`)
            onClose()
          },
          onError: () => toast.error("Error al actualizar"),
        }
      )
    } else {
      router.post(
        route("profesionales.store"),
        payload,
        {
          preserveScroll: true,
          onSuccess: () => {
            toast.success(`Profesional "${name} ${lastName}" creado correctamente.`)
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
            {profesional ? "Editar Profesional" : "Nuevo Profesional"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
          />

          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Apellido"
          />

          <Select
            value={especialidadId}
            onValueChange={(val) => setEspecialidadId(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una especialidad" />
            </SelectTrigger>
            <SelectContent>
              {especialidades.map((esp) => (
                <SelectItem key={esp.id} value={esp.id.toString()}>
                  {esp.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
          />

          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Teléfono"
          />

          <Input
            value={comisionPercentage}
            onChange={(e) => setComisionPercentage(e.target.value)}
            placeholder="Comisión %"
            type="number"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {profesional ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
