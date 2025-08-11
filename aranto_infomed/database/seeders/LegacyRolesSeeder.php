<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class LegacyRolesSeeder extends Seeder
{
    public function run(): void
    {
        $tableLegacy = DB::connection('legacy_mysql')->table('tipousuario')->get();

        foreach ($tableLegacy as $legacyRole) {
            Role::firstOrCreate(
                ['name' => strtoupper($legacyRole->Descripcion)], // Usamos la descripción como nombre del rol
                ['guard_name' => 'web'] // Guard por defecto en Laravel
            );
        }
        $this->command->info('Roles importados desde el sistema legacy con éxito ✅');
    }
}
