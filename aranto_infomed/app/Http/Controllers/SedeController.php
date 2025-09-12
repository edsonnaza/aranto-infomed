<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sede;
use Illuminate\Support\Facades\Auth;


class SedeController extends Controller
{
    public function index()
    {
        $sede = Sede::find(auth()->user()->sede_id);
        return response()->json($sede);
    }
}