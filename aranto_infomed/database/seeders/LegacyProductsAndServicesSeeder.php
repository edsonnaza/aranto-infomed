<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LegacyProductsAndServicesSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('products')->truncate();
        DB::table('services')->truncate();
        DB::table('product_prices')->truncate();
        DB::table('service_prices')->truncate();

        // 1️⃣ Traer productos/servicios de tabla producto
        $legacyProducts = DB::connection('legacy_mysql')->table('producto')->get();

        foreach ($legacyProducts as $legacy) {
            $isService = in_array($legacy->IdCategoria, [
                22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45, 46, 47, 48
            ]);

            $createdAt = ($legacy->fecha_registro === '0000-00-00 00:00:00' || empty($legacy->fecha_registro))
                ? now()
                : $legacy->fecha_registro;

            if ($isService) {
                DB::table('services')->insert([
                    'id'          => $legacy->IdProducto,
                    'code'        => $legacy->Codigo,
                    'name'        => $legacy->Nombre,
                    'description' => $legacy->Descripcion,
                    'image'       => $legacy->Imagen,
                    'category_id' => $legacy->IdCategoria,
                    'sede_id'     => $legacy->sedeid ?: 1,
                    'active'      => strtoupper($legacy->Estado) === 'ACTIVO',
            
                    'origen'      => $legacy->origen,
                    'created_at'  => $createdAt,
                    'updated_at'  => now(),
                ]);
            } else {
                DB::table('products')->insert([
                    'id'          => $legacy->IdProducto,
                    'code'        => $legacy->Codigo,
                    'name'        => $legacy->Nombre,
                    'description' => $legacy->Descripcion,
                    'image'       => $legacy->Imagen,
                    'category_id' => $legacy->IdCategoria,
                    'active'      => strtoupper($legacy->Estado) === 'ACTIVO',
                    'origen'      => $legacy->origen,
                    'sede_id'     => $legacy->sedeid ?: 1,
                    'created_at'  => $createdAt,
                    'updated_at'  => now(),
                ]);
            }
        }

        // 2️⃣ Traer precios de tabla producto_precios
        $legacyPrices = DB::connection('legacy_mysql')->table('producto_precios')->get();

        foreach ($legacyPrices as $price) {
            $producto = $legacyProducts->firstWhere('IdProducto', $price->idproducto);

            if (!$producto) {
                continue; // Producto inexistente en tabla principal
            }

            $isService = in_array($producto->IdCategoria, [
                22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45, 46, 47, 48
            ]);

            $startDate = ($price->fecha_inicio === '0000-00-00 00:00:00' || empty($price->fecha_inicio))
                ? null
                : $price->fecha_inicio;

            if ($isService) {
                DB::table('service_prices')->insert([
                    'service_id'  => $price->idproducto,
                    'seguro_id'   => $price->idseguro ?: null,
                    'price_sale'  => $price->PrecioVenta ?: 0,
                    'price_cost'  => $producto->PrecioCosto ?: 0, // opcional
                    'iva_type_id' => $producto->ivaid ,
                    'start_date'  => $startDate,
                    'end_date'    => null,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            } else {
                DB::table('product_prices')->insert([
                    'product_id'  => $price->idproducto,
                    'seguro_id'   => $price->idseguro ?: null,
                    'price_sale'  => $price->PrecioVenta ?: 0,
                    'price_cost'  => $producto->PrecioCosto ?: 0, // opcional
                    'iva_type_id'=> $producto->ivaid ,
                    'sede_id'     => $producto->sedeid ?: 1,
                    'start_date'  => $startDate,
                    'end_date'    => null,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
         $this->command->info('✅ Products and services and prices migrated from db_legacy successfully.');
    }
}
