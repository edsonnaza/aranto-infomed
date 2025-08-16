<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Sede;

class IvaTypes extends Model
{
    protected $table = 'iva_types';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'percentage',
        'active',
        'sede_id',
    ];

     public function sede()
    {
        return $this->belongsTo(Sede::class);
    }


}
