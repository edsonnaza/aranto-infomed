<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CashRegisterMovementsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('cash_register_movements')->truncate();

        // ==============
        // EXPENSES: turnosdet
        // ==============
        DB::connection('legacy_mysql')
            ->table('turnosdet')
            ->where('estado', 1) // 👈 solo activos
            ->orderBy('id')
            ->chunk(500, function ($rows) {
                $insertData = [];

                foreach ($rows as $legacy) {
                    $opening = DB::table('cash_register_openings')
                        ->where('id', $legacy->idturnoscab)
                        ->first();

                    if (! $opening) {
                        continue; // no existe apertura vinculada
                    }

                    $insertData[] = [
                        'cash_register_opening_id' => $opening->id,
                        'cashier_id'               => $legacy->idcajero ?: null,
                        'sede_id'                  => $legacy->sedeid ?: null,
                        'type'                     => 'expense',
                        'concept_id'               => 1,
                        'provider_id'              => $legacy->idproveedor ?: 1,
                        'client_id'                => null,
                        'invoice_number'           => $legacy->facturanro,
                        'amount'                   => $legacy->importe,
                        'description'              => $legacy->descripcion,
                        'movement_date'            => Carbon::parse($legacy->fecha ?? $legacy->hora ?? now()),
                        'legacy_id'                => $legacy->id,
                        'legacy_source'            => 'turnosdet',
                        'created_at'               => now(),
                        'updated_at'               => now(),
                    ];
                }

                if (! empty($insertData)) {
                    DB::table('cash_register_movements')->insert($insertData);
                }
                $this->command->info("✅ Chunk de gastos migrado ({$rows->count()} registros).");
            });

        // ==============
        // INCOMES: turnosdetingresos
        // ==============
        DB::connection('legacy_mysql')
            ->table('turnosdetingresos')
            ->where('estado', 1) // 👈 solo activos
            ->orderBy('id')
            ->chunk(1000, function ($rows) {
                $insertData = [];

                foreach ($rows as $legacy) {
                    $opening = DB::table('cash_register_openings')
                        ->where('id', $legacy->idturnoscab)
                        ->first();

                    if (! $opening) {
                        continue; // no existe apertura vinculada
                    }

                    $insertData[] = [
                        'cash_register_opening_id' => $opening->id,
                        'cashier_id'               => $legacy->idcajero ?: null,
                        'sede_id'                  => $legacy->sedeid ?: null,
                        'type'                     => 'income',
                        'concept_id'               => $legacy->idconcepto ?: 1,
                        'provider_id'              => null,
                        'client_id'                => $legacy->idcliente ?: null,
                        'invoice_number'           => $legacy->facturanro,
                        'amount'                   => $legacy->importe,
                        'description'              => $legacy->descripcion,
                        'movement_date'            => Carbon::parse($legacy->fecha ?? $legacy->hora ?? now()),
                        'legacy_id'                => $legacy->id,
                        'legacy_source'            => 'turnosdetingresos',
                        'created_at'               => now(),
                        'updated_at'               => now(),
                    ];
                }

                if (! empty($insertData)) {
                    DB::table('cash_register_movements')->insert($insertData);
                }
                $this->command->info("✅ Chunk de ingresos migrado ({$rows->count()} registros).");
            });

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->command->info("🎯 Migración de ingresos y egresos completada (solo activos).");
    }
}
