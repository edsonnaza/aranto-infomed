<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PatientsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $legacyPatients = DB::connection('legacy_mysql')
            ->table('pacientes')
            ->get([
                'Id',
                'Apellido',
                'Nombres',
                'fullname',
                'Telefono',
                'Celular',
                'Mail',
                'Domicilio',
                'Sexo',
                'Nrodoc',
                'Fecha_Nac',
                'seguroid',
                'Nacionalidad',
                'Ocupacion_Codigo',
                'idempresa',

            ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('patients')->truncate();

        foreach ($legacyPatients as $patient) {
            DB::table('patients')->insert([
                'id' => $patient->Id,
                'last_name' => $patient->Apellido,
                'first_name' => $patient->Nombres,
                'full_name' => $patient->fullname,
                'phone' => $patient->Telefono,
                'mobile' => $patient->Celular,
                'gender' => $patient->Sexo,
                'document_number' => $patient->Nrodoc,
                'birth_date' => $patient->Fecha_Nac && $patient->Fecha_Nac != '0000-00-00'
                    ? Carbon::parse($patient->Fecha_Nac)->format('Y-m-d')
                    : null,
                'seguro_id' => $patient->seguroid,
                'country_id' => $patient->Nacionalidad ?? null,
                'email' => $patient->Mail, // Assuming email is not available in legacy data
                'address' => $patient->Domicilio, // Assuming address is not available in legacy data
                'document_type' => null, // Assuming document type is not available in legacy data
                'ocupation_id' => $patient->Ocupacion_Codigo, // Assuming ocupation_id is not available in legacy data
                'company_id' => $patient->idempresa, // Assuming company_id is not available in legacy data
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('✅ Patients migrated from db_legacy successfully.');
    }
}
