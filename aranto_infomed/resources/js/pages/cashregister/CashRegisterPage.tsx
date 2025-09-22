  import { ColumnDef } from '@tanstack/react-table';
  import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { GenericDataTable } from '@/components/common/GenericDataTable';
import TooltipComponent from '@/components/common/TooltipComponent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types/index.d';
import { toast } from 'sonner';
import { formatPrice } from '../reception';

interface User {
  id: number;
  full_name: string;
}

export interface CashRegisterOpening {
  id: number;
  cashier: { id: number; name: string };
  opening_amount: number;
  total_sales: number;
  total_expenses: number;
  total_incomes: number;
  cash_balance: number;
  opened_at: string;
  closed_at: string | null;
  is_open: boolean;
}

interface Props {
  openings: CashRegisterOpening[];
  users: User[];
}


  //import { useFetchCashRegisterOpenings } from '@/hooks/useFetchCashRegisterOpenings';


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
    // {
    //   accessorKey: 'sede.nombre',
    //   header: 'Sede',
    //   cell: ({ row }) => row.original.sede?.nombre ?? '',
    // },
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
  interface Props {
  openings: CashRegisterOpening[];
}


const CashRegisterPage: React.FC<Props> = ({ openings,users }) => {
   // const { data, loading, error } = useFetchCashRegisterOpenings();
   const [showModal, setShowModal] = useState(false);
  const [selectedCashier, setSelectedCashier] = useState<number | null>(null);
  const [openingAmount, setOpeningAmount] = useState<number>(0);

  // Obtener el último cash_balance como monto de apertura
  useEffect(() => {
    if (openings.length > 0) {
      const lastClosed = [...openings]
        .filter(o => !o.is_open && o.closed_at)
        .sort((a, b) => (b.closed_at! > a.closed_at! ? 1 : -1))[0];
        const openingAmountNumber = Number(lastClosed.cash_balance);
      setOpeningAmount(lastClosed ? openingAmountNumber: 0);
    } else {
      setOpeningAmount(0);
    }
  }, [openings]);

  const handleNew = () => setShowModal(true);

  const handleConfirmOpen = () => {
    if (!selectedCashier) {
      toast.error("Debe seleccionar un cajero.");
      return;
    }
    toast("¿Confirma la apertura de caja?", {
      action: {
        label: "Confirmar",
        onClick: () => {
          router.post('/cash-register/open', {
            cashier_id: selectedCashier,
            opening_amount: openingAmount,
          }, {
            onSuccess: () => {
              toast.success("Caja abierta correctamente.");
              setShowModal(false);
              setSelectedCashier(null);
            },
            onError: () => {
              toast.error("Error al abrir la caja.");
            }
          });
        }
      }
    });
  };

    return (
       <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Aperturas y cierres de caja" />
         <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto"> 
         {/* {loading && <div className="mb-4">Cargando...</div>}
        {error && <div className="mb-4 text-red-500">{error}</div>} */}
          <div className="flex justify-end">
          <Button onClick={handleNew}>Abrir caja</Button>
        </div>
        <GenericDataTable columns={columns} data={openings} />

        {/* Ejemplo de botón con tooltip y modal para apertura de caja */}
        <div className="mt-6 flex gap-2">
          <TooltipComponent message="Abrir nueva caja">
           <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <h3 className="text-lg font-bold mb-2">Apertura de caja</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Importe Inicial Gs</label>
              <div className="w-full border rounded px-2 py-1 bg-gray-100 text-lg">
                {formatPrice(Number(openingAmount) || 0)}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Cajero</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={selectedCashier ?? ''}
                onChange={e => setSelectedCashier(Number(e.target.value))}
              >
                <option value="">Seleccione un cajero</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.full_name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="default" onClick={handleConfirmOpen}>Confirmar apertura</Button>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
          </TooltipComponent>
        </div>
        </div>
      </AppLayout>
    );
  };

  export default CashRegisterPage;
