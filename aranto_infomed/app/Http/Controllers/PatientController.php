<?php

namespace App\Http\Controllers;

use App\Models\Patient;

use Illuminate\Http\Request;

class PatientController extends Controller
{
   public function search(Request $request)
{
    $query = $request->input('q', '');

    $patients = Patient::query()
        ->where('full_name', 'LIKE', "%{$query}%")
        ->limit(10)
        ->get(['id', 'full_name']);

    return response()->json($patients);
}

}
