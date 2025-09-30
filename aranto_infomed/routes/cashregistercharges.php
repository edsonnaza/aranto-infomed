<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CashRegisterChargesController;

Route::prefix('cash-register')->middleware('auth')->group(function () {
    Route::get('/charges', [CashRegisterChargesController::class, 'index']);
        Route::post('/charges/{item}/pay', [CashRegisterChargesController::class, 'pay']);
        Route::post('/charges/{item}/cancel', [CashRegisterChargesController::class, 'cancel']);
});
