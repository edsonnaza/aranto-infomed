<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
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
            'password' => $this->encryptPassword($legacyUser['Pass']),
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


    private function encryptPassword(string $plainPassword): string
    {   $plainPassword = trim($plainPassword);
        // if (empty($plainPassword) || str_contains($plainPassword, '#####')) {
        //     return Hash::make('temp123456');
        // }
       // dd($plainPassword);
       // dd(strlen($plainPassword));
        return Hash::make($plainPassword);
    }

    private function countValidPasswords(array $users): int
    {
        return collect($users)
            ->filter(fn($u) => !empty($u['Pass']) && !str_contains($u['Pass'], '#####'))
            ->count();
    }
}
