import React from 'react';
import GenericTable from '../GenericTable/index.jsx';

const adminColumns = [
  { label: 'Código Admin', accessor: 'codAdmin' },
  { label: 'Email', accessor: 'email' },
  { label: 'Senha', accessor: 'senha' },
];

function AdminTable({ admins, onDeleteAdmin, onEditClick }) {
  return (
    <GenericTable 
      data={admins} 
      columns={adminColumns} 
      onDelete={onDeleteAdmin} 
      onEditClick={onEditClick} 
    />
  );
}

export default AdminTable;
