<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profesional;

class ProfesionalController extends Controller
{
    public function index()
    {
        $profesionales = Profesional::all();
        return view('profesional.index', compact('profesionales'));
    }

    public function create()
    {
        return view('profesional.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'last_name' => 'required',
            'full_name' => 'required',
            'gender' => 'required',
            'especialidad_id' => 'required',
            'active' => 'required',
            'comision_percentage' => 'required',
            'comision_interno' => 'required',
            'comision_externo' => 'required',
            'sede_id' => 'required',
            'fecha_alta' => 'required',
            'email' => 'required',
            'phone_number' => 'required',
            'doc_cdi' => 'required',
        ]);

        Profesional::create($request->all());

        return redirect()->route('profesional.index');
    }

    public function show($id)
    {
        $profesional = Profesional::find($id);
        return view('profesional.show', compact('profesional'));
    }

    public function edit($id)
    {
        $profesional = Profesional::find($id);
        return view('profesional.edit', compact('profesional'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'last_name' => 'required',
            'full_name' => 'required',
            'gender' => 'required',
            'especialidad_id' => 'required',
            'active' => 'required',
            'comision_percentage' => 'required',
            'comision_interno' => 'required',
            'comision_externo' => 'required',
            'sede_id' => 'required',
            'fecha_alta' => 'required',
            'email' => 'required',
            'phone_number' => 'required',
            'doc_cdi' => 'required',
        ]);

        $profesional = Profesional::find($id);
        $profesional->update($request->all());

        return redirect()->route('profesional.index');
    }

    public function destroy($id)
    {
        $profesional = Profesional::find($id);
        $profesional->delete();

        return redirect()->route('profesional.index');
    }
}
