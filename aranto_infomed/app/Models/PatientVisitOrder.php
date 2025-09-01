<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\PatientVisit;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PatientVisitOrder extends Model
{
   protected $fillable = [
        'patient_visit_id',
        'professional_id',
        'total_amount',
        'discount_amount',
        'discount_percent',
        'final_amount',
        'commission_percentage',
        'commission_amount',
        'status',
        'created_by',
    ];

    // Relación con los items del pedido
    public function items(): HasMany
    {
        return $this->hasMany(PatientVisitOrderItem::class, 'order_id');
    }
    public function visit()
    {
        return $this->belongsTo(PatientVisit::class, 'patient_visit_id');
    }
}

