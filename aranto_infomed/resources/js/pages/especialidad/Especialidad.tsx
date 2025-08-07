import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { GenericDataTable } from '@/components/common/GenericDataTable';
import { EspecialidadProps  } from '@/types';
import { ColumnDef } from '@tanstack/react-table'; // or wherever ColumnDef is defined

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Especialidades',
        href: '/especialidades',
    },      
]


const columns: ColumnDef<{ id: number; nombre: string; active: boolean; }>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'active',
    header: 'Activo',
    cell: info => info.getValue() ? 'Sí' : 'No',
  },
];

const Especialidad = ({ data }: EspecialidadProps) => {
  return (
   <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Especialidades" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <GenericDataTable
                    columns={columns}
                    data={data}
                    filterColumn="nombre"
                />
            </div>
        </div>
    </AppLayout>
  );
};

export default Especialidad;
