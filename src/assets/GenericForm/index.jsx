import './styles.css';
import React, { useState, useEffect } from 'react';

function GenericForm({ fields, onSubmit, editingData }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
    } else {
      // Inicializando campos vazios com base nos campos fornecidos
      const initialData = {};
      fields.forEach(field => initialData[field.name] = '');
      setFormData(initialData);
    }
  }, [editingData, fields]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Resetando os campos
    const resetData = {};
    fields.forEach(field => resetData[field.name] = '');
    setFormData(resetData);
  };

  return (
    <form className='generic-form' onSubmit={handleSubmit}>

      {fields.map(field => (
        <label className='generic-label' key={field.name}>
          {field.label}:
          <input className='generic-input' type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleChange} placeholder={field.placeholder} required />
        </label>
      ))}

      <button className='generic-button' type="submit">{editingData ? 'Atualizar' : 'Adicionar'}</button>
    </form>
  );
}

export default GenericForm;
