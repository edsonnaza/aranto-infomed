<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CashRegisterOpeningsController;

Route::prefix('cash-register')->middleware('auth')->group(function () {
    Route::get('/openings', [CashRegisterOpeningsController::class, 'index']);
    Route::post('/open', [CashRegisterOpeningsController::class, 'store']);
    Route::post('/close', [CashRegisterOpeningsController::class, 'close']);
    Route::get('/current', [CashRegisterOpeningsController::class, 'current']);
});
