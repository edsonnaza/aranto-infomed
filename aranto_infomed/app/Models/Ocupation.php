<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ocupation extends Model
{
    protected $table = 'ocupations';

    protected $fillable = [
        'name',
        'description',
        'active',
        'sede_id',
    ];

    public function sede()
    {
        return $this->belongsTo(Sede::class);
    }
}
