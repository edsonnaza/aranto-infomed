<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PatientVisitSeeder extends Seeder
{
    public function run(): void
    {
        // Mapeo de estados legacy a nuevos
        $statusMap = [
            'CF' => 'completed',   // Cobrado Finalizado
            'CC' => 'cancelled',   // Cancelado
            'CP' => 'in_progress', // Cobro Parcial
            null => 'scheduled',   // Sin estado asignado → cita programada
        ];

        $total = 0;

        // Desactivar validación de llaves foráneas
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Limpiar tabla antes de importar (opcional)
        DB::table('patient_visits')->truncate();

        // Importar en chunks grandes
        DB::connection('legacy_mysql')
            ->table('admision')
            ->orderBy('Id')
            ->chunk(500, function ($rows) use (&$total, $statusMap) {
                $insertData = [];

                foreach ($rows as $row) {
                    $insertData[] = [
                        'id'             => $row->Id,
                        'patient_id'     => $row->Paciente_HC,
                        'profesional_id' => $row->Profesional_Id ?? null,
                        'seguro_id'      => $row->seguro_id ?? null,
                        'visit_status'   => $statusMap[$row->Condicion] ?? 'scheduled',
                        'created_by'     => $row->Usuario_Id ?? null,
                        'sede_id'        => 1,
                        'created_at'     => $this->parseLegacyDateTime($row->Fecha ?? null, $row->Hora ?? null),
                        'updated_at'     => now(),
                    ];
                }

                // Insertar ignorando duplicados
                DB::table('patient_visits')->insertOrIgnore($insertData);

                $total += count($insertData);
                $this->command->info("✅ Insertados {$total} registros...");
            });

        // Ajustar AUTO_INCREMENT al final
        $maxId = DB::table('patient_visits')->max('id') + 1;
        DB::statement("ALTER TABLE patient_visits AUTO_INCREMENT = {$maxId}");

        // Reactivar validación de llaves foráneas
        
        $this->command->info("🎉 Migración completada: {$total} registros insertados en patient_visits.");
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
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
