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
        Schema::table('patient_visit_order_items', function (Blueprint $table) {
            $table->enum('status', ['pending', 'paid', 'cancelled'])->default('pending')->after('total_price');
            $table->timestamp('paid_at')->nullable()->after('status');
            $table->timestamp('cancelled_at')->nullable()->after('paid_at');
            $table->string('payment_method')->nullable()->after('cancelled_at');
            $table->text('notes')->nullable()->after('payment_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patient_visit_order_items', function (Blueprint $table) {
            $table->dropColumn(['status', 'paid_at', 'cancelled_at', 'payment_method', 'notes']);
        });
    }
};
