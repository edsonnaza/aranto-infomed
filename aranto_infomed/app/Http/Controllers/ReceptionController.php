<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\PatientVisit;
use App\Models\PatientVisitOrder;
use Inertia\Inertia;
use App\Models\Services;
use App\Models\Profesional;
use App\Models\Seguro;

class ReceptionController extends Controller
{
    public function index()
    {  
        $services = Services::with('serviceprices')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'price_sale' => $s->serviceprices->first()->price_sale ?? 0,
            ];
        });

        return Inertia::render('reception/Index', [
            'services' => $services,
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

    public function searchPatient(Request $request)
    {
            $query = $request->input('q', '');

            $patients = Patient::with('seguro') // eager load para evitar N+1
                ->where('full_name', 'LIKE', "%{$query}%")
                ->limit(10)
                ->get()
                ->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'full_name' => $s->full_name,
                        'seguro_name' => $s->seguro ? $s->seguro->name : null,
                    ];
                });

            return response()->json($patients);
    }

      public function searchServices(Request $request)
    {
        $query = $request->input('q', '');

        $services = Services::query()
            ->where('name', 'LIKE', "%{$query}%")
            ->with('serviceprices')
            ->limit(10)
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'name' => $s->name,
                    'price_sale' => $s->serviceprices->first()->price_sale ?? 0,
                ];
            });

        return response()->json($services);
    }

}

