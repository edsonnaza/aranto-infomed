<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Concept extends Model
{
    protected $table = 'concepts';
    protected $fillable = [
        'name',
        'active',
        'sede_id',
    ];
}
