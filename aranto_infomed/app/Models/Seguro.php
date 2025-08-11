<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seguro extends Model
{
    protected $table = 'seguros';
    protected $fillable = [
        'name',
        'description',
        'active',
        'sede',
    ];
}
