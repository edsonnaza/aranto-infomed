<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Especialidad extends Model
{
    protected $fillable = [
        'nombre',
        'active',
        'sede_id',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

}
