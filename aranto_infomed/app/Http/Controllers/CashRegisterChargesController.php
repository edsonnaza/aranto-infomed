<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CashRegisterChargesController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->input('date');



        // Paginar los PatientVisitOrderItems filtrados
        $itemsQuery = \App\Models\PatientVisitOrderItem::with(['order.visit.patient', 'order.visit.professional', 'professional'])
            ->whereHas('order', function($q) use ($date) {
                $q->where('status', 'pending');
                if ($date) {
                    $start = $date . ' 00:00:00';
                    $end = date('Y-m-d 00:00:00', strtotime($date . ' +1 day'));
                    $q->whereHas('items', function($q2) use ($start, $end) {
                        $q2->where('created_at', '>=', $start)
                            ->where('created_at', '<', $end);
                    });
                }
            });
        if ($date) {
            $start = $date . ' 00:00:00';
            $end = date('Y-m-d 00:00:00', strtotime($date . ' +1 day'));
            $itemsQuery->where('created_at', '>=', $start)
                ->where('created_at', '<', $end);
        }
        $perPage = 10;
        $paginated = $itemsQuery->orderByDesc('created_at')->paginate($perPage)->withQueryString();

        // Mapear para el frontend: cada item
        $pendingServices = collect($paginated->items())->map(function($item) {
            return [
                'order_id' => $item->order_id,
                'item_id' => $item->id,
                'service_name' => $item->service_name,
                'professional' => $item->professional ? $item->professional->full_name : null,
                'patient' => $item->order && $item->order->visit && $item->order->visit->patient ? $item->order->visit->patient->full_name : null,
                'status' => $item->status ?? ($item->order ? $item->order->status : null),
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'total_price' => $item->total_price,
                'created_at' => $item->created_at ? $item->created_at->format('Y-m-d H:i') : null,
            ];
        });

        return Inertia::render('cashregister/CashRegisterChargesPage', [
            'pendingServices' => $pendingServices,
            'links' => $paginated->toArray()['links'],
            'filterDate' => $date,
        ]);
    }
}
