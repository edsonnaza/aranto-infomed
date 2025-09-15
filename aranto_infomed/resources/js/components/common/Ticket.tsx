
import React from "react"
import useSedeData from "@/hooks/useSedeData"
import { TicketProps } from "@/types/ticket"
import {formatPrice} from "@/utils/formatPrice"


const Ticket = React.forwardRef<HTMLDivElement, TicketProps>(({ data }, ref) => {
  const { sede } = useSedeData();
  if (!data) return null;

  const total = data.order.items.reduce((acc, item) => acc + Number(item.total_price), 0);

  return (
    <div
      ref={ref}
      style={{
        width: "80mm",
        fontSize: "11px",
        fontFamily: "monospace",
        padding: "8px 4px",
        background: "#fff",
      }}
    >
<div style={{ textAlign: "center", marginBottom: 16 }}>
  <h2 style={{ margin: 0, fontSize: "16px", letterSpacing: 1 }}>{sede?.company_name}</h2>
  {/* Número de visita y fecha/hora */}
  {data.visit_id && (
    <div style={{ fontSize: "11px", marginTop: 2 }}>
      <strong>Visita N°:</strong> {data.visit_id}
    </div>
  )}
  {data.created_at && (
    <div style={{ fontSize: "11px" }}>
      <strong>Fecha:</strong> {new Date(data.created_at).toLocaleDateString()} {new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  )}
  <div style={{ margin: "12px 0 0 0", fontSize: "12px" }}>
    <strong>Paciente:</strong> {data.patient.full_name}
  </div>
  {data.order.seguro_name && (
    <div style={{ fontSize: "12px" }}>
      <strong>Seguro:</strong> {data.order.seguro_name}
    </div>
  )}
  {data.order.professional_name && (
    <div style={{ fontSize: "12px" }}>
      <strong>Profesional:</strong> {data.order.professional_name}
    </div>
  )}
</div>
      <hr style={{ margin: "10px 0" }} />
      <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #000", paddingBottom: 3, fontSize: "11px" }}>
        <span style={{ width: 18 }}>#</span>
        <span style={{ flex: 2 }}>Servicio</span>
        <span style={{ flex: 1 }}>Seguro</span>
      </div>
      {data.order.items.map((item, idx) => (
        <div key={idx} style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
            <span style={{ width: 18 }}>{idx + 1}</span>
            <span style={{ flex: 2 }}>{item.service_name}</span>
            <span style={{ flex: 1 }}>{item.seguro_name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "10px", color: "#333", marginLeft: 18 }}>
            <span style={{ flex: 1 }}><strong>Profesional:</strong> {item.professional?.full_name}</span>
            <span style={{ width: 40, textAlign: "right" }}><strong>Cant:</strong> {item.quantity}</span>
            <span style={{ width: 60, textAlign: "right" }}><strong>Subtotal:</strong> {formatPrice(Number(item.total_price))}</span>
          </div>
          <hr style={{ margin: "2px 0 2px 0", border: 0, borderTop: "1px dotted #ccc" }} />
        </div>
      ))}
      <hr style={{ margin: "10px 0" }} />
      <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "13px" }}>
        Total: {formatPrice(total)}
      </div>
      <div style={{ textAlign: "center", marginTop: 12, fontSize: "11px" }}>
        ¡Gracias por su visita!
      </div>
    </div>
  );
});

Ticket.displayName = "Ticket"
export default Ticket
