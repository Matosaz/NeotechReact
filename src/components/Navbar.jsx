import React, { useState } from 'react';
import './Navbar.css';
import setting from '../assets/setting.png';
import profile from '../assets/profile.png';
import help from '../assets/help.png';
import logout from '../assets/logout.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function Exibirmenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.style.display = 'flex';
  }

  function Fecharmenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.style.display = 'none';
  }

  return (
    <header className="header">
  
      <a href='#' className='logo'> NeoTech</a>
      <nav className ="navbar">
        <div className="sidebar"> 
          <a  onClick={Fecharmenu}>
            <svg className='Fechar' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#121212">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </a>
          <a href='/mapa'>Ponto de coleta</a>
          <a href='#Serviço'>Saiba mais</a>
          <a href='#Timeline'>Serviços</a>
          <a href='#Orçamento'>Orçamento</a>
          <a href='#'>Contato</a>
        </div>
        <a className="FecharMenu" href='/mapa'>Ponto de coleta</a>
        <a className="FecharMenu" href='#Serviço'>Saiba mais</a>
        <a className="FecharMenu" href='#Timeline'>Serviços</a>
        <a className="FecharMenu" href='#Orçamento'>Orçamento</a>
        <a className="FecharMenu" href='#Footer'>Contato</a>
        <a className="FecharMenu" onClick={toggleMenu}> 
          Perfil
          <div className={`sub-menu-wrap ${menuOpen ? 'open-menu' : ''}`}>
            <div className="sub-menu"> 
              <div className="user-info">
                <h2> Fernando Luís</h2>
              </div>
              <hr/>
              <a href="/Dashboard" className="sub-menu-link">
                <img src={profile} />
                <p> Gerenciamento de usuários</p>
              </a>
              <a href="#" className="sub-menu-link">
                <img src={setting} />
                <p> Configurações e privacidade</p>
              </a>
              <a href="#" className="sub-menu-link">
                <img src={help} />
                <p> Ajuda e suporte</p>
              </a>
              <a href="/Auth" className="sub-menu-link">
                <img src={logout} />
                <p> Sair do perfil</p>
              </a>
            </div>
          </div>
        </a>
        <a className="botaomenu"  onClick={Exibirmenu}>
          <svg className='Menu' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
          </svg>
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
