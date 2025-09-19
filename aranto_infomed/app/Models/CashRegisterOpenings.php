<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CashRegisterOpenings extends Model
{

    protected $fillable = [
        'cashier_id',
        'sede_id',
        'opening_amount',
        'total_sales',
        'total_expenses',
        'total_incomes',
        'cash_balance',
        'opened_at',
        'closed_at',
        'is_open',
    ];

    public $timestamps = true;

    // Relación con el cajero
    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    // Relación con la sede
    public function sede()
    {
        return $this->belongsTo(Sede::class, 'sede_id');
    }
}
