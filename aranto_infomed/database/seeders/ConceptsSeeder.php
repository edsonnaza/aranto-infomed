<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConceptsSeeder extends Seeder
{
    public function run(): void
    {
        // === 1. Migramos los conceptos originales del legacy ===
        $legacyConcepts = DB::connection('legacy_mysql')
            ->table('conceptos')
            ->get();

        foreach ($legacyConcepts as $concept) {
            
            DB::table('concepts')->updateOrInsert(
                ['id' => $concept->id],
                [
                    'name'       => $concept->nombre,
                    'type'       => 'income', // todos los legacy son ingresos
                    'active'     => $concept->activo=='SI' ? true : false,
                    'sede_id'    => 1,
                    'created_at' => $concept->created_at ?? now(),
                    'updated_at' => $concept->updated_at ?? now(),
                ]
            );
        }

        // === 2. Insertamos nuevos conceptos para Expenses ===
        $expenseConcepts = [
            ['id' => 1001, 'name' => 'Pago de Proveedores'],
            ['id' => 1002, 'name' => 'Pago de Salarios'],
            ['id' => 1003, 'name' => 'Pago de Alquiler'],
            ['id' => 1004, 'name' => 'Adelanto de Salarios'],
            ['id' => 1005, 'name' => 'Pago de Comisiones'],
            ['id' => 1006, 'name' => 'Mantenimiento y Reparaciones'],
            ['id' => 1007, 'name' => 'Servicios Básicos'],
            ['id' => 1008, 'name' => 'Otros Egresos'],
        ];

        foreach ($expenseConcepts as $concept) {
            DB::table('concepts')->updateOrInsert(
                ['id' => $concept['id']],
                [
                    'name'       => $concept['name'],
                    'type'       => 'expense',
                    'active'     => 1,
                    'sede_id'    => 1, // podríamos ajustar por sede si hace falta
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
