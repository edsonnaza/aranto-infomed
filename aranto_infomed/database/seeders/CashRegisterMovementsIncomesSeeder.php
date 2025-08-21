<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CashRegisterMovementsIncomesSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('cash_register_movements')->truncate();
        DB::connection('legacy_mysql')
            ->table('turnosdetingresos')
            ->orderBy('id')
            ->chunk(500, function ($records) {
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
                        'type' => 'income',
                        'concept_id' => $rec->idconcepto ?: null,
                        'provider_id' => null,
                        'client_id' => $rec->idcliente ?: null,
                        'reference_id' => $rec->id_internado ?: $rec->id_agendareserva,
                        'invoice_number' => $rec->facturanro,
                        'amount' => $rec->importe,
                        'description' => $rec->descripcion,
                        'movement_date' => $rec->hora,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                $this->command->info("✅ Chunk de ingresos migrado ({$records->count()} registros).");
            });

        $this->command->info("🎯 Migración de ingresos completada (turnosdetingresos → cash_register_movements).");
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
    }
}

