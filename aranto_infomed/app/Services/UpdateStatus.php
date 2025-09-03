<?php

namespace App\Services;

use App\Models\PatientVisit;
use Illuminate\Support\Facades\DB;

class UpdateStatus
{
    /**
     * Actualiza el estado de una visita y sus órdenes asociadas.
     *
     * @param PatientVisit $visit
     * @param string $status
     * @param string|null $message
     * @return array
     */
    public function handle(PatientVisit $visit, string $status, ?string $message = null): array
    {
        // Verificamos si ya tiene el mismo estado
        if ($visit->visit_status === $status) {
            return [
                'status' => 'warning',
                'message' => "La visita #{$visit->id} ya tiene el estado '{$status}'.",
            ];
        }

        // Transacción para actualizar visita y órdenes
        DB::transaction(function () use ($visit, $status) {
            $visit->update(['visit_status' => $status]);

            foreach ($visit->orders as $order) {
                $order->update(['status' => $status]);
            }
        });

        return [
            'status' => 'success',
            'message' => $message ?? "Registro #{$visit->id} actualizado a '{$status}' correctamente.",
        ];
    }
}
