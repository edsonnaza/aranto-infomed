// types/reception.ts
import { z } from "zod"

export const VisitOrderItemSchema = z.object({
  service_id: z.number(),
  service_name: z.string(),
  quantity: z.number(),
  unit_price: z.number(),
  discount_amount: z.number(),
  total_price: z.number(),
})

export const VisitOrderSchema = z.object({
  professional_id: z.number().nullable(),
  total_amount: z.number(),
  discount_amount: z.number(),
  discount_percent: z.number(),
  final_amount: z.number(),
  commission_percentage: z.number(),
  commission_amount: z.number(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
  created_by: z.number().nullable(),
  items: z.array(VisitOrderItemSchema),
})

export const VisitPayloadSchema = z.object({
  patient_id: z.number().nullable(),
  professional_id: z.number().nullable(),
  seguro_id: z.number().nullable(),
  sede_id: z.number().nullable(),
  visit_status: z.enum(["scheduled", "waiting", "in_progress", "completed", "cancelled"]),
  created_by: z.number().nullable(),
  order: VisitOrderSchema,
})

export type VisitPayload = z.infer<typeof VisitPayloadSchema>
