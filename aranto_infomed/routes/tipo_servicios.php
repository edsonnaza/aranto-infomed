<?php

use App\Http\Controllers\TipoServiciosController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('tipo-servicios', [TipoServiciosController::class, 'index'])->name('tipo-servicios.index');
    Route::get('tipo-servicios/create', [TipoServiciosController::class, 'create'])->name('tipo-servicios.create');
    Route::post('tipo-servicios', [TipoServiciosController::class, 'store'])->name('tipo-servicios.store');
    Route::get('tipo-servicios/{tiposervicio}', [TipoServiciosController::class, 'show'])->name('tipo-servicios.show');
    Route::get('tipo-servicios/{tiposervicio}/edit', [TipoServiciosController::class, 'edit'])->name('tipo-servicios.edit');
    Route::put('tipo-servicios/{tiposervicio}', [TipoServiciosController::class, 'update'])->name('tipo-servicios.update');
    Route::delete('tipo-servicios/{tiposervicio}', [TipoServiciosController::class, 'destroy'])->name('tipo-servicios.destroy');
    Route::post('tipo-servicios/{tiposervicio}/toggle-active', [TipoServiciosController::class, 'toggleActive'])->name('tipo-servicios.toggleActive');
});