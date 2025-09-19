<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\CashRegisterOpenings;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CashRegisterOpeningsController extends Controller
{
    // Listar aperturas/cierres
  // CashRegisterOpeningsController.php
public function index()
{
    $openings = CashRegisterOpenings::with(['cashier', 'sede'])
        ->orderByDesc('opened_at')
        ->get();

    return Inertia::render('cashregister/CashRegisterPage', [
        'openings' => $openings,
    ]);
}


    // Abrir caja
    public function store(Request $request)
    {
        $data = $request->validate([
            'initial_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);
        $opening = CashRegisterOpenings::create([
            'user_id' => Auth::id(),
            'opened_at' => now(),
            'initial_amount' => $data['initial_amount'],
            'status' => 'abierto',
            'notes' => $data['notes'] ?? null,
        ]);
        return response()->json($opening, 201);
    }

    // Cerrar caja
    public function close(Request $request)
    {
        $data = $request->validate([
            'closing_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);
        $opening = CashRegisterOpenings::where('user_id', Auth::id())
            ->where('status', 'abierto')
            ->latest('opened_at')
            ->first();
        if (!$opening) {
            return response()->json(['error' => 'No hay caja abierta'], 404);
        }
        $opening->update([
            'closed_at' => now(),
            'closing_amount' => $data['closing_amount'],
            'status' => 'cerrado',
            'notes' => $data['notes'] ?? $opening->notes,
        ]);
        return response()->json($opening);
    }

    // Obtener caja actual abierta
    public function current()
    {
        $opening = CashRegisterOpenings::where('user_id', Auth::id())
            ->where('status', 'abierto')
            ->latest('opened_at')
            ->first();
        return response()->json($opening);
    }
}
