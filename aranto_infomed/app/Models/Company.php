<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table = 'companies';

    protected $fillable = [
        'business_name',
        'tax_id',
        'address',
        'phone',
        'email',
        'logo',
        'active',
        'sede_id'        
    ];

    public function sede()
    {
        return $this->belongsTo(Sede::class);
    }
}
