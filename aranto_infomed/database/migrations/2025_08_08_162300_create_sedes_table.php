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
        Schema::create('sedes', function (Blueprint $table) {
        $table->id();
        $table->string('company_name')->nullable();
        $table->string('application_name')->nullable();
        $table->string('app_description')->nullable();
        $table->string('phone_number')->nullable();
        $table->string('email')->nullable();
        $table->string('city')->nullable();
        $table->string('logo')->nullable();
        $table->string('ruc')->nullable();
        $table->string('address')->nullable();
        $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sedes');
    }
};
