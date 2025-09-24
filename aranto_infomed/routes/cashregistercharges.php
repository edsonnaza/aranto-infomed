<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CashRegisterChargesController;

Route::prefix('cash-register')->middleware('auth')->group(function () {
    Route::get('/charges', [CashRegisterChargesController::class, 'index']);
    // Aquí irán las rutas para registrar cobros, ver detalles, etc.
});
