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
    Route::get('/reception/services/search', [ReceptionController::class, 'searchService'])->name('reception.service.search');
    Route::get('/reception/services/price', [ReceptionController::class, 'getServicePrice'])
        ->name('reception.services.price');
    Route::post('/reception/visits', [ReceptionController::class, 'storePatientVisit'])->name('reception.storePatientVisit');
    Route::get('/reception/visits', [ReceptionController::class, 'visitsRegistered'])->name('reception.visits');
    Route::patch('/reception/visits/{id}', [ReceptionController::class, 'cancelVisit'])->name('reception.cancelVisit');
});
