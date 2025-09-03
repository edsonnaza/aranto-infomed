<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;  
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\PatientVisitOrder;
use App\Models\Patient;
use App\Models\Profesional;
use App\Models\Seguro;

class PatientVisit extends Model
{
    use HasFactory;

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

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function professional()
    {
        return $this->belongsTo(Profesional::class, 'professional_id');
    }

    public function seguro()
    {
        return $this->belongsTo(Seguro::class, 'seguro_id');
    }
}
