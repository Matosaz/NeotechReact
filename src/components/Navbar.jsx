import React, { useState, useContext, useEffect } from 'react';
import './Navbar.css';
import { UserContext } from './UserContext'; // Contexto de autenticação
import setting from '../assets/setting.png';
import profile from '../assets/profile.png';
import help from '../assets/help.png';
import logoutpng from '../assets/logout.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext); // Consome o contexto

  useEffect(() => {
    console.log("User atualizado:", user);
  }, [user]);

  // Alterna a exibição do menu
  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  // Logout do usuário
  function logout() {
    localStorage.removeItem('user');
    setUser(null); // Limpa o usuário no contexto
  }

  // Função para exibir a sidebar
  function Exibirmenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.style.display = 'flex';
  }

  // Função para fechar a sidebar
  function Fecharmenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.style.display = 'none';
  }

  return (
    <header className="header">
      <a href="#" className="logo">NeoTech</a>
      <nav className="navbar">
        <div className="sidebar">
          <a onClick={Fecharmenu}>
            <svg
              className="Fechar"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#121212"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </a>
          <a href="/mapa">Ponto de coleta</a>
          <a href="#Serviço">Saiba mais</a>
          <a href="#Timeline">Serviços</a>
          <a href="#Orçamento">Orçamento</a>
          <a href="#Footer">Contato</a>
          {user ? ( // Se o usuário estiver logado, exibe o menu de Perfil
          <> 
          <a href="/ConfigPerfil">Perfil</a>
          <a href="#"  onClick={logout}>Sair da conta</a>
          </>
        ) : ( // Se o usuário não estiver logado, exibe a opção de login
          <a  href="/Auth">
            Efetuar Login
          </a>
          
        )}
          
        </div>
        <Link to="/mapa" className="FecharMenu">Ponto de coleta</Link>
        <a className="FecharMenu" href="#Serviço">Saiba mais</a>
        <a className="FecharMenu" href="#Timeline">Serviços</a>
        <a className="FecharMenu" href="#Orçamento">Orçamento</a>
        <a className="FecharMenu" href="#Footer">Contato</a>


        {user ? ( // Se o usuário estiver logado, exibe o menu de Perfil
          <a className="FecharMenu" onClick={toggleMenu}>
            Perfil
            <div className={`sub-menu-wrap ${menuOpen ? 'open-menu' : ''}`}>
              <div className="sub-menu">
                <div className="user-info">
                  <h2>{user?.nome || 'Usuário'}</h2>
                </div>
                <hr />
                {user.isAdmin && ( // Exibe apenas se for administrador
               <a href="/Dashboard" className="sub-menu-link">
                 <img src={profile} alt="Gerenciamento de usuários" />
                 <p>Gerenciamento de usuários</p>
               </a>
               )}
                <a href="/ConfigPerfil" className="sub-menu-link">
                  <img src={profile} alt="Configuração de perfil" />
                  <p>Configurações de perfil</p>
                </a>
                <a href="#" className="sub-menu-link">
                  <img src={help} alt="Ajuda e suporte" />
                  <p>Ajuda e suporte</p>
                </a>
                <a href="#" className="sub-menu-link" onClick={logout}>
                  <img src={logoutpng} alt="Sair do perfil" />
                  <p>Sair da conta</p>
                </a>
              </div>
            </div>
          </a>
        ) : ( // Se o usuário não estiver logado, exibe a opção de login
          <a className="FecharMenu" href="/Auth">
            Login
          </a>
        )}
        <a className="botaomenu" onClick={Exibirmenu}>
          <svg
            className="Menu"
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#e8eaed"
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
