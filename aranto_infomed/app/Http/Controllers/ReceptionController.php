<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\PatientVisit;
use App\Models\PatientVisitOrder;
use Inertia\Inertia;
use App\Models\Services;
use App\Models\ServicePrices;
use App\Models\Profesional;
use App\Models\Seguro;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validate;
use App\Services\PatientVisitService;
use Log;
use App\Traits\LoggerTrait;



class ReceptionController extends Controller
{
    use LoggerTrait;
    public function index()
    {  
         $seguros = Seguro::where('active', true)->get()->map(function ($s) {
        return [
            'id' => $s->id,
            'name' => $s->name,
        ];
    });

    return Inertia::render('reception/ReceptionPage', [
        'professionals' => Profesional::all(),
        'seguros' => $seguros
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

   public function storePatientVisit(Request $request, PatientVisitService $service)
    {
        // 🔹 Log inicial
        Log::info('[CONTROLLER][ReceptionController] Storing patient visit', $request->all());

        // 🔹 Validaciones
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'professional_id' => 'required|exists:professionals,id',
            'seguro_id' => 'nullable|exists:seguros,id',
            'visit_status' => 'required|string',
            'sede_id' => 'required|exists:sedes,id',
            'order.items' => 'required|array|min:1',
            'order.items.*.service_id' => 'required|exists:services,id',
            'order.items.*.quantity' => 'required|integer|min:1',
            'order.items.*.professional_id' => 'required|exists:professionals,id', // obligatorio
        ]);

        try {
            // 🔹 Intentamos crear visita + orden + items
            $visit = $service->createVisitWithOrder($request->all());

            Log::info('[CONTROLLER][ReceptionController] Visit stored successfully', [
                'visit_id' => $visit->id
            ]);

            // 🔹 Respuesta exitosa a Inertia
            return redirect()
                ->route('reception.index')
                ->with('success', "✅ Visita #{$visit->id} registrada correctamente");

        } catch (\Throwable $e) {
            // 🔥 Log completo del error
            Log::error('[CONTROLLER][ReceptionController] Failed to store visit', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
            ]);

            // ❌ Retorno realista al frontend (manteniendo los datos del formulario)
            return redirect()
                ->back()
                ->withInput()
                ->with('error', "❌ Error al guardar la visita. Intente de nuevo o contacte soporte. Detalle: {$e->getMessage()}");
        }
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
                        'seguro_id' => $s->seguro ? $s->seguro->id : null,
                        'seguro_name' => $s->seguro ? $s->seguro->name : null,
                    ];
                });

            return response()->json($patients);
    }

    public function searchService(Request $request)
    {
        $query = $request->input('q', '');
        $seguroId = $request->input('seguro_id');

        $services = Services::with(['serviceprices' => function ($q) use ($seguroId) {
        if ($seguroId) {
            $q->where('seguro_id', $seguroId);
        }
        $q->with('seguro'); // 👈 ahora sí funciona
        }])
        ->where('name', 'LIKE', "%{$query}%")
        ->limit(10)
        ->get()
        ->map(function ($s) use ($seguroId) {
         $price = $s->serviceprices->first();

            return [
                'id' => $s->id,
                'name' => $s->name,
                'price_sale' => $price ? $price->price_sale : 0,
                'seguro_id' => $seguroId,
                'seguro_name' => $price && $price->seguro ? $price->seguro->name : 'Particular',
            ];
        });
        
        return response()->json($services);
    }

    public function getServicePrice(Request $request, $serviceId)
    {
        $seguroId = $request->input('seguro_id');
        
        $price = ServicePrices::where('service_id', $serviceId)
                ->where('seguro_id', $seguroId)
                ->first()
                ->price_sale ?? 0;

        return response()->json(['price_sale' => $price]);
    }
}

