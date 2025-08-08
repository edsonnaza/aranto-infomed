<?php

namespace App\Http\Controllers;
use App\Models\Especialidad;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EspecialidadController extends Controller
{
    public function index()
    {
        $especialidades = Especialidad::all();
        $columns = [
            ['label' => 'ID', 'field' => 'id'],
            ['label' => 'Nombre', 'field' => 'nombre'],
            ['label' => 'Activo', 'field' => 'active'],
        ];
        $data = $especialidades->map(function ($especialidad) {
            return [
                'id' => $especialidad->id,
                'nombre' => $especialidad->nombre,
                'active' => $especialidad->active,
            ];
        })->toArray();
        return Inertia::render('especialidad/Especialidad', [
            'columns' => $columns,
            'data' => $data,
            'especialidades' => $especialidades,
        ]);
    }

    public function create()
    {
        return view('especialidades.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'active' => 'required|boolean',
        ]);

        Especialidad::create($request->all());

        return redirect()->route('especialidades.index');
    }

    public function show(Especialidad $especialidad)
    {
        return view('especialidades.show', compact('especialidad'));
    }

    public function edit(Especialidad $especialidad)
    {
        return view('especialidades.edit', compact('especialidad'));
    }

    public function update(Request $request, Especialidad $especialidad)
    {
        $request->validate([
            'nombre' => 'required|string',
            'active' => 'required|boolean',
        ]);

        $especialidad->update($request->all());

        return redirect()->route('especialidades.index');
    }

    public function destroy(Especialidad $especialidad)
    {
        $especialidad->delete();

        return redirect()->route('especialidades.index');
    }

    public function toggleActive(Especialidad $especialidad)
    {
        $especialidad->update([
            'active' => !$especialidad->active
        ]);

        return redirect()->route('especialidades.index');
    }
}
