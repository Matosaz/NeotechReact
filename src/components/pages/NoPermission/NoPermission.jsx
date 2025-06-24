import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import './NoPermission.css';

const NoPermission = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.admin === true) {
      navigate('/UserManagement'); // ajuste para a página que o admin pode acessar
    }
  }, [user, navigate]);

  const handleRedirect = () => {
    navigate('/Auth');
  };

  return (
    <div className="no-permission-container">
      <div className="no-permission-box">
        <h1>Você não possui permissão para acessar esta área.</h1>
        <p>Por favor, entre com uma conta com privilégios de administrador ou entre em contato com o suporte.</p>
        <button className="redirect-btn" onClick={handleRedirect}>
          Ir para o Login
        </button>
      </div>
    </div>
  );
};

export default NoPermission;
