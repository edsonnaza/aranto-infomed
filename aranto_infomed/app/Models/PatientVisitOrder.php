<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\PatientVisit;

class PatientVisitOrder extends Model
{
    protected $fillable = [
        'patient_visit_id', 'total_amount', 'discount_amount',
        'discount_percent', 'final_amount', 'status',
        'created_by', 'confirmed_at'
    ];

    public function visit()
    {
        return $this->belongsTo(PatientVisit::class, 'patient_visit_id');
    }

    public function items()
    {
        return $this->hasMany(PatientVisitOrderItem::class, 'order_id');
    }
}

