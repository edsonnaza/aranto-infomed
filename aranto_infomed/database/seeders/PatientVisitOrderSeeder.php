<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PatientVisitOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::connection('legacy_mysql')
        ->table('admision')
        ->orderBy('Id')
        ->chunk(500, function ($admisiones) {
            foreach ($admisiones as $adm) {
            // Verificar si existe la visita migrada
            $visitId = DB::table('patient_visits')->where('id', $adm->Id)->value('id');
            if (!$visitId) {
                continue; // si no existe, saltamos
            }

            // Obtener detalles desde legacy
            $detalles = DB::connection('legacy_mysql')
                ->table('admisiondetalles')
                ->where('nroadmision', $adm->Id)
                ->where('eliminado', 'NO')
                ->get();

            if ($detalles->isEmpty()) {
                continue;
            }

            // Calcular totales
            $totalAmount = $detalles->sum('totalpagar');
            $discountTotal = $detalles->sum('descuento');
            $finalAmount = $totalAmount - $discountTotal;

            // Crear cabecera
            $orderId = DB::table('patient_visit_orders')->insertGetId([
                'patient_visit_id' => $visitId,
                'total_amount' => $totalAmount,
                'discount_amount' => $discountTotal,
                'discount_percent' => 0, // si quieres calcularlo luego
                'final_amount' => $finalAmount,
                'status' => 'confirmed',
                'created_by' => null, // no se tiene recepcionista histórico
                'confirmed_at' => $adm->Fecha . ' ' . ($adm->Hora ?? '00:00:00'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Insertar ítems
            foreach ($detalles as $det) {
                DB::table('patient_visit_order_items')->insert([
                    'order_id' => $orderId,
                    'service_id' => $det->idproducto,
                    'service_name' => $det->nombre,
                    'profesional_id' => $adm->Profesional_Id ?? null,
                    'quantity' => $det->cantidad,
                    'unit_price' => $det->precioventa,
                    'discount_amount' => $det->descuento,
                    'total_price' => $det->totalpagar,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    });

    }
}
