// utils/statusIcons.tsx
import { Circle, CheckCircle, XCircle } from "lucide-react"
import React from "react"

export type OrderStatus = "pending" | "confirmed" | "cancelled" | "waiting" | "in_progress" | "completed" | "delivered"

interface StatusIconProps {
  status: OrderStatus
}

const statusLabels: Record<OrderStatus, string> = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    waiting: "En espera",
    in_progress: "En progreso",
    completed: "Completado",
    delivered: "Entregado",
  }


export function StatusIcon({ status }: StatusIconProps) {
  let icon
  let color

  switch (status) {
    case "pending":
      icon = <Circle className="w-4 h-4 text-yellow-500 inline-block mr-1" />
      color = "text-yellow-500"
      break
    case "confirmed":
      icon = <CheckCircle className="w-4 h-4 text-green-500 inline-block mr-1" />
      color = "text-green-500"
      break
    case "cancelled":
      icon = <XCircle className="w-4 h-4 text-red-500 inline-block mr-1" />
      color = "text-red-500"
      break
    case "waiting":
      icon = <Circle className="w-4 h-4 text-blue-500 inline-block mr-1" />
      color = "text-blue-500"
      break
    case "in_progress":
      icon = <Circle className="w-4 h-4 text-purple-500 inline-block mr-1" />
      color = "text-purple-500"
      break
    case "completed":
      icon = <CheckCircle className="w-4 h-4 text-teal-500 inline-block mr-1" />
      color = "text-teal-500"
      break
    case "delivered":
      icon = <CheckCircle className="w-4 h-4 text-indigo-500 inline-block mr-1" />
      color = "text-indigo-500"
      break
    default:
      icon = <Circle className="w-4 h-4 text-gray-500 inline-block mr-1" />
      color = "text-gray-500"
  }

  return (
    <span className={`flex items-center gap-1 ${color}`}>
      {icon}
      {statusLabels[status]}
    </span>
  )
}
