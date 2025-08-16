<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PatientVisitOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $totalOrders = 0;
        $chunkSize = 1000; // Tamaño del chunk para procesar admisiones
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('patient_visit_orders')->truncate();
        DB::table('patient_visit_order_items')->truncate();
        // Chunk de 500 admisiones por vez
        DB::connection('legacy_mysql')
            ->table('admision')
            ->orderBy('Id')
            ->chunk(1000, function ($admisiones) use (&$totalOrders) {

                $admIds = $admisiones->pluck('Id')->toArray();

                // Traer todos los detalles del chunk en una sola consulta
                $detalles = DB::connection('legacy_mysql')
                    ->table('admisiondetalles')
                    ->whereIn('nroadmision', $admIds)
                    ->where('eliminado', 'NO')
                    ->get()
                    ->groupBy('nroadmision');

                $chunkCount = 0;

                foreach ($admisiones as $adm) {
                    // Verificar si la visita ya existe en la nueva tabla
                    $visitId = DB::table('patient_visits')->where('id', $adm->Id)->value('id');
                    if (!$visitId) continue;

                    $items = $detalles->get($adm->Id, collect());
                    if ($items->isEmpty()) continue;

                    // Calcular totales
                    $totalAmount = $items->sum('totalpagar');
                    $discountTotal = $items->sum('descuento');
                    $finalAmount = $totalAmount - $discountTotal;

                    // Insertar cabecera
                    $orderId = DB::table('patient_visit_orders')->insertGetId([
                        'patient_visit_id' => $visitId,
                        'total_amount' => $totalAmount,
                        'discount_amount' => $discountTotal,
                        'discount_percent' => $totalAmount > 0 ? ($discountTotal / $totalAmount) * 100 : 0,
                        'final_amount' => $finalAmount,
                        'status' => 'confirmed',
                        'created_by' => null,
                        'confirmed_at' => $adm->Fecha . ' ' . ($adm->Hora ?? '00:00:00'),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    // Preparar batch de ítems
                    $batchItems = [];
                    foreach ($items as $det) {
                        $batchItems[] = [
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
                        ];
                    }

                    // Insertar todos los ítems en batch
                    DB::table('patient_visit_order_items')->insert($batchItems);

                    $chunkCount++;
                    $totalOrders++;
                }

                $this->command->info("✅ Chunk procesado: {$chunkCount} órdenes migradas.");
            });
         DB::statement("SET FOREIGN_KEY_CHECKS=1;");      
         $this->command->info("🎉 Migración completada. Total de órdenes importadas: {$totalOrders}");
    }
}
