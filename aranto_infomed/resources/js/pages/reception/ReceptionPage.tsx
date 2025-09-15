import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types/index.d"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { router } from "@inertiajs/react"
import { useReceptionStore } from "@/stores/useReceptionStore"
import { useReactToPrint } from "react-to-print"
import Ticket from "@/components/common/Ticket"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Seguro, Professional, Patient } from "@/types"
import { TicketData } from "@/types/ticket"
import { PatientInput, CartTable } from "./index"
import { SeguroSelect } from "@/components/SeguroSelect/SeguroSelect"
import { ProfessionalInput } from "@/components/ProfessionalInput/ProfesionalInput"
import { VisitPayload, VisitPayloadSchema } from "@/types/reception";
import useSedeData from "@/hooks/useSedeData"
import { usePage } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Ingresar Paciente en Recepción", href: "/reception" }]

type ReceptionPageProps = {
  seguros: Seguro[];
  professionals: Professional[];
};


export default function ReceptionPage({ seguros, professionals }: ReceptionPageProps) {
  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [showTicketModal, setShowTicketModal] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [seguroSeleccionado, setSeguroSeleccionado] = useState<Seguro | null>(null);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<Professional | null>(null);
  // Remove this incorrect usage, use the correct one below
  const [loading, setLoading] = useState(false)
  const { patient, orders, addOrderItem, updateOrderItem, removeOrderItem, reset } = useReceptionStore()
  const { props } = usePage();
  const flash = props.flash as { success?: string; visit_id?: number; created_at?: string; ticket_data?: TicketData };




const handlePrint = useReactToPrint({ contentRef });


// const handlePrint = useReactToPrint({
//   content: () => contentRef.current,
// });

 // 🟢 1. Cuando ticketData cambia, imprime
useEffect(() => {
  if (ticketData) {
    setShowTicketModal(true);
    handlePrint();
  }
}, [ticketData, handlePrint]);

// 🟢 2. Solo setea el ticket cuando llega el flash
useEffect(() => {
  if (flash.ticket_data) {
    setTicketData(flash.ticket_data);
    reset(); // limpiar el formulario/store
  }
}, [flash.ticket_data, reset]);


 const { sede } = useSedeData();

 const preparePayload = (): VisitPayload | null => {
  if (!patient || !orders || !orders.items.length) {
    toast.error("Por favor, seleccione un paciente y agregue al menos un servicio.");
    return null;
  }

  // Obtener profesional y sede seleccionados o usar el primero del carrito como fallback
  const profesionalId = profesionalSeleccionado?.id ?? orders.items[0]?.professional?.id;
  const sedeId = sede?.id;
  if (!profesionalId) {
    toast.error("Debe seleccionar un profesional para la visita.");
    return null;
  }
  if (!sedeId) {
    toast.error("Debe seleccionar una sede para la visita.");
    return null;
  }

  const items = orders.items.map(item => ({
    service_id: item.service_id,
    service_name: item.service_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    discount_amount: item.discount_amount ?? 0,
    total_price: item.total_price,
    professional: {
      id: item.professional.id,
      full_name: item.professional.full_name,
      commission_percentage: item.professional.commission_percentage,
    },
    commission_percentage: item.professional.commission_percentage ?? 0,
  }));

  const payload: VisitPayload = {
    patient_id: Number(patient.id),
    professional_id: profesionalId,
    seguro_id: seguroSeleccionado?.id ?? null,
    sede_id: sedeId,
    visit_status: "waiting",
    created_by: null,
    order: {
      professional_id: profesionalId,
      total_amount: orders.total_amount_items,
      discount_amount: 0,
      discount_percent: 0,
      final_amount: orders.total_amount_items,
      commission_percentage: 0,
      commission_amount: 0,
      status: orders.status,
      created_by: null,
      items,
    }
  };

  console.log("Payload preparado para enviar:", payload);

  const result = VisitPayloadSchema.safeParse(payload);
  if (!result.success) {
    toast.error("Error de validación en los datos a enviar.");
    console.error(result.error.format());
    return null;
  }
  return payload;
};

  const handleConfirm = () => {
    const payload = preparePayload();
    if (!payload) return;
    setLoading(true);
    router.post(route("reception.storePatientVisit"), payload, {
      preserveScroll: true,
     onSuccess: () => {
      toast.success("Visita registrada correctamente");
      setLoading(false);
    },
      onError: (errors) => {
        const messages = Object.values(errors).flat().join(". ");
        toast.error(`❌ Error al intentar registrar la visita: ${messages}`);
      },
      onFinish: () => setLoading(false),
    });
  };

  function handleSelectPatient(patient: Patient | null): void {
    useReceptionStore.getState().setPatient(patient);
  }
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Recepción" />
      <div className="grid gap-6 p-6 grid-cols-2">
        <PatientInput value={patient} onSelect={handleSelectPatient} />
        <SeguroSelect seguros={seguros} value={seguroSeleccionado} onChange={setSeguroSeleccionado} />
        <ProfessionalInput professionals={professionals} value={profesionalSeleccionado} onSelect={setProfesionalSeleccionado} />
        <CartTable
          order={orders}
          addOrderItem={addOrderItem}
          updateOrderItem={updateOrderItem}
          removeOrderItem={removeOrderItem}
          seguro={seguroSeleccionado}
          profesional={profesionalSeleccionado}
        />
      </div>
      <div className="col-span-2 flex justify-end p-6">
        <Button className="bg-blue-600 cursor-pointer hover:bg-blue-900" onClick={handleConfirm} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Guardando..." : "Confirmar y Enviar a Caja"}
        </Button>
      </div>

<Dialog
  open={showTicketModal && !!ticketData}
  onOpenChange={(open) => {
    setShowTicketModal(open);
    if (!open) setTicketData(null);
  }}
>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Ticket de Atención</DialogTitle>
    </DialogHeader>
    <div ref={contentRef}>
      {ticketData && <Ticket data={ticketData} />}
    </div>
    <DialogFooter className="flex gap-2">
      <Button variant="outline" className="cursor-pointer" onClick={() => handlePrint()}>Imprimir</Button>
      <Button className="cursor-pointer" onClick={() => {
        setShowTicketModal(false);
        setTicketData(null);
      }}>Cerrar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </AppLayout>
  )
}