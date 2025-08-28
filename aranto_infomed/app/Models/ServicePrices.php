<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicePrices extends Model
{
     protected $table = 'service_prices';

     protected $fillable = [
                'service_id',
                'seguro_id',
                'price_sale',
                'price_cost',
                'iva_type_id',
                ];


    public function service()
    {
        return $this->belongsTo(Services::class);
    }
}
