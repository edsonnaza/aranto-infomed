<?php

namespace Database\Seeders;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CashierRoleSeeder extends Seeder
{
   
    public function run(): void
    {
        // Crear el rol 'cashier' si no existe
        $role = Role::firstOrCreate(['name' => 'cashier']);

        // Asignar el rol a usuarios específicos (ejemplo: IDs 1 y 2)
        $userIds = [1, 9, 10, 54]; // Cambia por los IDs reales de tus cajeros
        foreach ($userIds as $id) {
            $user = User::find($id);
            if ($user) {
                $user->assignRole($role);
            }
        }
    }
}
