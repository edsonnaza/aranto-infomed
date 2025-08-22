<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Cabecera de pagos de comisiones
        Schema::create('commission_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_register_opening_id')
                  ->nullable()
                  ->constrained('cash_register_openings')
                  ->nullOnDelete();

            $table->foreignId('cashier_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->foreignId('professional_id')
                  ->constrained('professionals')
                  ->cascadeOnDelete();

            $table->decimal('total_production', 15, 2); // total generado
            $table->decimal('amount_paid', 15, 2); // lo que se liquida

            $table->date('start_date'); // rango de fechas
            $table->date('end_date');

            $table->text('description')->nullable();
            $table->boolean('active')->default(true);

            $table->foreignId('seguro_id')
                  ->nullable()
                  ->constrained('seguros')
                  ->nullOnDelete();

            $table->foreignId('company_id')
                  ->nullable()
                  ->constrained('companies')
                  ->nullOnDelete();

            $table->foreignId('sede_id')
                  ->nullable()
                  ->constrained('sedes')
                  ->nullOnDelete();

            $table->timestamps();
        });

        // Detalle de qué órdenes fueron incluidas en el pago
        Schema::create('commission_payment_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commission_payment_id')
                  ->constrained('commission_payments')
                  ->cascadeOnDelete();

            $table->foreignId('order_id')
                  ->constrained('patient_visit_orders')
                  ->cascadeOnDelete();

            $table->decimal('order_amount', 15, 2); // monto del servicio
            $table->decimal('commission_percentage', 5, 2); // % aplicado
            $table->decimal('commission_amount', 15, 2); // comisión calculada

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commission_payment_details');
        Schema::dropIfExists('commission_payments');
    }
};
