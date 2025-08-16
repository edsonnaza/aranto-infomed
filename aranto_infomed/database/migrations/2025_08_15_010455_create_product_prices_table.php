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
        Schema::create('product_prices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('seguro_id')->nullable()->constrained('seguros');
            $table->decimal('price_sale', 12, 2)->default(0);
            $table->decimal('price_cost', 12, 2)->default(0);
            $table->decimal('iva_id', 5,0)->nullable();
            $table->foreignId('iva_type_id')->constrained('iva_types');
           
            $table->foreignId('sede_id')->constrained('sedes');  

            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_prices');
    }
};
