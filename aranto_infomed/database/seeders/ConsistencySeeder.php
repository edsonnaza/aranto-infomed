<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConsistencySeeder extends Seeder
{
    public function run()
    {
        $this->command->info("🔎 Iniciando prueba de consistencia con chunks de 1000...");

        // 1. Totales globales
        $legacyTotal = DB::connection('legacy_mysql')->table('turnosdet')
                            ->where('estado', 1)->count()
                     + DB::connection('legacy_mysql')->table('turnosdetingresos')
                            ->where('estado', 1)->count();

        $newTotal = DB::table('cash_register_movements')
            ->whereIn('legacy_source', ['turnosdet', 'turnosdetingresos'])
            ->count();

        $this->command->info("📊 Legacy total: $legacyTotal | New total: $newTotal");

        // 2. Totales por fuente
        $legacyTurnosdet = DB::connection('legacy_mysql')->table('turnosdet')
                                ->where('estado', 1)->sum('importe');
        $legacyTurnosdetingresos = DB::connection('legacy_mysql')->table('turnosdetingresos')
                                ->where('estado', 1)->sum('importe');

        $newTurnosdet = DB::table('cash_register_movements')
            ->where('legacy_source', 'turnosdet')->sum('amount');
        $newTurnosdetingresos = DB::table('cash_register_movements')
            ->where('legacy_source', 'turnosdetingresos')->sum('amount');

        $this->command->info("Legacy turnosdet: $legacyTurnosdet | New turnosdet: $newTurnosdet");
        $this->command->info("Legacy turnosdetingresos: $legacyTurnosdetingresos | New turnosdetingresos: $newTurnosdetingresos");

        // 3. Totales por tipo
        $types = DB::table('cash_register_movements')
            ->select('type', DB::raw('COUNT(*) as count'), DB::raw('SUM(amount) as total'))
            ->whereIn('legacy_source', ['turnosdet', 'turnosdetingresos'])
            ->groupBy('type')
            ->get();

        foreach ($types as $row) {
            $this->command->info("New {$row->type}: {$row->count} registros, total = {$row->total}");
        }
        // 4. Faltantes en turnosdet
        $legacyDetIds = DB::connection('legacy_mysql')->table('turnosdet')
            ->where('estado', 1)
            ->pluck('id');

        $newDetIds = DB::table('cash_register_movements')
            ->where('legacy_source', 'turnosdet')
            ->pluck('legacy_id');

        $missingDet = $legacyDetIds->diff($newDetIds)->take(10);

        if ($missingDet->count() > 0) {
            $this->command->warn("⚠️ Faltan en turnosdet (ejemplo): " . $missingDet->implode(', '));
        } else {
            $this->command->info("✅ Todos los turnosdet migrados.");
        }

    // 5. Faltantes en turnosdetingresos
    $legacyIngIds = DB::connection('legacy_mysql')->table('turnosdetingresos')
        ->where('estado', 1)
        ->pluck('id');

    $newIngIds = DB::table('cash_register_movements')
        ->where('legacy_source', 'turnosdetingresos')
        ->pluck('legacy_id');

    $missingIngresos = $legacyIngIds->diff($newIngIds)->take(10);

    if ($missingIngresos->count() > 0) {
        $this->command->warn("⚠️ Faltan en turnosdetingresos (ejemplo): " . $missingIngresos->implode(', '));
    } else {
        $this->command->info("✅ Todos los turnosdetingresos migrados.");
    }

    // Dentro de run()
        $openingId = 2755; // el ID de la caja a probar

        $this->command->info("🔎 Validando consistencia de la caja #$openingId...");

        // --- Legacy ---
        $legacyExpenses = DB::connection('legacy_mysql')
            ->table('turnosdet')
            ->where('idturnoscab', $openingId)
            ->where('estado', 1)
            ->sum('importe');

        $legacyIncomes = DB::connection('legacy_mysql')
            ->table('turnosdetingresos')
            ->where('idturnoscab', $openingId)
            ->where('estado', 1)
            ->sum('importe');

        // --- Nueva ---
        $newExpenses = DB::table('cash_register_movements')
            ->where('cash_register_opening_id', $openingId)
            ->where('type', 'expense')
            ->sum('amount');

        $newIncomes = DB::table('cash_register_movements')
            ->where('cash_register_opening_id', $openingId)
            ->where('type', 'income')
            ->sum('amount');

        // --- Reporte ---
        $this->command->info("Legacy Caja $openingId - Expense: $legacyExpenses | Income: $legacyIncomes");
        $this->command->info("Nueva Caja $openingId - Expense: $newExpenses | Income: $newIncomes");

        // Balance en legacy vs new
        $legacyBalance = $legacyIncomes - $legacyExpenses;
        $newBalance = $newIncomes - $newExpenses;

        $this->command->info("Balance Legacy: $legacyBalance | Balance New: $newBalance");

        $this->command->info("🔎 Validando consistencia de TODAS las cajas...");

        $openings = DB::table('cash_register_openings')->pluck('id');

        foreach ($openings as $openingId) {
            // Legacy
            $legacyExpense = DB::connection('legacy_mysql')
                ->table('turnosdet')
                ->where('idturnoscab', $openingId)
                ->where('estado', 1)
                ->sum('importe');

            $legacyIncome = DB::connection('legacy_mysql')
                ->table('turnosdetingresos')
                ->where('idturnoscab', $openingId)
                ->where('estado', 1)
                ->sum('importe');

            // Nueva BD
            $newExpense = DB::table('cash_register_movements')
                ->where('cash_register_opening_id', $openingId)
                ->where('type', 'expense')
                ->sum('amount');

            $newIncome = DB::table('cash_register_movements')
                ->where('cash_register_opening_id', $openingId)
                ->where('type', 'income')
                ->sum('amount');

            // Balance
            $legacyBalance = $legacyIncome - $legacyExpense;
            $newBalance = $newIncome - $newExpense;

            if (
                bccomp($legacyExpense, $newExpense, 2) !== 0 ||
                bccomp($legacyIncome, $newIncome, 2) !== 0
            ) {
                $this->command->warn("⚠️ Caja #$openingId inconsistente:");
                $this->command->line("  Legacy - Expense: $legacyExpense | Income: $legacyIncome | Balance: $legacyBalance");
                $this->command->line("  Nueva  - Expense: $newExpense   | Income: $newIncome   | Balance: $newBalance");
            } else {
                $this->command->info("✅ Caja #$openingId OK");
            }
        }

        $this->command->info("✔️ Validación de todas las cajas finalizada.");


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

    // 6. Balance de ingresos y gastos
}