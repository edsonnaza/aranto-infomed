<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UsersRolesSeeder extends Seeder
{
    public function run()
    {
        // Crear roles si no existen (basados en IdTipoUsuario)
        $rolesMap = [
            1 => 'ADMINISTRADOR',
            2 => 'CAJERO',
            3 => 'RECEPCIONISTA',
            4 => 'ENFERMERA',
            5 => 'MEDICO',
        ];

        foreach ($rolesMap as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Obtener todos los usuarios migrados (en la base nueva)
        $users = User::all();

        foreach ($users as $user) {
            // Consultar el IdTipoUsuario desde la base legacy
            $empleado = DB::connection('legacy_mysql')
                ->table('empleado')
                ->where('IdEmpleado', $user->id)
                ->first();

            if ($empleado && isset($rolesMap[$empleado->IdTipoUsuario])) {
                $roleName = $rolesMap[$empleado->IdTipoUsuario];
                $user->assignRole($roleName);
            } else {
                // Puedes asignar un rol por defecto si no encuentra relación
                $user->assignRole('USER');
            }
        }

        $this->command->info('✅ Roles asignados desde db_legacy.empleado correctamente.');
    }
}
