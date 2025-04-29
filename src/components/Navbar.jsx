import React, { useState, useContext, useEffect } from 'react';
import './Navbar.css';
import { UserContext } from './UserContext'; // Contexto de autenticação
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext); // Consome o contexto
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -35,    // Desliza para cima de forma sutil
      scale: 0.75, // Leve redução de escala para sugerir que está "fechando"
      transition: {
        duration: 0.25,   // Tempo rápido de animação
        ease: [0.20, 1, 0.36, 1], // easeOutExpo
        delay: 0.09
      },
    },
    visible: {
      opacity: 1,
      y: 0,      // Retorna para o centro
      scale: 1,   // Escala natural
      transition: {
        ease: [0.25, 1.2, 0.36, 1.2], // easeOutExpo
        duration: 0.25,   // Rapidez na entrada
        delay: 0.05
      },
    },
  };
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
          <a href="#Orçamento">Agendamento</a>
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
        <a className="FecharMenu" href="#Orçamento">Agendamento</a>
        <a className="FecharMenu" href="#Footer">Contato</a>


        {user ? ( // Se o usuário estiver logado, exibe o menu de Perfil
          <a className="FecharMenu" onClick={toggleMenu}>
            Perfil
            <AnimatePresence mode="wait">
              {menuOpen && (
                <motion.div
                  className="sub-menu-wrap"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                >
                {/* Alteração de dependência */}
                  <div className="sub-menu">
                    <div className="user-info">
                      <h2>{user?.nome || 'Usuário'}</h2>
                    </div>
                    <hr />
                    {user?.isAdmin && (
                      <a href="/Dashboard" className="sub-menu-link">
                        <AdminPanelSettingsIcon sx={{ color: '#121212' }}/>
                        <p>Área Administrativa</p>
                      </a>
                    )}
                    <a href="/ConfigPerfil" className="sub-menu-link">
                      <AccountCircleIcon sx={{ color: '#121212' }}/>
                      <p>Configurações de perfil</p>
                    </a>
                    <a href="#" className="sub-menu-link">
                      <HelpOutlineIcon sx={{ color: '#121212' }}/>
                      <p>Ajuda e suporte</p>
                    </a>
                    <a href="#" className="sub-menu-link" onClick={logout}>
                      <ExitToAppIcon sx={{ color: '#121212' }}/>
                      <p>Sair da conta</p>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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