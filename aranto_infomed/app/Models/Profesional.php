<?php

namespace App\Models;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Profesional extends Model
{
    use SoftDeletes;

    protected $table = 'professionals';

    protected $fillable = [
        'name',
        'last_name',
        'full_name',
        'gender',
        'especialidad_id',
        'active',
        'comission_percentage',
        'comission_interno',
        'comission_externo', 
        'sede_id',
        'fecha_alta',
        'email',
        'phone_number',
        'doc_cdi',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->name} {$this->last_name}";
    }

  
}
