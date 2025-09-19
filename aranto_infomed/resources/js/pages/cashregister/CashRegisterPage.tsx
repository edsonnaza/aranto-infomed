import React from 'react';
import { GenericDataTable } from '@/components/common/GenericDataTable';
import TooltipComponent from '@/components/common/TooltipComponent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types/index.d';
// Tipos para caja
export interface CashRegisterOpening {
  id: number;
  cashier: { id: number; name: string };
  sede: { id: number; nombre: string };
  opening_amount: number;
  total_sales: number;
  total_expenses: number;
  total_incomes: number;
  cash_balance: number;
  opened_at: string;
  closed_at: string | null;
    is_open: boolean;
}


  import { useFetchCashRegisterOpenings } from '@/hooks/useFetchCashRegisterOpenings';
  import { ColumnDef } from '@tanstack/react-table';

  const columns: ColumnDef<CashRegisterOpening>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'cashier.name',
      header: 'Cajero',
      cell: ({ row }) => row.original.cashier?.name ?? '',
    },
    {
      accessorKey: 'sede.nombre',
      header: 'Sede',
      cell: ({ row }) => row.original.sede?.nombre ?? '',
    },
    {
      accessorKey: 'opening_amount',
      header: 'Monto Apertura',
    },
    {
      accessorKey: 'total_sales',
      header: 'Ventas',
    },
    {
      accessorKey: 'total_expenses',
      header: 'Gastos',
    },
    {
      accessorKey: 'total_incomes',
      header: 'Ingresos',
    },
    {
      accessorKey: 'cash_balance',
      header: 'Saldo',
    },
    {
      accessorKey: 'opened_at',
      header: 'Apertura',
    },
    {
      accessorKey: 'closed_at',
      header: 'Cierre',
      cell: ({ row }) => row.original.closed_at ? row.original.closed_at : '—',
    },
    {
      accessorKey: 'is_open',
      header: 'Estado',
      cell: ({ row }) => row.original.is_open ? 'Abierta' : 'Cerrada',
    },
  ];
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Caja",
      href: "/cashregister/openings",
    },
  ]

  const CashRegisterPage: React.FC = () => {
    const { data, loading, error } = useFetchCashRegisterOpenings();

    return (
       <AppLayout breadcrumbs={breadcrumbs}>
        <h2 className="text-2xl font-bold mb-4">Aperturas y cierres de caja</h2>
        {loading && <div className="mb-4">Cargando...</div>}
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <GenericDataTable columns={columns} data={data} />

        {/* Ejemplo de botón con tooltip y modal para apertura de caja */}
        <div className="mt-6 flex gap-2">
          <TooltipComponent message="Abrir nueva caja">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Abrir caja</Button>
              </DialogTrigger>
              <DialogContent>
                <h3 className="text-lg font-bold mb-2">Apertura de caja</h3>
                {/* Aquí iría el formulario de apertura */}
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </TooltipComponent>
        </div>
      </AppLayout>
    );
  };

  export default CashRegisterPage;
