<?php

namespace App\Models;

use App\Models\Country;
use App\Models\Ocupation;
use App\Models\Company;
 

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'patients';

    protected $fillable = [
        'first_name',
        'last_name',
        'full_name',
        'mobile_number',
        'gender',
        'document_type',
        'document_number',
        'email',
        'address',
        'birthdate',
        'country_id',
        'ocupation_id',
        'company_id',
    ];

    public function ocupation()
    {
        return $this->belongsTo(Ocupation::class);
    }
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function seguro()
    {
      return $this->belongsTo(Seguro::class);
    }

    public function visits()
    {
        return $this->hasMany(PatientVisit::class);
    }
    
}
