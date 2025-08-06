<?php

namespace App\Http\Controllers;
use App\Models\Especialidad;
use Illuminate\Http\Request;

class EspecialidadController extends Controller
{
     public function index()
    {
        $especialidades = Especialidad::all();
        return view('especialidades.index', compact('especialidades'));
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
            'sede_id' => 'required|integer',
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
            'sede_id' => 'required|integer',
        ]);

        $especialidad->update($request->all());

        return redirect()->route('especialidades.index');
    }

    public function destroy(Especialidad $especialidad)
    {
        $especialidad->delete();

        return redirect()->route('especialidades.index');
    }
}
