<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Sede;

// Agrega este use para Spatie
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;  // agrega HasRoles aquí
    
    protected $table = 'users'; 

    protected $fillable = [
        'full_name',
        'permissions_level',
        'is_active',
        'name',
        'email',
        'password',
        'sede_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function sedes()
    {
        return $this->belongsTo(Sede::class);
    }
}
