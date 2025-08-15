<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       // patient_visits
        Schema::create('patient_visits', function (Blueprint $table) {
            $table->id();

            // Relación con paciente
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');

            // Relación con médico/profesional
            $table->foreignId('profesional_id')->nullable()->constrained('profesionales')->nullOnDelete();

            // Relación con seguro médico
            $table->foreignId('seguro_id')->nullable()->constrained('seguros')->nullOnDelete();

            // Estado de la visita
            $table->enum('visit_status', ['scheduled', 'waiting', 'in_progress', 'completed', 'cancelled'])
                ->default('scheduled');

            // Fechas importantes
            $table->timestamp('scheduled_for')->nullable();
            $table->timestamp('check_in_at')->nullable();
            $table->timestamp('check_out_at')->nullable();

            // Autorización administrativa
            $table->boolean('authorized_for_service')->default(false);
            $table->timestamp('authorized_at')->nullable();
            $table->foreignId('authorized_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            // Sede
            $table->foreignId('sede_id')->nullable()->constrained('sedes')->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_visits');
    }
};
