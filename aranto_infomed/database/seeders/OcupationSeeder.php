<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class OcupationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
                // Leer de la base legacy
        $tableLegacy = DB::connection('legacy_mysql')->table('ocupacion')->get();
    
        foreach ($tableLegacy as $table) {
            DB::table('ocupations')->insert([
                'id'        => $table->id,
                'name'    => $table->nombre,
                'active'    => 1,
                'sede_id'   => 1,
                'created_at'=> Carbon::now(),
                'updated_at'=> Carbon::now(),
            ]);
        }

        $this->command->info("✅ Ocupaciones importados desde db_legacy a aranto-infomed.");
    }
}
