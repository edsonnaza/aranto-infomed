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
        Schema::create('profesionales', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('last_name')->nullable();
            $table->string('full_name')->nullable();
            $table->enum('gender', ['H', 'M', 'O'])->nullable(); // O = Otro / No definido
            $table->unsignedBigInteger('especialidad_id')->nullable();
            $table->boolean('active')->default(true);
            $table->decimal('comision_percentage', 5, 2)->nullable(); // e.g. 25.50%
            $table->string('comision_interno')->nullable(); 
            $table->string('comision_externo')->nullable();
            $table->unsignedBigInteger('sede_id')->nullable();
            $table->date('fecha_alta')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('phone_number')->nullable();
            $table->string('doc_cdi')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreign('especialidad_id')->references('id')->on('especialidades')->nullOnDelete();
            $table->foreign('sede_id')->references('id')->on('sedes')->nullOnDelete();
        });
            
            DB::statement('ALTER TABLE profesionales AUTO_INCREMENT = 275;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profesionales');
    }
};

