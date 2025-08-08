<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sede extends Model
{
       use SoftDeletes;

    protected $table = 'sedes';

    protected $fillable = [
        'company_name',
        'application_name',
        'app_description',
        'phone_number',
        'email',
        'city',
        'logo',
        'ruc',
        'address',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    public function profesionales()
    {
        return $this->hasMany(Profesional::class);
    }
}
