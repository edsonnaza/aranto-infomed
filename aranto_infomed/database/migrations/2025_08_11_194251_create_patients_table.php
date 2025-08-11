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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
        $table->string('last_name')->nullable();  
        $table->string('first_name')->nullable();  
        $table->string('full_name')->nullable(); 
        $table->string('phone')->nullable();  
        $table->string('mobile')->nullable();  
        $table->enum('gender', ['H', 'M', 'O'])->nullable();  
        $table->string('document_number')->nullable();  
        $table->date('birth_date')->nullable();  
        $table->string('email')->nullable();
        $table->string('address')->nullable();
        $table->string('document_type')->nullable();
        $table->unsignedBigInteger('seguro_id')->nullable();  
        $table->unsignedBigInteger('ocupation_id')->nullable();
        $table->unsignedBigInteger('company_id')->nullable(); // Empresa del paciente
        
        // Si en un futuro conectas con tabla países:
        $table->unsignedBigInteger('country_id')->nullable(); // Nacionalidad
        
        $table->timestamps();

        // Relaciones (opcional si ya tienes la tabla)
        $table->foreign('seguro_id')->references('id')->on('seguros')->onDelete('set null');
        $table->foreign('country_id')->references('id')->on('countries')->onDelete('set null');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
