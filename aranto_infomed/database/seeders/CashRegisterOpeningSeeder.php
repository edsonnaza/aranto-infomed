<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CashRegisterOpeningSeeder extends Seeder
{
    public function run(): void
    {
          // Desactivar validación de llaves foráneas
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Limpiar tabla antes de importar (opcional)
        DB::table('cash_register_openings')->truncate();
        $total = 0;

        DB::connection('legacy_mysql')
            ->table('turnoscab')
            ->orderBy('id')
            ->chunk(500, function ($rows) use (&$total) {
                $insertData = [];

                foreach ($rows as $row) {
                    $insertData[] = [
                        'id'              => $row->id,
                        'cashier_id'      => $row->idcajero,  // user ID del cajero
                        'sede_id'       => $row->sedeid,
                        'opening_amount'  => $row->importeinicial ?? 0,
                        'total_sales'     => $row->totalventas ?? 0,
                        'total_expenses'  => $row->totalegresos ?? 0,
                        'total_incomes'   => $row->totalingresos ?? 0,
                        'cash_balance'    => $row->saldoencaja ?? 0,
                        'opened_at'       => $this->parseDate($row->fecha),
                        'closed_at'       => $this->parseDate($row->fechacierre),
                        'is_open'         => $row->estado == 1 ? true : false,
                        'created_at'      => now(),
                        'updated_at'      => now(),
                    ];
                }

                DB::table('cash_register_openings')->insert($insertData);

                $total += count($insertData);
                $this->command->info("✅ Insertados {$total} registros de caja...");
                   DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            });

        $this->command->info("🎉 Migración completada: {$total} registros insertados en cash_register_openings.");
    }

   private function parseDate($value)
    {
        if (empty($value) || 
            $value === '0000-00-00 00:00:00' || 
            $value === '0000-00-00' || 
            str_starts_with($value, '-0001')
        ) {
            return null;
        }

        try {
            return Carbon::parse($value);
        } catch (\Exception $e) {
            return null;
        }
    }

}
