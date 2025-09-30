<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientVisitPayments extends Model
{
    protected $table = 'patient_visit_payments';

    protected $fillable = [
        'patient_visit_id',
        'amount',
        'payment_method',
        'payment_status',
        'notes',
        'professional_id',
        'cash_register_openings_id',
        'commission_paid',
        'commission_percentage',
        'comission_number',
        'payment_date',
        'processed_by',
        'processed_at',
    ];
}
