<?php

use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('patients', [PatientController::class, 'index'])->name('patients.index');
    Route::get('patients/create', [PatientController::class, 'create'])->name('patients.create');
    Route::post('patients', [PatientController::class, 'store'])->name('patients.store');
    Route::get('patients/{tiposervicio}', [PatientController::class, 'show'])->name('patients.show');
    Route::get('patients/{tiposervicio}/edit', [PatientController::class, 'edit'])->name('patients.edit');
    Route::put('patients/{tiposervicio}', [PatientController::class, 'update'])->name('patients.update');
    Route::delete('patients/{tiposervicio}', [PatientController::class, 'destroy'])->name('patients.destroy');
    Route::post('patients/{tiposervicio}/toggle-active', [PatientController::class, 'toggleActive'])->name('patients.toggleActive');
    Route::get('/patients/search', [PatientController::class, 'search'])
    ->name('patients.search');
});