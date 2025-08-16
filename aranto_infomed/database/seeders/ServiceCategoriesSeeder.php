<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {   
         DB::statement('SET FOREIGN_KEY_CHECKS=0;');
         DB::table('service_categories')->truncate();
         DB::table('service_categories')->insert([
            ['id' => 22, 'name' => 'Servicios Sanatoriales', 'sede_id' =>  1],
            ['id' => 23, 'name' => 'Consultas Consultorios', 'sede_id' =>  1],
            ['id' => 24, 'name' => 'Servicios Cardiología', 'sede_id' =>  1],
            ['id' => 25, 'name' => 'Servicios Otorrinolaringología', 'sede_id' =>  1],
            ['id' => 26, 'name' => 'Servicios Radiología IMAP', 'sede_id' =>  1],
            ['id' => 27, 'name' => 'Servicios Ecografías', 'sede_id' =>  1],
            ['id' => 28, 'name' => 'Alquileres', 'sede_id' =>  1],
            ['id' => 29, 'name' => 'Servicios de Urgencia', 'sede_id' =>  1],
            ['id' => 30, 'name' => 'Servicios de Análisis', 'sede_id' =>  1],
            ['id' => 31, 'name' => 'Consulta en Urgencia', 'sede_id' =>  1],
            ['id' => 32, 'name' => 'Odontología', 'sede_id' =>  1],
            ['id' => 33, 'name' => 'IMAP S.A', 'sede_id' =>  1],
            ['id' => 34, 'name' => 'Servicios de RX', 'sede_id' =>  1],
            ['id' => 35, 'name' => 'Mamografía', 'sede_id' =>  1],
            ['id' => 36, 'name' => 'Ecografías de Urgencias', 'sede_id' =>  1],
            ['id' => 37, 'name' => 'Procedimientos Generales', 'sede_id' =>  1],
            ['id' => 38, 'name' => 'Servicios de Cocina', 'sede_id' =>  1],
            ['id' => 39, 'name' => 'Servicios Corazón de Mamá', 'sede_id' =>  1],
            ['id' => 40, 'name' => 'Mastología',    'sede_id' =>  1],
            ['id' => 41, 'name' => 'Mastologia Particular',    'sede_id' =>  1],
            ['id' => 45, 'name' => 'Honorario Médico Particular',
                'sede_id' =>  1],
            ['id' => 46, 'name' => 'Honorario Médico Unimed',
                'sede_id' =>  1],
            ['id' => 47, 'name' => 'Sala Internación',
                'sede_id' =>  1],
            ['id' => 48, 'name' => 'Test de Marcha',
                'sede_id' =>  1],
        ]);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->command->info('🎉 Migración completada: Service Categories insertados');
    }
}
