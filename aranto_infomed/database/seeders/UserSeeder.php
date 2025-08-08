<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/users.json');
        $jsonData = file_get_contents($jsonPath);
        $legacyUsers = json_decode($jsonData, true);

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('users')->truncate();

        foreach ($legacyUsers as $legacyUser) {
            $userData = [
                'id' => $legacyUser['Id'],
                'name' => $legacyUser['User'],
                'full_name' => trim(($legacyUser['Nombres'] ?? '') . ' ' . ($legacyUser['Apellido'] ?? '')),
                'email' => !empty($legacyUser['E_Mail']) ? $legacyUser['E_Mail'] : $legacyUser['User'] . '@aranto-infomed.com',
                'password' => bcrypt($legacyUser['Pass']),
                'sede_id' => $legacyUser['Sede_Id'] ?? null,
                'permissions_level' => $legacyUser['permisos'] ?? 1,
                'is_active' => (bool) ($legacyUser['activo'] ?? true),
                'created_at' => !empty($legacyUser['fechaalta']) ? Carbon::parse($legacyUser['fechaalta']) : now(),
                'updated_at' => now(),
            ];

            DB::table('users')->insert($userData);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('✅ Usuarios migrados desde users.json');
        $this->command->info('🔐 Contraseñas protegidas con bcrypt');
    }
}
