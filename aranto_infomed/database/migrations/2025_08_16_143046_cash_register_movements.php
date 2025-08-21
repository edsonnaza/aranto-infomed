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
        Schema::create('cash_register_movements', function (Blueprint $table) {
            $table->id();

            // Relación con apertura de caja
            $table->foreignId('cash_register_opening_id')
                ->constrained('cash_register_openings')
                ->cascadeOnDelete();

            // Cajero y sede
            $table->foreignId('cashier_id')->nullable()->constrained('users');
            $table->foreignId('sede_id')->nullable()->constrained('sedes');

            // Tipo de movimiento
            $table->enum('type', ['income', 'expense']);

            // Clasificación del movimiento
            $table->foreignId('concept_id')->nullable()->constrained('concepts');
            $table->string('legacy_source')->nullable(); // Fuente del movimiento (legacy)
            $table->unsignedBigInteger('legacy_id')->nullable(); // ID del movimiento en el sistema legado
            // Relación con proveedor/cliente
            $table->foreignId('provider_id')->nullable()->constrained('providers');
            $table->foreignId('client_id')->nullable()->constrained('patients');

            // Referencias adicionales
            $table->unsignedBigInteger('reference_id')->nullable();

            // Información contable
            $table->string('invoice_number')->nullable();
            $table->decimal('amount', 15, 2);
            $table->text('description')->nullable();
            $table->timestamp('movement_date')->nullable();

            
            $table->boolean('active')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_register_movements');
    }
};
