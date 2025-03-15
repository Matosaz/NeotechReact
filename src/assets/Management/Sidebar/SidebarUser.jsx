import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SidebarUser.css";  
import AddUSer from './adicionar-usuario.png';
import Graph from './grafico-simples.png';
import Dasboard from './Dashboard.png';
import Seta from './seta-pequena-esquerda.png'

const SidebarUser = () => {

  return (
    
    <div className="sidebarUser">
       <div
        className='icon-Seta'
      >
        <Link to="/#">
          <img src={Seta} alt="Voltar" />
        </Link>
      </div>
    </div>
  );
};

export default SidebarUser;
