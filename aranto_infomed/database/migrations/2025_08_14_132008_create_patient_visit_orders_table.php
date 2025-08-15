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
       Schema::create('patient_visit_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_visit_id')->constrained('patient_visits')->onDelete('cascade');
            $table->decimal('total_amount', 12, 2)->default(0); // total bruto sin descuento
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->decimal('final_amount', 12, 2)->default(0); // total - descuentos
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('confirmed');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();
       });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_visit_orders');
    }
};
