import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NoPermission.css'; // Para estilos personalizados

const NoPermission = () => {
  const navigate = useNavigate();

  // Função para redirecionar o usuário para a página de login
  const handleRedirect = () => {
    navigate('/Auth');
  };

  return (
    <div className="no-permission-container">
      <div className="no-permission-box">
        <h1>Você não tem permissão para acessar esta área.</h1>
        <p>Por favor, entre com uma conta com privilégios de administrador ou entre em contato com o suporte.</p>
        <button className="redirect-btn" onClick={handleRedirect}>
          Ir para o Login
        </button>
      </div>
    </div>
  );
};

export default NoPermission;
