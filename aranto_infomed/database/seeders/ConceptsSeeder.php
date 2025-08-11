<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ConceptsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       // Leer de la base legacy
        $tableLegacy = DB::connection('legacy_mysql')->table('conceptos')->get();
    
        foreach ($tableLegacy as $table) {
            $active = false; // Valor por defecto
            if($table->activo === 'SI') {
                $active = true; // Asignar valor por defecto si es nulo
            }
            DB::table('concepts')->insert([
                'id'        => $table->id,
                'name'      => $table->nombre,
                'active'    => $active,
                'sede_id'   => 1,
                'created_at'=> Carbon::now(),
                'updated_at'=> Carbon::now(),
            ]);
        }

        $this->command->info("✅ Conceptos importados desde db_legacy a aranto-infomed.");

    }
}
