<?php
use App\Http\Controllers\SedeController;

Route::middleware('auth')->group(function () {
    Route::get('/sedes', [SedeController::class, 'index']);
});