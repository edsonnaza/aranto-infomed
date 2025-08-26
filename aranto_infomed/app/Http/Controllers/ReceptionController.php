<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\PatientVisit;
use App\Models\PatientVisitOrder;
use Inertia\Inertia;
use App\Models\Services;
use App\Models\Profesional;

class ReceptionController extends Controller
{
    public function index()
    {
        return Inertia::render('reception/Index', [
            'services' => Services::all(),
            'professionals' => Profesional::all(),
        ]);
    }

    public function storePatient(Request $request)
    {
        $patient = Patient::create($request->validate([
            'name' => 'required|string|max:255',
            'document' => 'required|string|max:50|unique:patients,document',
            'dob' => 'nullable|date',
            'phone' => 'nullable|string|max:50',
            'insurance_id' => 'nullable|exists:insurances,id',
        ]));

        return back()->with('patient_id', $patient->id);
    }

    public function storeVisit(Request $request)
    {
        $visit = PatientVisit::create([
            'patient_id' => $request->patient_id,
            'sede_id' => $request->sede_id,
            'company_id' => $request->company_id,
            'status' => 'pending',
        ]);

        return back()->with('visit_id', $visit->id);
    }

    public function storeOrder(Request $request)
    {
        PatientVisitOrder::create([
            'patient_visit_id' => $request->visit_id,
            'service_id' => $request->service_id,
            'professional_id' => $request->professional_id,
            'status' => 'pending',
        ]);

        return back();
    }

    public function confirmVisit(Request $request)
    {
        $visit = PatientVisit::findOrFail($request->visit_id);
        $visit->update(['status' => 'confirmed']);

        return redirect()->route('cashier.index')->with('visit_id', $visit->id);
    }
}

