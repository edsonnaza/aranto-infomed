<?php

use App\Http\Controllers\ProfesionalController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('profesionales', [ProfesionalController::class, 'index'])->name('profesionales.index');
    Route::get('profesionales/create', [ProfesionalController::class, 'create'])->name('profesionales.create');
    Route::post('profesionales', [ProfesionalController::class, 'store'])->name('profesionales.store');
    Route::get('profesionales/{profesional}', [ProfesionalController::class, 'show'])->name('profesionales.show');
    Route::get('profesionales/{profesional}/edit', [ProfesionalController::class, 'edit'])->name('profesionales.edit');
    Route::put('profesionales/{profesional}', [ProfesionalController::class, 'update'])->name('profesionales.update');
    Route::delete('profesionales/{profesional}', [ProfesionalController::class, 'destroy'])->name('profesionales.destroy');
    Route::post('profesionales/{profesional}/toggle-active', [ProfesionalController::class, 'toggleActive'])->name('profesionales.toggleActive');
});