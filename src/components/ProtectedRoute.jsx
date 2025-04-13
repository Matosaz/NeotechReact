import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext); // Acessa o contexto do usuário

  // Verifique se o usuário está autenticado e se é um administrador
  if (!user || user.isAdmin!== true) {
    // Redireciona para a página de login ou qualquer outra página
    return <Navigate to="/NoPermission" />;
  }

  return children; // Se for admin, exibe a página protegida
};

export default ProtectedRoute;
