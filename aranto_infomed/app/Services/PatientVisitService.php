<?php
namespace App\Services;

use App\Models\PatientVisit;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PatientVisitService
{
    /**
     * Crea una visita con su orden y items, asegurando consistencia.
     *
     * @param array $data
     * @return PatientVisit
     * @throws \Exception
     */
    public function createVisitWithOrder(array $data): PatientVisit
    {
        // Validación interna de datos obligatorios
        if (!isset($data['order']['items']) || !is_array($data['order']['items']) || empty($data['order']['items'])) {
            throw new \Exception("No se enviaron items para la orden");
        }

        foreach ($data['order']['items'] as $index => $item) {
            if (empty($item['professional_id'])) {
                throw new \Exception("Cada item debe tener un professional_id. Error en item index $index");
            }
            if (empty($item['service_id'])) {
                throw new \Exception("Cada item debe tener un service_id. Error en item index $index");
            }
            if (empty($item['quantity']) || $item['quantity'] < 1) {
                throw new \Exception("Cada item debe tener quantity >= 1. Error en item index $index");
            }
        }

        try {
            return DB::transaction(function () use ($data) {
                // 1. Crear la cabecera de la visita
                $visit = PatientVisit::create([
                    'patient_id' => $data['patient_id'],
                    'professional_id' => $data['professional_id'],
                    'seguro_id' => $data['seguro_id'] ?? null,
                    'visit_status' => $data['visit_status'],
                    'sede_id' => $data['sede_id'],
                    'created_by' => auth()->id(),
                ]);

                // 2. Crear la orden asociada
                $order = $visit->orders()->create([
                    'professional_id' => $data['order']['professional_id'],
                    'total_amount' => $data['order']['total_amount'],
                    'discount_amount' => $data['order']['discount_amount'],
                    'discount_percent' => $data['order']['discount_percent'],
                    'final_amount' => $data['order']['final_amount'],
                    'commission_percentage' => $data['order']['commission_percentage'],
                    'commission_amount' => $data['order']['commission_amount'],
                    'status' => $data['order']['status'] ?? 'confirmed',
                    'created_by' => auth()->id(),
                ]);

                // 3. Crear items de la orden
                foreach ($data['order']['items'] as $item) {
                    $order->items()->create([
                        'service_id' => $item['service_id'],
                        'professional_id' => $item['professional_id'],
                        'service_name' => $item['service_name'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'discount_amount' => $item['discount_amount'],
                        'total_price' => $item['total_price'],
                    ]);
                }

                // 4. Validar que se hayan creado todos los items
                $itemsCount = $order->items()->count();
                $expectedCount = count($data['order']['items']);
                if ($itemsCount !== $expectedCount) {
                    throw new \Exception("Se esperaban $expectedCount items, pero se crearon $itemsCount");
                }

                Log::info('[SERVICE][PatientVisitService] Visit and order created', [
                    'visit_id' => $visit->id,
                    'order_id' => $order->id,
                    'items_count' => $itemsCount
                ]);

                return $visit;
            });
        } catch (\Exception $e) {
            Log::error('[SERVICE][PatientVisitService] Error creating visit with order', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data,
            ]);
            throw $e; // Re-lanzar para que el controller capture el error
        }
    }
}
