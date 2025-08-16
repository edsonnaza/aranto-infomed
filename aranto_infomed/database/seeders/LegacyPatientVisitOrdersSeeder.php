<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LegacyPatientVisitOrdersSeeder extends Seeder
{
    public function run()
    {
        $chunkSize = 500;

        DB::connection('legacy_mysql')->table('admision')
            ->orderBy('Id')
            ->chunk($chunkSize, function ($admissions) {

                foreach ($admissions as $admission) {
                    $patientVisitId = $admission->Id; // Relación directa con patient_visits.id

                    // Calcular descuentos y totales
                    $discountAmount = $admission->descuento ?: 0;
                    $totalAmount = $admission->totalpagar + $discountAmount; // asumimos totalpagar ya con descuento
                    $finalAmount = $admission->totalpagar;

                    // Insertar la cabecera de orden
                    DB::table('patient_visit_orders')->insert([
                        'patient_visit_id' => $patientVisitId,
                        'total_amount'     => $totalAmount,
                        'discount_amount'  => $discountAmount,
                        'discount_percent' => $totalAmount > 0 ? ($discountAmount / $totalAmount) * 100 : 0,
                        'final_amount'     => $finalAmount,
                        'status'           => 'completed', // o según tu lógica
                        'created_by'       => $admission->Usuario_Id ?: 1,
                        'confirmed_at'     => $admission->confirmado_admision ?: null,
                        'created_at'       => $admission->Fecha . ' ' . $admission->Hora,
                        'updated_at'       => now(),
                    ]);

                    $orderId = DB::getPdo()->lastInsertId(); // Obtener el ID insertado

                    // Traer detalles de esta admisión
                    $details = DB::connection('legacy_mysql')->table('admisiondetalles')
                        ->where('nroadmision', $admission->Id)
                        ->get();

                    foreach ($details as $item) {
                        $unitPrice = $item->precioventa ?: 0;
                        $quantity = $item->cantidad ?: 1;
                        $discount = $item->descuento ?: 0;
                        $totalPrice = $item->totalpagar ?: ($unitPrice * $quantity - $discount);

                        DB::table('patient_visit_order_items')->insert([
                            'order_id'       => $orderId,
                            'service_id'     => $item->idproducto,
                            'service_name'   => $item->nombre,
                            'profesional_id' => $admission->Profesional_Id ?: null,
                            'quantity'       => $quantity,
                            'unit_price'     => $unitPrice,
                            'discount_amount'=> $discount,
                            'total_price'    => $totalPrice,
                            'created_at'     => $admission->Fecha . ' ' . $admission->Hora,
                            'updated_at'     => now(),
                        ]);
                    }
                }
            });

        $this->command->info("✅ Histórico de admisiones importado correctamente en patient_visit_orders y items.");
    }
}
