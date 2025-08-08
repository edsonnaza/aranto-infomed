<?php

use App\Http\Controllers\EspecialidadController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('especialidades', [EspecialidadController::class, 'index'])->name('especialidades.index');
    Route::get('especialidades/create', [EspecialidadController::class, 'create'])->name('especialidades.create');
    Route::post('especialidades', [EspecialidadController::class, 'store'])->name('especialidades.store');
    Route::get('especialidades/{especialidad}', [EspecialidadController::class, 'show'])->name('especialidades.show');
    Route::get('especialidades/{especialidad}/edit', [EspecialidadController::class, 'edit'])->name('especialidades.edit');
    Route::put('especialidades/{especialidad}', [EspecialidadController::class, 'update'])->name('especialidades.update');
    Route::delete('especialidades/{especialidad}', [EspecialidadController::class, 'destroy'])->name('especialidades.destroy');
    Route::post('especialidades/{especialidad}/toggle-active', [EspecialidadController::class, 'toggleActive'])->name('especialidades.toggleActive');
});