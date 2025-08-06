<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    protected $table = 'users'; 
    //protected $primaryKey = 'Id'; // así está en tu base legacy

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    // protected $fillable = [
    //     'name',
    //     'email',
    //     'password',
    // ];
     protected $fillable = [
        //'User',
        //'Pass',
       // 'Apellido',
        'full_name',
        //'E_Mail',
        'permissions_level',
        //'active',
        'is_active',
        'name',
        'email',
        'password',
        // otros campos que vayas a usar
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    // public function getAuthPassword()
    // {
    //     return $this->Pass;
    // }

    // public function setPassAttribute($value)
    // {
    //     $this->attributes['password'] = bcrypt($value);
    // }
}
