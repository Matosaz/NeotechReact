import React, { useState, useContext, useEffect } from 'react';
import './Navbar.css';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle,
  HelpOutline,
  ExitToApp,
  AdminPanelSettings,
  LocationOn,
  Info,
  Build,
  Schedule,
  ContactMail
} from '@mui/icons-material';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Ponto de coleta', href: '/mapa', icon: <LocationOn /> },
    { text: 'Saiba mais', href: '#Serviço', icon: <Info /> },
    { text: 'Serviços', href: '#Timeline', icon: <Build /> },
    { text: 'Agendamento', href: '#Orçamento', icon: <Schedule /> },
    { text: 'Contato', href: '#Footer', icon: <ContactMail /> }
  ];

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -35,
      scale: 0.75,
      transition: {
        duration: 0.25,
        ease: [0.20, 1, 0.36, 1],
        delay: 0.09
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        ease: [0.25, 1.2, 0.36, 1.2],
        duration: 0.25,
        delay: 0.05
      },
    },
  };

  useEffect(() => {
    console.log("User atualizado:", user);
  }, [user]);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function logout() {
    localStorage.removeItem('user');
    setUser(null);
  }

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  function Exibirmenu() {
    if (isMobile) {
      setMobileDrawerOpen(true);
    } else {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) sidebar.style.display = 'flex';
    }
  }

  function Fecharmenu() {
    if (isMobile) {
      setMobileDrawerOpen(false);
    } else {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) sidebar.style.display = 'none';
    }
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
          {user ? (
          <> 
          <a href="/ConfigPerfil">Perfil</a>
          <a href="#"  onClick={logout}>Sair da conta</a>
          </>
        ) : (
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

        {user ? (
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
                  <div className="sub-menu">
                    <div className="user-info">
                      <h2>{user?.nome || 'Usuário'}</h2>
                    </div>
                    <hr />
                    {user?.admin && (
                      <a href="/Dashboard" className="sub-menu-link">
                        <AdminPanelSettings sx={{ color: '#121212' }}/>
                        <p>Área Administrativa</p>
                      </a>
                    )}
                    <a href="/ConfigPerfil" className="sub-menu-link">
                      <AccountCircle sx={{ color: '#121212' }}/>
                      <p>Configurações de perfil</p>
                    </a>
                    <a href="/FAQ" className="sub-menu-link">
                      <HelpOutline sx={{ color: '#121212' }}/>
                      <p>Ajuda e suporte</p>
                    </a>
                    <a href="#" className="sub-menu-link" onClick={logout}>
                      <ExitToApp sx={{ color: '#121212' }}/>
                      <p>Sair da conta</p>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </a>
        ) : (
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
      
      {/* Mobile Drawer Minimalista */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer}
        PaperProps={{
          sx: {
            width: 260,
            background: '#fff',
            borderRadius: '12px 0 0 12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }
          }
        }}
      >
        <motion.div
          initial={{ x: 260 }}
          animate={{ x: 0 }}
          exit={{ x: 260 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E7D32', fontSize: '1.1rem' }}>
                  NeoTech
                </Typography>
                <IconButton 
                  onClick={toggleMobileDrawer}
                  size="small"
                  sx={{ 
                    color: '#666',
                    p: 1,
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            
            {/* Menu Items */}
            <Box sx={{ flex: 1, py: 1 }}>
              <List sx={{ px: 1 }}>
                {menuItems.map((item) => (
                  <ListItem 
                    key={item.text}
                    component={item.href.startsWith('#') ? 'a' : Link}
                    to={item.href.startsWith('#') ? undefined : item.href}
                    href={item.href.startsWith('#') ? item.href : undefined}
                    onClick={toggleMobileDrawer}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 1,
                      px: 1.5,
                      minHeight: 42,
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: '#f8f9fa'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: '#2E7D32',
                      minWidth: 32,
                      '& svg': { fontSize: 18 }
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      sx={{ 
                        '& .MuiTypography-root': { 
                          fontWeight: 500,
                          fontSize: '0.9rem',
                          color: '#333'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            
            {/* User Section */}
            <Box sx={{ borderTop: '1px solid #f0f0f0', p: 1.5 }}>
              {user ? (
                <>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    mb: 1.5,
                    p: 1,
                    borderRadius: 1.5,
                    backgroundColor: '#f8f9fa'
                  }}>
                    <Avatar sx={{ 
                      bgcolor: '#2E7D32', 
                      width: 28, 
                      height: 28, 
                      fontSize: '0.8rem' 
                    }}>
                      {user?.nome?.charAt(0) || 'U'}
                    </Avatar>
                    <Typography variant="body2" fontWeight={500} sx={{ color: '#333', fontSize: '0.85rem' }}>
                      {user?.nome || 'Usuário'}
                    </Typography>
                  </Box>
                  
                  <List sx={{ mb:0.8}}>
                    {user?.admin && (
                      <ListItem 
                        component={Link} 
                        to="/Dashboard" 
                        onClick={toggleMobileDrawer} 
                        sx={{ py: 0.5, pb:1, px: 1, minHeight: 36, borderRadius: 1, textDecoration:'none', color:'inherit', fontWeight:"bold", }}
                      >
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <AdminPanelSettings sx={{ fontSize: 24, color: '#2E7D32' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Admin" 
                          sx={{ '& .MuiTypography-root': { fontSize: '0.87rem' } }} 
                        />
                      </ListItem>
                    )}
                    
                    <ListItem 
                      component={Link} 
                      to="/ConfigPerfil" 
                      onClick={toggleMobileDrawer} 
                        sx={{ py: 0.5, pb:1, px: 1, minHeight: 36, borderRadius: 1, textDecoration:'none', color:'inherit', fontWeight:"bold", }}
                    >
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <AccountCircle sx={{ fontSize: 20, color: '#2E7D32' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Perfil" 
                        sx={{ '& .MuiTypography-root': { fontSize: '0.87rem' } }} 
                      />
                    </ListItem>
                    
                    <ListItem 
                      onClick={() => { logout(); toggleMobileDrawer(); }} 
                        sx={{ py: 0.5, px: 1, minHeight: 36, borderRadius: 1, textDecoration:'none', color:'inherit', fontWeight:"bold", }}
                    >
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <ExitToApp sx={{ fontSize: 20, color: '#f44336' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Sair" 
                        sx={{ '& .MuiTypography-root': { fontSize: '0.87rem', color: '#f44336' } }} 
                      />
                    </ListItem>
                  </List>
                </>
              ) : (
                <ListItem 
                  component={Link} 
                  to="/Auth" 
                  onClick={toggleMobileDrawer}
                  sx={{
                    borderRadius: 1.5,
                    py: 1.2,
                    background: '#2E7D32',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#1B5E20' }
                  }}
                >
                  <ListItemText 
                    primary="Fazer Login" 
                    sx={{ 
                      textAlign: 'center',
                      '& .MuiTypography-root': { fontWeight: 600, fontSize: '0.9rem' }
                    }}
                  />
                </ListItem>
              )}
            </Box>
          </Box>
        </motion.div>
      </Drawer>
    </header>
  );
};

export default Navbar;