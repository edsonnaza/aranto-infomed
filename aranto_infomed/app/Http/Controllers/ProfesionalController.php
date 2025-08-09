<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profesional;
use App\Models\Especialidad;
use Inertia\Inertia;

class ProfesionalController extends Controller
{
    public function index()
    {
        $profesionales = Profesional::with('especialidad')->get();

        $columns = [
            ['label' => 'ID', 'field' => 'id'],
            ['label' => 'Nombre', 'field' => 'name'],
            ['label' => 'Apellido', 'field' => 'last_name'],
            ['label' => 'Especialidad', 'field' => 'especialidad.nombre'],
            ['label' => 'Activo', 'field' => 'active'],
            ['label' => 'Comisión', 'field' => 'comision_percentage'],
            ['label' => 'Email', 'field' => 'email'],
            ['label' => 'Teléfono', 'field' => 'phone_number'],
            ['label' => 'Fecha Alta', 'field' => 'fecha_alta'],
            ['label' => 'CDI', 'field' => 'doc_cdi'],
            ['label' => 'Comisión Interno', 'field' => 'comision_interno'],
            ['label' => 'Comisión Externo', 'field' => 'comision_externo'],
        ];

        $data = $profesionales->map(function ($prof) {
            return [
                'id' => $prof->id,
                'name' => $prof->name,
                'last_name' => $prof->last_name,
                'especialidad' => $prof->especialidad ? [
                    'id' => $prof->especialidad->id,
                    'nombre' => $prof->especialidad->nombre
                ] : null,
                'active' => $prof->active,
                'comision_percentage' => $prof->comision_percentage,
                'email' => $prof->email,
                'phone_number' => $prof->phone_number,
                'fecha_alta' => $prof->fecha_alta,
                'doc_cdi' => $prof->doc_cdi,
                'comision_interno' => $prof->comision_interno,
                'comision_externo' => $prof->comision_externo,
            ];
        });

        $especialidades = Especialidad::select('id', 'nombre')->orderBy('nombre')->get();

        return Inertia::render('profesionales/Profesionales', [
            'columns' => $columns,
            'data' => $data,
            'especialidades' => $especialidades,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'especialidad_id' => 'required|exists:especialidades,id',
            'email' => 'nullable|email|max:255',
            'phone_number' => 'nullable|string|max:50',
            'comision_percentage' => 'nullable|numeric|min:0|max:100',
            'comision_interno' => 'nullable|string|max:255',
            'comision_externo' => 'nullable|string|max:255',
            'fecha_alta' => 'nullable|date',
            'doc_cdi' => 'nullable|string|max:50',
            'active' => 'boolean',
            'sede_id' => 'nullable|integer'
        ]);

        $validated['full_name'] = $validated['last_name'] . ' ' . $validated['name'];

        Profesional::create($validated);

        return back()->with('success', 'Profesional creado correctamente.');
    }

    public function update(Request $request, $id)
    {
        $profesional = Profesional::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'especialidad_id' => 'required|exists:especialidades,id',
            'email' => 'nullable|email|max:255',
            'phone_number' => 'nullable|string|max:50',
            'comision_percentage' => 'nullable|numeric|min:0|max:100',
            'comision_interno' => 'nullable|string|max:255',
            'comision_externo' => 'nullable|string|max:255',
            'fecha_alta' => 'nullable|date',
            'doc_cdi' => 'nullable|string|max:50',
            'active' => 'boolean',
            'sede_id' => 'nullable|integer'
        ]);

        $validated['full_name'] = $validated['last_name'] . ' ' . $validated['name'];

        $profesional->update($validated);

        return back()->with('success', 'Profesional actualizado correctamente.');
    }

    public function destroy($id)
    {
        $profesional = Profesional::findOrFail($id);
        $profesional->delete();

        return back()->with('success', 'Profesional eliminado correctamente.');
    }

    public function toggleActive($id)
    {
        $profesional = Profesional::findOrFail($id);
        $profesional->active = !$profesional->active;
        $profesional->save();

        return back()->with('success', 'Estado actualizado correctamente.');
    }
}
