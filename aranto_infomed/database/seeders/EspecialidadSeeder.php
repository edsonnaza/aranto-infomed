<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EspecialidadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
  public function run(): void
    {
        $filePath = storage_path('app/data/especialidades.sql');
        $sql = file_get_contents($filePath);
        $sql = explode('INSERT INTO `especialidades` (`Id`, `Nombre`) VALUES', $sql);
        $sql = $sql[1];
        $sql = str_replace(array("\n", "\r"), '', $sql);
        $sql = str_replace(array('`', '\\'), '', $sql);
        $sql = "INSERT INTO especialidades (id, nombre) VALUES " . $sql;
        $sql = str_replace(array(
            '/\*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT \*/;',
            '/\*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS \*/;',
            '/\*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION \*/;',
        ), '', $sql);
        DB::unprepared($sql);
    }
}
