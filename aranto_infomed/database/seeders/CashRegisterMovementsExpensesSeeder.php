<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CashRegisterMovementsExpensesSeeder extends Seeder
{
    public function run(): void
    {
        DB::connection('legacy_mysql')
            ->table('turnosdet')
            ->orderBy('id')
            ->chunk(1000, function ($records) {
                foreach ($records as $rec) {
                    $openingId = DB::table('cash_register_openings')
                        ->where('id', $rec->idturnoscab)
                        ->value('id');

                    if (!$openingId) {
                        continue;
                    }

                    DB::table('cash_register_movements')->insert([
                        'cash_register_opening_id' => $openingId,
                        'cashier_id' => $rec->idcajero,
                        'sede_id' => 1,
                        'type' => 'expense',
                        'concept_id' => null, // se puede mapear luego
                        'provider_id' => $rec->idproveedor ?: null,
                        'client_id' => null,
                        'invoice_number' => $rec->facturanro,
                        'amount' => $rec->importe,
                        'description' => $rec->descripcion,
                        'movement_date' => $rec->hora,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                $this->command->info("✅ Chunk de gastos migrado ({$records->count()} registros).");
            });

        $this->command->info("🎯 Migración de gastos completada (turnosdet → cash_register_movements).");
    }
}
