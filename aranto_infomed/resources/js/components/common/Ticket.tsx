import React from "react"
import { PatientVisit, Orders } from "@/types/reception"
import  useSedeData  from "@/hooks/useSedeData"


interface TicketProps {
  data: Orders | null

}


const Ticket = React.forwardRef<HTMLDivElement, TicketProps>(({ data }, ref) => {
    const { sede } = useSedeData();
    console.log('Ticket data in Ticket component:', data);
    if (!data) return null
    
  return (
    <div
      ref={ref}
      style={{
        width: "80mm",
        fontSize: "12px",
        fontFamily: "monospace",
        padding: "5px",
      }}
    >
    <h2 style={{ textAlign: "center" }}>{sede?.company_name}</h2>
    <p><strong>Paciente:</strong> {data?.orders[0]?.patient?.full_name}</p>
    <p><strong>Seguro:</strong> {data.order.seguro_name}</p>
    <p><strong>Profesional:</strong> {data.order.professional_name}</p>

      <hr />
        {data.orders.flatMap(order => order.items).map((item, idx) => (
        <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{idx + 1}</span>
            <span>{item.professional?.full_name}</span>
            <span>{item.service_name} ({item.quantity}x)</span>
            <span>{item.total_price}</span>
            <span>Profesional: {item?.professional?.full_name}</span>
        </div>
        ))}
      <hr />
      <p style={{ textAlign: "right" }}>
        <strong>Total: {data.orders.flatMap(order => order.items).reduce((acc, item) => acc + Number(item.total_price), 0)} </strong>
      </p>
      <p style={{ textAlign: "center" }}>¡Gracias por su visita!</p>
    </div>
  )
})

Ticket.displayName = "Ticket"
export default Ticket
