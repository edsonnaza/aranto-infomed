<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class CountriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
             $tableLegacy = DB::connection('legacy_mysql')->table('paises')->get();
    
        foreach ($tableLegacy as $table) {
          
            DB::table('countries')->insert([
                'id'        => $table->id,
                'name'      => $table->nombre,
                'nacionality' => $table->nacionalidad,
                'continent' => $table->continente,
                'active'    => true,
                'sede_id'   => 1,
                'created_at'=> Carbon::now(),
                'updated_at'=> Carbon::now(),
            ]);
        }

        $this->command->info("✅ Importados Paises como countries desde db_legacy a aranto-infomed.");

    }
}
