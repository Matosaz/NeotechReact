import React from 'react';
import GenericTable from '../GenericTable/index.jsx';

const userColumns = [
  { label: 'Id', accessor: 'id' },
  { label: 'Email', accessor: 'email' },
  { label: 'Senha', accessor: 'senha' },
];

function UserTable({ users, onDeleteUser, onEditClick }) {
  return (
    <GenericTable 
      data={users} 
      columns={userColumns} 
      onDelete={onDeleteUser} 
      onEditClick={onEditClick} 
    />
  );
}

export default UserTable;
