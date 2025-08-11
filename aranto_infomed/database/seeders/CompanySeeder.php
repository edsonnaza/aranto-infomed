<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Leer de la base legacy
        $tableLegacy = DB::connection('legacy_mysql')->table('empresas')->get();
    
        foreach ($tableLegacy as $table) {
            DB::table('companies')->insert([
                'id'        => $table->id,
                'business_name' => $table->razonsocial,
                'tax_id'    => $table->ruc,
                'address'   => $table->direccion,
                'phone'     => $table->telefono,
                'email'     => $table->email,
                'active'    => 1,
                'sede_id'   => 1,
                'created_at'=> Carbon::now(),
                'updated_at'=> Carbon::now(),
            ]);
        }

        $this->command->info("✅ Companias importados desde db_legacy a aranto-infomed.");

    }
}
