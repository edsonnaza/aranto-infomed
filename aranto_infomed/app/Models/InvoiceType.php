<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceType extends Model
{
    protected $table = 'invoice_types';
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
