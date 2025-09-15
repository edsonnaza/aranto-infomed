<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientVisitOrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'service_id',
        'professional_id',
        'service_name',
        'quantity',
        'unit_price',
        'discount_amount',
        'total_price',
        'commission_amount',
        'commission_percentage',
        'seguro_id',
        'discount_percentage',
        'final_amount',
        'status',
        'created_by',
    ];

    public function order()
    {
        return $this->belongsTo(PatientVisitOrder::class, 'order_id');
    }
    public function professional()
    {
        return $this->belongsTo(Profesional::class, 'professional_id');
    }

    public function getProfessionalNameAttribute()
    {
        return $this->professional?->full_name; // o el campo que uses
    }
}

