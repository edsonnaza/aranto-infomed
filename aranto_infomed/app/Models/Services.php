<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Services extends Model
{
    protected $table = 'services';

    protected $fillable = [
        'name',
        'image',
        'description',
        'active',
    ];

    public function servicecategory()
    {
        return $this->belongsTo(ServiceCategories::class, 'servicecategory_id');
    }
     public function serviceprices()
    {
        return $this->hasMany(ServicePrices::class, 'service_id');
    }
    public function getPriceSaleAttribute()
    {
        return $this->serviceprices()->first()->price_sale ?? null;
    }

}
