<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class DatabaseSeeder extends Seeder
{
    private function encryptPassword(string $plainPassword): string
    {   $plainPassword = trim($plainPassword);
        return Hash::make($plainPassword);
    }

    private function countValidPasswords(array $users): int
    {
        return collect($users)
            ->filter(fn($u) => !empty($u['Pass']) && !str_contains($u['Pass'], '#####'))
            ->count();
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            SedesSeeder::class,
            UserSeeder::class,
            EspecialidadSeeder::class,
            ProfesionalSeeder::class,
            // Add other seeders here as needed
        ]);
    }   
}
