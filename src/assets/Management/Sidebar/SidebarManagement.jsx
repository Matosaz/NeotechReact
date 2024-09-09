import React from "react";
import "./SidebarManagement.css";  // Importando o arquivo CSS
import AddUSer from './adicionar-usuario.png'
import Graph from './grafico-simples.png'
import Dasboard from './Dashboard.png'


const SidebarManagement = () => {
  return (
    <div className="sidebarManagement">
      <div className="icon-wrapperManagement">
        <a href="">
        <img src={Dasboard} alt="Dashboard icon" />
        </a>
      </div>

      <div className="icon-wrapperManagement">
        <a href=" ">
        <img src={Graph} alt="Gráfico" />
        </a>
      </div>

      <div className="icon-wrapperManagement">
        <img src={AddUSer} alt="Adicionar Usuário" />
      </div>
     
     
      
    </div>
  );
};

export default SidebarManagement;
