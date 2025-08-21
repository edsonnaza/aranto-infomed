<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConsistencyCashierChecker extends Seeder
{
    public function run(): void
    {
        $this->command->info("🔎 Iniciando prueba de consistencia caja por caja...");

        // Traemos todas las aperturas que existan en legacy (activas)
        $legacyOpenings = DB::connection('legacy_mysql')
            ->table('turnoscab')
            ->pluck('id'); 

        $totalChecked = 0;
        $okCount = 0;
        $failCount = 0;

        foreach ($legacyOpenings as $openingId) {
            // Totales legacy
            $legacyExpense = DB::connection('legacy_mysql')
                ->table('turnosdet')
                ->where('estado', 1)
                ->where('idturnoscab', $openingId)
                ->sum('importe');

            $legacyIncome = DB::connection('legacy_mysql')
                ->table('turnosdetingresos')
                ->where('estado', 1)
                ->where('idturnoscab', $openingId)
                ->sum('importe');

            // Totales nuevos
            $newExpense = DB::table('cash_register_movements')
                ->where('cash_register_opening_id', $openingId)
                ->where('type', 'expense')
                ->sum('amount');

            $newIncome = DB::table('cash_register_movements')
                ->where('cash_register_opening_id', $openingId)
                ->where('type', 'income')
                ->sum('amount');

            $balanceLegacy = $legacyIncome - $legacyExpense;
            $balanceNew = $newIncome - $newExpense;

            $totalChecked++;

            if (abs($balanceLegacy - $balanceNew) < 0.01) {
                $okCount++;
            } else {
                $failCount++;
                $this->command->warn("⚠️ Caja {$openingId} no cuadra: Legacy={$balanceLegacy} | New={$balanceNew}");
            }
        }

        $this->command->info("📊 Resumen de consistencia:");
        $this->command->info("   ✅ Cajas que cuadran: {$okCount}");
        $this->command->info("   ❌ Cajas que NO cuadran: {$failCount}");
        $this->command->info("   🔢 Total cajas revisadas: {$totalChecked}");
    }
}
