<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProfesionalSeeder extends Seeder
{
    public function run()
    {
        $filePath = storage_path('app/data/profesionales.sql');

        if (!file_exists($filePath)) {
            throw new \Exception("El archivo SQL no existe en: $filePath");
        }

        $sql = file_get_contents($filePath);

        // Extraer solo la parte de los VALUES
        if (!preg_match('/INSERT INTO `profesionales`.*?VALUES\s*(.*);/s', $sql, $matches)) {
            throw new \Exception("No se encontraron valores en la sentencia INSERT.");
        }

        $values = trim($matches[1], " ;\n");
        $values = str_replace(["\n", "\r", '\\'], '', $values);

        // Separar cada fila
        $entries = explode('),(', trim($values, '()'));

        foreach ($entries as $row) {
            // str_getcsv maneja valores con comas y comillas
            $fields = str_getcsv($row, ',', "'");

            // Validar mínimo de columnas
            if (count($fields) < 32) {
                continue;
            }

            // Omitir si está marcado como eliminado
            if (strtoupper(trim($fields[30])) === 'SI') {
                continue;
            }

            // Especialidad_id
            $especialidadId = is_numeric($fields[4]) && (int)$fields[4] > 0 ? (int)$fields[4] : null;

            // Fecha alta válida
            $fechaAlta = (preg_match('/^\d{4}-\d{2}-\d{2}$/', $fields[28]) && $fields[28] !== '0000-00-00')
                ? $fields[28]
                : null;

            // Género válido
            $gender = in_array($fields[29], ['H', 'M', 'O']) ? $fields[29] : null;

            // Teléfono prioritario
            $phone = trim($fields[8]) ?: trim($fields[6]) ?: null;

            DB::table('profesionales')->insert([
                'id' => (int) $fields[0], // Profesional_Codigo
                'last_name' => trim($fields[2]),
                'name' => trim($fields[3]),
                'full_name' => trim($fields[2]) . ' ' . trim($fields[3]),
                'especialidad_id' => $especialidadId,
                'phone_number' => $phone,
                'email' => trim($fields[9]) ?: null,
                'doc_cdi' => trim($fields[11]) ?: null,
                'comision_percentage' => is_numeric($fields[25]) ? (float) $fields[25] : null,
                'comision_interno' => is_numeric($fields[26]) ? (float) $fields[26] : null,
                'comision_externo' => is_numeric($fields[27]) ? (float) $fields[27] : null,
                'sede_id' => is_numeric($fields[31]) ? (int) $fields[31] : null,
                'fecha_alta' => $fechaAlta,
                'gender' => $gender,
                'active' => trim($fields[20]) === '1',
            ]);
        }
    }
}
