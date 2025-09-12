<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/especialidades.php';
require __DIR__.'/profesionales.php';
require __DIR__.'/tipo_servicios.php';
require __DIR__.'/reception.php';
require __DIR__.'/patients.php';
require __DIR__.'/seguros.php';
require __DIR__.'/sede.php';
