<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'countries';

    protected $fillable = [
        'name',
        'nacionality',
        'continent',
        'active',
        'sede_id',
    ];

    public function sede()
    {
        return $this->belongsTo(Sede::class);
    }
}
