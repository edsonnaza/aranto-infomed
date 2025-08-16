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
    {    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
              
        // Insert product categories
       DB::table('product_categories')->insert([
            ['id' => 42, 'name' => 'Medicamentos', 'sede_id' => 1],
            ['id' => 43, 'name' => 'Descartables', 'sede_id' => 1],
            ['id' => 44, 'name' => 'Otros Farmacia', 'sede_id' => 1],
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('✅ Categorias de productos importados desde db_legacy a aranto-infomed.');
    }
}
