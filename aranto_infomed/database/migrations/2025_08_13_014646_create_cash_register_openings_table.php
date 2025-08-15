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
      Schema::create('cash_register_openings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('cashier_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('sede_id')->constrained('sedes')->onDelete('cascade');
        $table->decimal('opening_amount', 12, 2)->default(0);
        $table->decimal('total_sales', 12, 2)->default(0);
        $table->decimal('total_expenses', 12, 2)->default(0);
        $table->decimal('total_incomes', 12, 2)->default(0);
        $table->decimal('cash_balance', 12, 2)->default(0);
        $table->timestamp('opened_at')->nullable();
        $table->timestamp('closed_at')->nullable();
        $table->boolean('is_open')->default(true);
        $table->timestamps();
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_register_openings');
    }
};
