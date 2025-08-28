<?php
use App\Http\Controllers\ReceptionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('reception', [ReceptionController::class, 'index'])->name('reception.index');
    Route::post('/patients', [ReceptionController::class, 'storePatient'])->name('reception.storePatient');
    Route::post('/visits', [ReceptionController::class, 'storeVisit'])->name('reception.storeVisit');
    Route::post('/orders', [ReceptionController::class, 'storeOrder'])->name('reception.storeOrder');
    Route::post('/confirm', [ReceptionController::class, 'confirmVisit'])->name('reception.confirmVisit');
    Route::get('/reception/patients/search', [ReceptionController::class, 'searchPatient'])
        ->name('reception.patients.search');
    Route::get('/reception/services/search', [ReceptionController::class, 'searchServices'])
        ->name('reception.services.search');
});
