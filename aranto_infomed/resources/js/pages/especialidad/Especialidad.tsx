import React from 'react';
import { Link } from 'react-router-dom';

const Especialidad = () => {
  return (
    <div>
      <h1>Especialidad</h1>
      <Link to="/especialidades/create">Crear especialidad</Link>
      <ul>
        {/* lista de especialidades */}
      </ul>
    </div>
  );
};

export default Especialidad;