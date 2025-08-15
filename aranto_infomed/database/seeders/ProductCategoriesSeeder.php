<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class ProductCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    { 
       DB::table('product_categories')->truncate();
        
        // Insert product categories
       DB::table('product_categories')->insert([
            ['id' => 42, 'name' => 'Medicamentos', 'sede_id' => 1],
            ['id' => 43, 'name' => 'Descartables', 'sede_id' => 1],
            ['id' => 44, 'name' => 'Otros Farmacia', 'sede_id' => 1],
        ]);
    }
}
