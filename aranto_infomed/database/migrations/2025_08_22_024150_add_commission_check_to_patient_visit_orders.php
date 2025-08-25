<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // 1️⃣ Normalizar datos antes de aplicar el constraint
        DB::statement("
            UPDATE patient_visit_payments
            SET comission_number = NULL
            WHERE commission_paid = 0
        ");

        DB::statement("
            UPDATE patient_visit_payments
            SET comission_number = id
            WHERE commission_paid = 1 AND comission_number IS NULL
        ");

        // 2️⃣ Agregar constraint CHECK (solo disponible en MySQL >= 8.0.16)
        DB::statement("
            ALTER TABLE patient_visit_payments
            ADD CONSTRAINT chk_comission_once
            CHECK (
              (commission_paid = 0 AND comission_number IS NULL)
              OR (commission_paid = 1 AND comission_number IS NOT NULL)
            )
        ");
    }

    public function down(): void
    {
        // ⚠️ En MySQL se usa DROP CHECK, no DROP CONSTRAINT
        DB::statement("
            ALTER TABLE patient_visit_payments
            DROP CHECK chk_comission_once
        ");
    }
};
