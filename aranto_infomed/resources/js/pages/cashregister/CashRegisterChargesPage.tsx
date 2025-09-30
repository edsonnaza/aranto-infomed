import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { GenericDataTable } from '@/components/common/GenericDataTable';
import { PendingService } from '@/types/cashregister-charges';
import { DateRangePicker, DateRangeValue } from '@/components/common/DateRangePicker';
import { StatusSelect } from '@/components/common/StatusSelect';
import { Info, Wallet, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModalItemsGeneric } from '@/components/common/ModalItemsGeneric';
import { ModalCobroServicio } from '@/components/cashregister/ModalCobroServicio';
import { useCurrentCashRegisterState } from '@/hooks/useCurrentCashRegisterState';
import { useCashRegisterStore } from '@/stores/useCashRegisterStore';
import { toast } from 'sonner';

const columns = [
  { accessorKey: 'item_id', header: 'ID' },  
  { accessorKey: 'service_name', header: 'Servicio' },
  { accessorKey: 'professional', header: 'Profesional' },
  { accessorKey: 'patient', header: 'Paciente' },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }: { row: { original: PendingService } }) => {
      const value = row.original.status;
      if (value === 'pending') return <span className="text-yellow-600 font-semibold">Pendiente</span>;
      if (value === 'paid') return <span className="text-green-600 font-semibold">Pagado</span>;
      if (value === 'cancelled') return <span className="text-red-600 font-semibold">Cancelado</span>;
      return value;
    },
  },
  //{ accessorKey: 'quantity', header: 'Cantidad' },
 // { accessorKey: 'unit_price', header: 'Precio unitario' },
  { accessorKey: 'total_price', header: 'Total c/ Desc.' },
  {
    accessorKey: 'created_at',
    header: 'Fecha/Hora registro',
    cell: ({ row }: { row: { original: PendingService } }) => {
      const value = row.original.created_at;
      if (!value) return '';
      const date = new Date(value.replace(' ', 'T'));
      return date.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
  },
];


import { router } from '@inertiajs/react';

const CashRegisterChargesPage: React.FC = () => {
  const { pendingServices = [], links = [], auth } = (usePage().props as unknown) as { pendingServices: PendingService[], links?: Array<{ url: string | null; label: string; active: boolean }>, auth: { user: { id: number } } };
  const today = React.useMemo(() => {
    const now = new Date();
    return { from: now, to: now };
  }, []);
  const [range, setRange] = React.useState<DateRangeValue>(today);
  const [status, setStatus] = React.useState<string>('pending');

  // Estado global de caja/cajero
  useCurrentCashRegisterState(auth.user.id);
  const { isCashier, hasOpenCashRegister, openCashRegister } = useCashRegisterStore();

  React.useEffect(() => {
    if (range.from && range.to) {
      const format = (d: Date) => `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      router.get('/cash-register/charges', { start_date: format(range.from), end_date: format(range.to), status }, { preserveState: true, replace: true });
    }
  }, [range, status]);

  // Estado para modal de info y cobro
  const [selectedService, setSelectedService] = React.useState<PendingService | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalCobroOpen, setModalCobroOpen] = React.useState(false);

  const handleInfo = (service: PendingService) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleCobroModal = (service: PendingService) => {
    if (!isCashier || !hasOpenCashRegister) {
      toast.error('Solo el cajero con caja abierta puede registrar cobros.');
      return;
    }
    setSelectedService(service);
    setModalCobroOpen(true);
  };

  // handlePay eliminado, se usa el modal

  // Acción de cancelación
  const handleCancel = async (service: PendingService) => {
    router.post(`/cash-register/charges/${service.item_id}/cancel`, {}, {
      onSuccess: () => toast.success('Cobro cancelado correctamente'),
      onError: () => toast.error('No se pudo cancelar el cobro'),
      preserveState: true,
      replace: true,
    });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Cobros', href: '/cash-register/charges' }]}> 
      <Head title="Cobros de pacientes" />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Cobros pendientes de pacientes</h2>
        <div className="flex items-center gap-4 mb-4">
          <span>Filtrar por rango de fechas:</span>
          <DateRangePicker value={range} onChange={setRange} />
          <StatusSelect value={status} onChange={setStatus} />
        </div>
        <GenericDataTable
          columns={columns}
          data={pendingServices}
          links={Array.isArray(links) ? links : []}
          serverSidePagination
          renderActions={(row: PendingService) => (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={row.status !== 'pending' || !isCashier || !hasOpenCashRegister}
                title="Cobrar"
                style={{ cursor: row.status === 'pending' && isCashier && hasOpenCashRegister ? 'pointer' : 'not-allowed' }}
                onClick={() => row.status === 'pending' && isCashier && hasOpenCashRegister && handleCobroModal(row)}
              >
                <Wallet className={row.status === 'pending' && isCashier && hasOpenCashRegister ? 'text-green-600' : 'opacity-30'} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={row.status !== 'paid'}
                title="Cancelar"
                style={{ cursor: row.status === 'paid' ? 'pointer' : 'not-allowed' }}
                onClick={() => row.status === 'paid' && handleCancel(row)}
              >
                <XCircle className={row.status === 'paid' ? 'text-red-600' : 'opacity-30'} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Info"
                onClick={() => handleInfo(row)}
                style={{ cursor: 'pointer' }}
              >
                <Info className="text-blue-600" />
              </Button>
            </div>
          )}
        />
        {/* Modal de cobro fuera del renderActions */}
        {selectedService && openCashRegister && (
          <ModalCobroServicio
            open={modalCobroOpen}
            onClose={() => setModalCobroOpen(false)}
            service={selectedService}
            cashierName={openCashRegister.cashier?.full_name ?? ''}
            openingNumber={openCashRegister.id}
            onConfirm={(paymentMethod, notes) => {
              router.post(`/cash-register/charges/${selectedService.item_id}/pay`, {
                payment_method: paymentMethod,
                notes,
                opening_id: openCashRegister.id,
              }, {
                onSuccess: () => {
                  toast.success('Cobro registrado correctamente');
                  setModalCobroOpen(false);
                },
                onError: () => toast.error('No se pudo registrar el cobro'),
                preserveState: true,
                replace: true,
              });
            }}
          />
        )}
        {selectedService && (
          <ModalItemsGeneric
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title={`Servicio #${selectedService.order_id}`}
            items={[selectedService]}
            footer={selectedService.status === 'paid' ? (
              <Button variant="destructive" onClick={() => handleCancel(selectedService)}>
                Cancelar cobro
              </Button>
            ) : null}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default CashRegisterChargesPage;
