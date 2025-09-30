<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PatientVisitOrderItem;
use App\Models\CashRegisterOpenings;
use App\Models\PatientVisitPayments;

class CashRegisterChargesController extends Controller
{
    public function pay(Request $request, $itemId)
    {
        // Buscar el item
        $item = PatientVisitOrderItem::findOrFail($itemId);
        if ($item->status !== 'pending') {
            return back()->with('error', 'Solo se pueden cobrar servicios pendientes.');
        }
        $today = date('Y-m-d');
        if ($item->created_at->format('Y-m-d') !== $today) {
            return back()->with('error', 'Solo se pueden cobrar servicios del día actual.');
        }
        $userId = auth()->id();
        $openCash = \App\Models\CashRegisterOpenings::where('cashier_id', $userId)
            ->where('is_open', true)
            ->latest('opened_at')
            ->first();
        if (!$openCash) {
            return back()->with('error', 'No hay caja abierta para el usuario actual.');
        }
        if ($openCash->cashier_id !== $userId) {
            return back()->with('error', 'Solo el cajero registrado en la apertura puede realizar el cobro.');
        }

        // 1. Actualizar el ítem
        $item->status = 'paid';
        $item->paid_at = now();
        $item->payment_method = $request->input('payment_method');
        $item->notes = $request->input('notes');
        $item->save();

        // 2. Si todos los ítems del pedido están pagados, actualizar el pedido
        $order = $item->order;
        if ($order) {
            $allPaid = $order->items()->where('status', '!=', 'paid')->count() === 0;
            if ($allPaid) {
                $order->status = 'paid';
                $order->paid_at = now();
                $order->save();
            }
        }

        // 3. Si todos los pedidos de la visita están pagados, solo actualizar el campo paid_at
        $visit = $order ? $order->visit : null;
        if ($visit) {
            $allOrdersPaid = $visit->orders()->where('status', '!=', 'paid')->count() === 0;
            if ($allOrdersPaid) {
                $visit->paid_at = now();
                $visit->save();
            }
        }

        // 4. Registrar el pago en patient_visit_payments (solo pago del paciente, no comisión)
            PatientVisitPayments::create([
            'patient_visit_id' => $visit ? $visit->id : null,
            'professional_id' => $order ? $order->professional_id : null,
            'cash_register_openings_id' => $openCash->id,
            'payment_status' => 'paid',
            'amount' => $item->total_price,
            'commission_paid' => 0,
            'commission_percentage' => $order ? $order->commission_percentage : 0,
            'comission_number' => null,
            'payment_date' => now(),
        ]);

        return back()->with('success', 'Cobro registrado correctamente.');
    }

    public function cancel(Request $request, $itemId)
    {
        $item = PatientVisitOrderItem::findOrFail($itemId);
        // Validar estado pagado
        if ($item->status !== 'paid') {
            return back()->with('error', 'Solo se pueden cancelar servicios pagados.');
        }
        // Validar fecha actual
        $today = date('Y-m-d');
        if ($item->created_at->format('Y-m-d') !== $today) {
            return back()->with('error', 'Solo se pueden cancelar servicios del día actual.');
        }
        // Validar caja abierta (simplificado)
        $userId = auth()->id();
        $openCash = CashRegisterOpenings::where('user_id', $userId)
            ->where('opened_at', 'like', $today . '%')
            ->whereNull('closed_at')
            ->first();
        if (!$openCash) {
            return back()->with('error', 'No hay caja abierta para el usuario actual.');
        }
        // Registrar cancelación
        $item->status = 'cancelled';
        $item->cancelled_at = now();
        $item->save();
        // Opcional: registrar motivo de cancelación
        // $item->cancellation_reason = $request->input('reason');
        // $item->save();
        return back()->with('success', 'Cobro cancelado correctamente.');
    }
// ...existing code...
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $status = $request->input('status', 'pending');
        $itemsQuery = PatientVisitOrderItem::with(['order.visit.patient', 'order.visit.professional', 'professional'])
            ->where('status', $status);

    if ($startDate && $endDate) {
        $start = $startDate . ' 00:00:00';
        $end = $endDate . ' 23:59:59';
        $itemsQuery->where('created_at', '>=', $start)
            ->where('created_at', '<=', $end);
        $date = $startDate . ' - ' . $endDate;
    } else {
        // Si no hay rango, filtrar solo por el día actual
        $today = date('Y-m-d');
        $start = $today . ' 00:00:00';
        $end = $today . ' 23:59:59';
        $itemsQuery->where('created_at', '>=', $start)
            ->where('created_at', '<=', $end);
        $date = $today;
    }
    $perPage = 10;
    $paginated = $itemsQuery->orderBy('created_at', 'asc')->paginate($perPage)->withQueryString();

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
