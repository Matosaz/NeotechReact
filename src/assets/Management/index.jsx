import './styles.css';
import React, { useState } from 'react';
import AdminTable from '../../assets/AdminTable/index.jsx';  // Tabela de Admin
import AdminForm from '../../assets/AdminForm/index.jsx';    // Formulário de Admin
import UserTable from '../../assets/UserTable/index.jsx';    // Tabela de User
import UserForm from '../../assets/UserForm/index.jsx';      // Formulário de User
import flor from "../Flor.png";

function Management() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [view, setView] = useState('admin'); // Controle da visão atual (admin ou user)

  // Funções de adicionar, atualizar e excluir para Admin
  const handleAddAdmin = (newAdmin) => {
    setAdmins([...admins, newAdmin]);
  };

  const handleUpdateAdmin = (updatedAdmin) => {
    setAdmins(
      admins.map(admin => admin.codAdmin === updatedAdmin.codAdmin ? updatedAdmin : admin)
    );
    setEditingAdmin(null);  // Limpa o admin em edição
  };

  const handleDeleteAdmin = (codAdmin) => {
    setAdmins(admins.filter(admin => admin.codAdmin !== codAdmin));
  };

  // Funções de adicionar, atualizar e excluir para User
  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(
      users.map(user => user.codUser === updatedUser.codUser ? updatedUser : user)
    );
    setEditingUser(null);  // Limpa o user em edição
  };

  const handleDeleteUser = (codUser) => {
    setUsers(users.filter(user => user.codUser !== codUser));
  };

  const handleClick = (newView) => {
    setView(newView); // Atualiza o estado para o botão clicado
  };

  const Voltarmanagement = () => {
    window.history.back();
  };

  return (
    <div className="management-container">
      <main className='contentadmin custom-contentadmin'>
        <button onClick={Voltarmanagement} className='voltarmanagement'> Retornar</button>
        <h1 className='management__title'>Gerenciamento</h1>

        <div className='management__boxview'>
          <button
            className={`management__boxview-button ${view === 'admin' ? 'active' : ''}`}
            onClick={() => handleClick('admin')}
          >
            Gerenciar Admins
          </button>
          <button
            className={`management__boxview-button ${view === 'user' ? 'active' : ''}`}
            onClick={() => handleClick('user')}
          >
            Gerenciar Usuários
          </button>
        </div>

        {view === 'admin' ? (
          <>
            <h2>Administradores</h2>
            <AdminForm 
              onAddAdmin={handleAddAdmin} 
              onUpdateAdmin={handleUpdateAdmin} 
              editingAdmin={editingAdmin} 
            />
            <AdminTable 
              admins={admins} 
              onDeleteAdmin={handleDeleteAdmin} 
              onEditClick={(admin) => setEditingAdmin(admin)} 
            />
          </>
        ) : (
          <>
            <h2>Usuários</h2>
            <UserForm 
              onAddUser={handleAddUser} 
              onUpdateUser={handleUpdateUser} 
              editingUser={editingUser} 
            />
            <UserTable 
              users={users} 
              onDeleteUser={handleDeleteUser} 
              onEditClick={(user) => setEditingUser(user)} 
            />
          </>
        )}
      </main>
      <footer className='footer'>
      </footer>
    </div>
  );
}

export default Management;
