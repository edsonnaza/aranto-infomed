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
      Schema::create('patient_visit_payments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('patient_visit_id')->constrained('patient_visits')->onDelete('cascade');
        $table->foreignId('profesional_id')->nullable()->constrained('profesionales')->nullOnDelete();
        $table->foreignId('cash_register_openings_id')->nullable()->constrained('cash_register_openings')->nullOnDelete();
        $table->enum('payment_status', ['paid', 'pending', 'cancelled'])->default('pending');
        $table->decimal('amount', 12, 2)->default(0);
        $table->boolean('commission_paid')->default(false);
        $table->decimal('commission_percentage', 12, 2)->default(0);
        $table->decimal('comission_number', 12, 2)->nullable()->default(0); // Método de pago (efectivo, tarjeta, etc.)
        $table->timestamp('payment_date')->nullable();

        $table->timestamps();
    });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_visit_payments');
    }
};
