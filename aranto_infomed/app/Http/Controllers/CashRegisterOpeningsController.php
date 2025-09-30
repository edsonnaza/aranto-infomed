<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\CashRegisterOpenings;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Sede;


class CashRegisterOpeningsController extends Controller
{
    // Listar aperturas/cierres
  // CashRegisterOpeningsController.php
 
public function index()
{
    $openings = CashRegisterOpenings::with(['cashier', 'sede'])
        ->orderByDesc('opened_at')
        ->get();
    $users = User::role('cashier')->get(['id', 'full_name']);
    return Inertia::render('cashregister/CashRegisterPage', [
        'openings' => $openings,
        'users' => $users,
    ]);
}


    // Abrir caja
    public function store(Request $request)
    {
        $data = $request->validate([
            'cashier_id' => 'required|exists:users,id',
            'opening_amount' => 'required|numeric|min:0',
        ]);

        $opening = CashRegisterOpenings::create([
            'cashier_id' => $data['cashier_id'],
            'opened_at' => now(),
            'opening_amount' => $data['opening_amount'],
            'status' => 'abierto',
            'sede_id' => Auth::user()->sede_id,
        ]);
        return redirect()->back()->with('success', '✅ Caja abierta correctamente');
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
        $opening = CashRegisterOpenings::with('cashier')
            ->where('cashier_id', Auth::id())
            ->where('is_open', true)
            ->latest('opened_at')
            ->first();
        return response()->json($opening);
    }
}
