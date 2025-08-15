<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PatientVisitPaymentsSeeder extends Seeder
{
    public function run(): void
    {
        // Desactivar validación de llaves foráneas (solo una vez)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Limpiar tabla antes de importar
        DB::table('patient_visit_payments')->truncate();

        // Mapeo de estados de pago
        $statusMap = [
            'EMITIDO' => 'paid',       // Cobrado Finalizado
            'CANCELADO' => 'cancelled' // Cancelado
            // Otros → pending
        ];

        $total = 0;

        DB::connection('legacy_mysql')
            ->table('venta')
            ->orderBy('IdVenta')
            ->chunk(500, function ($rows) use (&$total, $statusMap) {
                $insertData = [];

                foreach ($rows as $row) {

                    // Validar profesional existente
                    $profesionalId = $row->idprofesional ?? null;
                    if ($profesionalId && !DB::table('profesionales')->where('id', $profesionalId)->exists()) {
                        $profesionalId = null;
                    }

                    // Validar apertura de caja existente
                    $cashOpeningId = $row->turnocabeceraid ?? null;
                    if ($cashOpeningId && !DB::table('cash_register_openings')->where('id', $cashOpeningId)->exists()) {
                        $cashOpeningId = null;
                    }

                    // Validar que exista la visita antes de insertar
                    if (!DB::table('patient_visits')->where('id', $row->nroadmision)->exists()) {
                        continue; // saltar si la visita no existe
                    }

                    $insertData[] = [
                        'patient_visit_id'        => $row->nroadmision,
                        'profesional_id'          => $profesionalId,
                        'cash_register_openings_id' => $cashOpeningId,
                        'payment_status'          => $statusMap[$row->Estado] ?? 'pending',
                        'amount'                  => $row->TotalPagar ?? 0,
                        'commission_paid'         => ($row->comision_pagado ?? 'N') === 'S',
                        'commission_percentage'   => $row->comision ?? 0,
                        'comission_number'        => $row->nrocomision ?? 0,
                        'payment_date'            => $this->parseLegacyDateTime($row->Fecha ?? null, $row->Hora ?? null),
                        'created_at'              => now(),
                        'updated_at'              => now(),
                    ];
                }

                if (!empty($insertData)) {
                    DB::table('patient_visit_payments')->insert($insertData);
                    $total += count($insertData);
                    $this->command->info("✅ Insertados {$total} pagos hasta ahora...");
                }
            });

        // Ajustar AUTO_INCREMENT al final
        $maxId = DB::table('patient_visit_payments')->max('id') + 1;
        DB::statement("ALTER TABLE patient_visit_payments AUTO_INCREMENT = {$maxId}");

        // Reactivar validación de llaves foráneas
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info("🎉 Migración completada: {$total} registros insertados en patient_visit_payments.");
    }

    private function parseLegacyDateTime($date, $time)
    {
        if (!$date) {
            return now();
        }

        $dateString = $date;
        if ($time) {
            $dateString .= ' ' . $time;
        }

        try {
            return Carbon::parse($dateString);
        } catch (\Exception $e) {
            return now();
        }
    }
}
