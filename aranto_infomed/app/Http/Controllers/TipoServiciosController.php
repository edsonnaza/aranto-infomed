<?php

namespace App\Http\Controllers;

use App\Models\TipoServicio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TipoServiciosController extends Controller
{
    public function index()
    {
        $tipoServicios = TipoServicio::all();

        $columns = [
            ['label' => 'ID', 'field' => 'id'],
            ['label' => 'Nombre', 'field' => 'name'],
            ['label' => 'Activo', 'field' => 'active'],
        ];

        $data = $tipoServicios->map(function ($tipoServicio) {
            return [
                'id' => $tipoServicio->id,
                'name' => $tipoServicio->name,
                'active' => (bool) $tipoServicio->active,
            ];
        });

        return Inertia::render('tipo-servicios/TipoServicios', [
            'columns' => $columns,
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'active' => 'required|boolean',
        ]);

        TipoServicio::create($validated);

        return redirect()->route('tipo-servicios.index')
            ->with('success', 'Tipo de servicio creado correctamente.');
    }

    public function update(Request $request, TipoServicio $tipoServicio)
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'active' => 'required|boolean',
        ]);

        $tipoServicio->update($validated);

        return redirect()->route('tipo-servicios.index')
            ->with('success', 'Tipo de servicio actualizado correctamente.');
    }

    public function destroy(TipoServicio $tipoServicio)
    {
        $tipoServicio->delete();

        return redirect()->route('tipo-servicios.index')
            ->with('success', 'Tipo de servicio eliminado correctamente.');
    }

    public function toggleActive(TipoServicio $tipoServicio)
    {
        $tipoServicio->update([
            'active' => !$tipoServicio->active
        ]);

        return redirect()->route('tipo-servicios.index')
            ->with('success', 'Estado cambiado correctamente.');
    }
}
