"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ModalAlertGenericProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  actionText?: string
  cancelText?: string
  onConfirm?: () => void
}

export function ModalAlertGeneric({
  open,
  onClose,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  actionText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
}: ModalAlertGenericProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">{cancelText}</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => {
                if (onConfirm) onConfirm()
                onClose()
              }}
            >
              {actionText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
