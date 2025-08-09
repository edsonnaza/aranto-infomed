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
        Schema::create('tipo_servicios', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('active')->default('1')  ;
            $table->unsignedBigInteger('sede_id')->default(1)->nullable();
            $table->foreign('sede_id')->references('id')->on('sedes')->nullOnDelete();
            $table->softDeletes(); 
            $table->timestamps();
        });
        DB::statement('ALTER TABLE tipo_servicios AUTO_INCREMENT = 22;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipo_servicios');
    }
};
