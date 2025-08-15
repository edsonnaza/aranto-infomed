<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceCategories extends Model
{
    protected $table = 'service_categories';
    protected $fillable = ['name', 'active', 'sede_id'];

    public function sede()
    {
        return $this->belongsTo(Sede::class, 'sede_id');
    }
}
