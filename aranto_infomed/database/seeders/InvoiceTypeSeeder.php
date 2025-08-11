<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class InvoiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Leer de la base legacy
        $tableLegacy = DB::connection('legacy_mysql')->table('tipodocumento')->get();
    
          foreach ($tableLegacy as $table) {
        
            DB::table('invoice_types')->insert([
                'id'        => $table->IdTipoDocumento,
                'name'      => $table->Descripcion,
                'active'    => true, // Asignar valor por defecto si es nulo
                'sede_id'   => 1,
                'created_at'=> Carbon::now(),
                'updated_at'=> Carbon::now(),
            ]);
        }

        $this->command->info("✅ Tipo de documentos de factura importados desde db_legacy a aranto-infomed.");

    }
}
