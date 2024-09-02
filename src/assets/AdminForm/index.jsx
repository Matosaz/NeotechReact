import React, { useState } from 'react';
import GenericForm from '../GenericForm/index.jsx';

const adminFields = [
  { name: 'codAdmin', label: 'Código Admin', type: 'text', placeholder: 'Digite o código do admin' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Digite o email' },
  { name: 'senha', label: 'Senha', type: 'password', placeholder: 'Digite a senha' },
];

function AdminForm({ onAddAdmin, onUpdateAdmin, editingAdmin }) {
  const handleSubmit = (adminData) => {
    if (editingAdmin) {
      onUpdateAdmin(adminData);
    } else {
      onAddAdmin(adminData);
    }
  };

  return (
    <GenericForm 
      fields={adminFields} 
      onSubmit={handleSubmit} 
      editingData={editingAdmin} 
    />
  );
}

export default AdminForm;
