<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;  
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\PatientVisitOrder;


class PatientVisit extends Model
{
    protected $table = 'patient_visits';

    protected $fillable = [
        'patient_id',
        'professional_id',
        'seguro_id',
        'visit_status',
        'sede_id',
        'created_by',
    ];

      public function orders(): HasMany
    {
        return $this->hasMany(PatientVisitOrder::class, 'patient_visit_id');
    }

}
