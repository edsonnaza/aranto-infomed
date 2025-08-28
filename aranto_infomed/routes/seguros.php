<?php
use App\Http\Controllers\SeguroController;

Route::middleware('auth')->group(function () {
    Route::get('/seguros', [SeguroController::class, 'index']);
});