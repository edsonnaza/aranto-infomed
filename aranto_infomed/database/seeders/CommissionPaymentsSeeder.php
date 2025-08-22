<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CommissionPaymentsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('commission_payments')->truncate();

        DB::connection('legacy_mysql')
            ->table('pagoscomision')
            ->orderBy('id')
            ->chunk(100, function ($rows) {
                $insertData = [];

                foreach ($rows as $legacy) {
                    // Ignorar registros con profesional inválido
                    if (empty($legacy->idprofesional) || $legacy->idprofesional == 0) {
                        $this->command->warn("⚠️ Saltando pagoscomision {$legacy->id} (idprofesional=0)");
                        continue;
                    }

                    // Intentar buscar apertura de caja
                    $opening = DB::table('cash_register_openings')
                        ->where('id', $legacy->idturnoscab)
                        ->first();

                    // Intentar buscar profesional
                    $professional = DB::table('professionals')
                        ->where('id', $legacy->idprofesional)
                        ->first();

                    if (! $professional) {
                        $this->command->warn("⚠️ Profesional {$legacy->idprofesional} no encontrado en pagoscomision {$legacy->id}");
                        continue;
                    }

                    $insertData[] = [
                        'cash_register_opening_id' => $opening->id ?? null,
                        'cashier_id'               => $legacy->idcajero ?: null,
                        'professional_id'          => $professional->id,

                        'total_production'         => $legacy->totalproduccion ?? 0,
                        'amount_paid'              => $legacy->importepagado ?? 0,

                        'start_date'               => ($legacy->hora && $legacy->hora !== '0000-00-00')
                                                        ? Carbon::parse($legacy->hora)
                                                        : null,
                        'end_date'                 => ($legacy->fechafin && $legacy->hora !== '0000-00-00')
                                                        ? Carbon::parse($legacy->hora)
                                                        : null,

                        'description'              => $legacy->descripcion,
                        'active'                   => $legacy->estado == 1,

                        'seguro_id'                => $legacy->idseguro ?: null,
                        'company_id'               => $legacy->idempresa ?: null,
                        'sede_id'                  => $legacy->sedeid ?: null,

                        'created_at'               => ($legacy->hora && $legacy->hora !== '0000-00-00')
                                                        ? Carbon::parse($legacy->hora)
                                                        : now(),
                        'updated_at'               => now(),
                    ];
                }

                if (! empty($insertData)) {
                    DB::table('commission_payments')->insert($insertData);
                    $this->command->info("✅ Migrado chunk de pagos de comisión ({$rows->count()} registros).");
                }
            });

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->command->info("🎯 Migración de pagos de comisión completada.");
    }
}
