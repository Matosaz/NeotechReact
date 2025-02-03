import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SidebarManagement.css";  
import AddUSer from './adicionar-usuario.png';
import Graph from './grafico-simples.png';
import Dasboard from './Dashboard.png';
import Seta from './seta-pequena-esquerda.png'

const SidebarManagement = () => {
  const location = useLocation(); 

  const getActiveIcon = (iconName) => {
    if (iconName === 'dashboard' && location.pathname === '/Dashboard') return true;
    if (iconName === 'graph' && location.pathname === '/Graph') return true;
    if (iconName === 'addUser' && location.pathname === '/Management') return true;
    return false;
  };

  return (
    
    <div className="sidebarManagement">
       <div
        className='icon-Seta'
      >
        <Link to="/#">
          <img src={Seta} alt="Voltar" />
        </Link>
      </div>

      <div
        className={`icon-wrapperManagement ${getActiveIcon('dashboard') ? 'active' : ''}`}
      >
        <Link to="/Dashboard">
          <img src={Dasboard} alt="Dashboard icon" />
        </Link>
      </div>

      <div
        className={`icon-wrapperManagement ${getActiveIcon('graph') ? 'active' : ''}`}
      >
        <Link to="/Graph">
          <img src={Graph} alt="Gráfico" />
        </Link>
      </div>

      <div
        className={`icon-wrapperManagement ${getActiveIcon('addUser') ? 'active' : ''}`}
      >
        <Link to="/UserManagement">
          <img src={AddUSer} alt="Adicionar Usuário" />
        </Link>
      </div>
    </div>
  );
};

export default SidebarManagement;
