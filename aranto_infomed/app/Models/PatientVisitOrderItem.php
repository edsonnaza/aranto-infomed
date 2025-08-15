<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientVisitOrderItem extends Model
{
    protected $fillable = [
        'order_id', 'service_id', 'service_name', 'profesional_id',
        'quantity', 'unit_price', 'discount_amount', 'total_price'
    ];

    public function order()
    {
        return $this->belongsTo(PatientVisitOrder::class, 'order_id');
    }
}

