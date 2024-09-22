import React, { useState } from 'react';
import Sidebar1 from '../Sidebar/SidebarManagement'; 
import './Dashboard.css'; 

function Dashboard() {
  const [users] = useState([
    {
      nome: 'Rodrigo Salomão',
      ativo: true,
      administrador: false,
      email: 'rodrigosalomao2001@gmail.com',
      senha: 'batatacomlimao'
    },
    
    
    
  ]);

  // Contagem de usuários
  const totalUsuarios = users.length;
  const usuariosAtivos = users.filter(user => user.ativo).length;

  return (
    <div className="dashboard-container">
      <Sidebar1 /> 

      <div className="dashboard-content">
        <h1>Dashboard de Usuários</h1>

        <div className="dashboard-info">
          <div className="info-card">
            <h2>Total de Usuários</h2>
            <p>{totalUsuarios}</p>
          </div>

          <div className="info-card">
            <h2>Usuários Ativos</h2>
            <p>{usuariosAtivos}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
