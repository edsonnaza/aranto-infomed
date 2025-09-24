import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { GenericDataTable } from '@/components/common/GenericDataTable';
import { PendingService } from '@/types/cashregister-charges';
import { DatePicker } from '@/components/common/DatePicker';

const columns = [
  { accessorKey: 'service_name', header: 'Servicio' },
  { accessorKey: 'professional', header: 'Profesional' },
  { accessorKey: 'patient', header: 'Paciente' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'quantity', header: 'Cantidad' },
  { accessorKey: 'unit_price', header: 'Precio unitario' },
  { accessorKey: 'total_price', header: 'Total c/ Desc.' },
  { accessorKey: 'created_at', header: 'Fecha/Hora registro' },
];


import { router } from '@inertiajs/react';

const CashRegisterChargesPage: React.FC = () => {
  const { pendingServices = [], links = [], filterDate = '' } = (usePage().props as unknown) as { pendingServices: PendingService[], links?: { url: string; label: string; active: boolean }[], filterDate?: string };
  const [date, setDate] = React.useState<string>(filterDate || new Date().toISOString().slice(0, 10));

  // Recargar al cambiar la fecha
  React.useEffect(() => {
    if (date) {
      router.get('/cash-register/charges', { date }, { preserveState: true, replace: true });
    }
  }, [date]);

  return (
    <AppLayout breadcrumbs={[{ title: 'Cobros', href: '/cash-register/charges' }]}>
      <Head title="Cobros de pacientes" />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Cobros de pacientes</h2>
        <div className="flex items-center gap-4 mb-4">
          <span>Filtrar por fecha:</span>
          <DatePicker value={date} onChange={setDate} />
        </div>
        <GenericDataTable columns={columns} data={pendingServices} links={links} serverSidePagination />
      </div>
    </AppLayout>
  );
};

export default CashRegisterChargesPage;
