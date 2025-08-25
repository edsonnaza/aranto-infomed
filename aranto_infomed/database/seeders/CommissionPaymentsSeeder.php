<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CommissionPaymentsSeeder extends Seeder
{
    public function run(): void
    {
         function parseLegacyDate($value) {
                        if (!$value || $value === '0000-00-00' || $value === '0000-00-00 00:00:00') {
                            return now();
                        }

                        try {
                            return Carbon::parse($value);
                        } catch (\Exception $e) {
                            return now();
                        }
                    }
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('commission_payments')->truncate();

        DB::connection('legacy_mysql')
            ->table('pagoscomision')
            ->orderBy('id')
            ->chunk(100, function ($rows) {
                foreach ($rows as $legacy) {
                    // saltar si no hay profesional
                    if ((int)$legacy->idprofesional === 0) {
                        continue;
                    }

                    // crear cabecera
                    $commissionPaymentId = DB::table('commission_payments')->insertGetId([
                        'id' => $legacy->id, // <--- clave: usar el mismo ID del legacy
                        'cash_register_opening_id' => $legacy->idturnoscab ?: null,
                        'cashier_id'               => $legacy->idcajero ?: null,
                        'professional_id'          => $legacy->idprofesional,
                        'total_production'         => $legacy->totalproduccion ?? 0,
                        'amount_paid'              => $legacy->importepagado ?? 0,
                        'start_date' => parseLegacyDate($legacy->hora ?? $legacy->hora ?? now()),
                        'end_date'   => parseLegacyDate($legacy->hora ?? $legacy->hora ?? now()),
                        'created_at' => parseLegacyDate($legacy->hora ?? now()),

                        'description'              => $legacy->descripcion,
                        'active'                   => $legacy->estado == 1,
                        'seguro_id'                => $legacy->idseguro ?: null,
                        'company_id'               => $legacy->idempresa ?: null,
                        'sede_id'                  => $legacy->sedeid ?: null,
                        
                        'updated_at'               => now(),
                    ]);

                    // actualizar patient_visit_payments vinculados
                    $updated = DB::table('patient_visit_payments')
                        ->where('professional_id', $legacy->idprofesional)
                        ->where('commission_paid', 0)
                        ->whereNull('comission_number')
                        ->where('payment_status', 'paid')
                        ->limit(1000) // ⚠️ evita sobreasignar, refinar según reglas de negocio
                        ->update([
                            'commission_paid'   => 1,
                            'comission_number'  => $commissionPaymentId,
                            'updated_at'        => now(),
                        ]);

                    // validación básica
                    $sumAmount = DB::table('patient_visit_payments')
                        ->where('comission_number', $commissionPaymentId)
                        ->sum('amount');

                    if ((float)$sumAmount !== (float)$legacy->totalproduccion) {
                        $this->command->warn("⚠️ Diferencia en comisión #{$commissionPaymentId}: Legacy={$legacy->totalproduccion} | New={$sumAmount}");
                    } else {
                        $this->command->info("✅ Comisión {$commissionPaymentId} conciliada ({$updated} payments actualizados).");
                    }


                  

                }
                  
            });
       
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->command->info("🎯 Migración y conciliación de comisiones completada.");
    }
}
