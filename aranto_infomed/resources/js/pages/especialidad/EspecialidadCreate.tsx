import React, { useState } from 'react';


const EspecialidadCreate = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');


const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // enviar formulario a servidor
};

  return (
    <div>
      <h1>Crear especialidad</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label>
          Descripción:
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </label>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default EspecialidadCreate;