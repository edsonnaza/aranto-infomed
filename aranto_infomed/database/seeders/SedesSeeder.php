<?php

namespace Database\Seeders;

use App\Models\Sede;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SedesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Sede::create([
            'company_name' => 'Clinic Center',
            'address' => 'Calle Principal 123',
            'phone_number' => '123456789',
            'email' => 'info@sedeprincipal.com',
            'city' => 'Ciudad del Este',
            'ruc' => '1234567890',
            'application_name' => 'Aranto',
            'app_description' => 'Sistema de Gestión para Clínicas y Consultorios',
            'logo' => 'logo.png',
        ]);
    }
}
