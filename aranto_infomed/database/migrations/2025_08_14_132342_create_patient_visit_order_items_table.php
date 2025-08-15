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
       Schema::create('patient_visit_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('patient_visit_orders')->onDelete('cascade');
            $table->unsignedBigInteger('service_id')->nullable(); // si tenés catálogo de servicios
            $table->string('service_name'); // para guardar el nombre exacto en caso de que cambie el catálogo
            $table->foreignId('profesional_id')->nullable()->constrained('profesionales')->nullOnDelete();
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('total_price', 12, 2)->default(0); // quantity * unit_price - descuento
            $table->timestamps();
         });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_visit_order_items');
    }
};
