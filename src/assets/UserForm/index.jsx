import React, { useState } from 'react';
import GenericForm from '../GenericForm/index.jsx';

const userFields = [
  { name: 'id', label: 'ID', type: 'name', placeholder: 'Digite o ID do usuário' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Digite o email do usuário' },
  { name: 'senha', label: 'Senha', type: 'password', placeholder: 'Digite a senha' }
];

function UserForm({ onAddUser, onUpdateUser, editingUser }) {
  const handleSubmit = (userData) => {
    if (editingUser) {
      onUpdateUser(userData);
    } else {
      onAddUser(userData);
    }
  };

  return (
    <GenericForm 
      fields={userFields} 
      onSubmit={handleSubmit} 
      editingData={editingUser} 
    />
  );
}

export default UserForm;
