<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SeguroSeeder extends Seeder
{
    public function run()
    {
        // Leer de la base legacy
        $segurosLegacy = DB::connection('legacy_mysql')->table('seguros')->get();
    
        foreach ($segurosLegacy as $seguro) {
            DB::table('seguros')->insert([
                'id'        => $seguro->id,
                'name'    => $seguro->nombre,
                'active'    => $seguro->estado,
                'sede_id'   => $seguro->sedeid,
                'created_at'=> Carbon::now(),
                'updated_at'=> Carbon::now(),
            ]);
        }

        $this->command->info("✅ Seguros importados desde db_legacy a aranto-infomed.");
    }
}
