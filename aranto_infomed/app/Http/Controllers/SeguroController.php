<?php

namespace App\Http\Controllers;

use App\Models\Seguro;

use Illuminate\Http\Request;

class SeguroController extends Controller
{
    public function index()
    {
        $seguros = Seguro::select('id', 'name')->orderBy('name')->get();
        return response()->json($seguros);
    }
}
