<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IvaTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
             // Leer de la base legacy
        $tableLegacy = DB::connection('legacy_mysql')->table('iva')->get();
       
        DB::table('iva_types')->truncate();
   
          foreach ($tableLegacy as $table) {
        
            DB::table('iva_types')->insert([
                'id'        => $table->id,
                'name'      => $table->nombreiva,
                'percentage'=> $table->valor ?: 0.00,
                'active'    => $table->estado ?: true, // Asignar valor por defecto si es nulo
                'sede_id'   => 1, // Asignar sede_id por defecto
                'created_at'=> now(),
                'updated_at'=> now(),
            ]);
        }

        $this->command->info("✅ Tipo de iva de factura importados desde db_legacy a aranto-infomed.");

    }
}
