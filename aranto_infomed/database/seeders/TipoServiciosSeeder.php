<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TipoServiciosSeeder extends Seeder
{
    public function run()
    {
        $filePath = storage_path('app/data/categoria.sql');

        if (!file_exists($filePath)) {
            throw new \Exception("El archivo SQL no existe en: $filePath");
        }

        $sql = file_get_contents($filePath);

        // Extraer solo la parte de los VALUES
        if (!preg_match('/INSERT INTO `categoria`.*?VALUES\s*(.*);/s', $sql, $matches)) {
            throw new \Exception("No se encontraron valores en la sentencia INSERT.");
        }

        $values = trim($matches[1], " ;\n");
        $values = str_replace(["\n", "\r", '\\'], '', $values);

        // Separar cada fila
        $entries = explode('),(', trim($values, '()'));

        foreach ($entries as $row) {
            $fields = str_getcsv($row, ',', "'");

            if (count($fields) < 3) {
                continue;
            }

            $idCategoria = (int) $fields[0];

            // Detectar codificación y convertir a UTF-8 si es necesario
            $descripcion = trim($fields[1]);
            $encoding = mb_detect_encoding($descripcion, ['UTF-8', 'ISO-8859-1', 'Windows-1252'], true);
            if ($encoding && $encoding !== 'UTF-8') {
                $descripcion = mb_convert_encoding($descripcion, 'UTF-8', $encoding);
            }

            $sedeId = is_numeric($fields[2]) ? (int) $fields[2] : null;

            if ($sedeId !== 1) {
                continue;
            }

            DB::table('tipo_servicios')->insert([
                'id'         => $idCategoria,
                'name'       => $descripcion,
                'active'     => '1',
                'sede_id'    => $sedeId,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
