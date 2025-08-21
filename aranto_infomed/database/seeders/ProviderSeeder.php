<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        $tableLegacy = DB::connection('legacy_mysql')->table('proveedor')->get();
       
        DB::table('providers')->truncate();
   
          foreach ($tableLegacy as $table) {
        //id	sede_id	name	contact_person	email	phone	address	ruc	active	deleted_at	created_at	updated_at	
            DB::table('providers')->insert([
                'id'        => $table->IdProveedor,
                'name'      => $table->Nombre,
                'contact_person'=> "",
                'email'     => $table->Email,
                'ruc'       => $table->Ruc,
                'phone'     => $table->Telefono,
                'address'   => $table->Direccion,
                'active'    => $table->Estado=='ACTIVO' ?: true, // Asignar valor por defecto si es nulo
                'sede_id'   => 1, // Asignar sede_id por defecto
                'created_at'=> now(),
                'updated_at'=> now(),
            ]);
        }
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->command->info("✅ Proveedores importados desde db_legacy a aranto-infomed.");

    }
}
