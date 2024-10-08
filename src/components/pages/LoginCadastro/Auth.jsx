import React, { useState } from 'react';
import './Auth.css';
import LoginVideo from './LoginBackground.mp4';
import LogoNeotech2 from './LogoLogin.png';
import { Link, useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate(); // Hook de navegação

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      alert('Senhas incondizentes!');
      return;
    }

    alert(isLoginMode ? 'Acesso bem sucedido!' : 'Cadastrado bem sucedido!');
    
    // Redireciona para a tela inicial após o sucesso
    navigate('/#'); // ou a rota que você definir para a página inicial
  };

  return (
    <div className="auth-container">
      <video autoPlay loop playsInline className="VideoBackground" src={LoginVideo}></video>
      <div className="auth-box">
        <img className="LogoNeotech2" src={LogoNeotech2} alt="Logo da Neotech" />
        <h2 className='boasvindas'>{isLoginMode ? 'Bem vindo de volta!' : 'Bem vindo!'}</h2>
        
        <h2>{isLoginMode ? 'Login' : 'Cadastrar'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="input-container">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome"
                required={!isLoginMode}
              />
            </div>
          )}
          <div className="input-container">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Senha"
              required
            />
          </div>
          {!isLoginMode && (
            <div className="input-container">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar senha"
                required={!isLoginMode}
              />
            </div>
          )}
          <button type="submit" className="submit-btn">
            {isLoginMode ? 'Login' : 'Cadastrar'}
          </button>
        </form>
        <p className="toggle-mode">
          {isLoginMode ? 'Não possui uma conta?' : 'Já possui uma conta?'}
          <button type="button" onClick={toggleMode}>
            {isLoginMode ? 'Cadastrar' : 'Login'}
          </button>
        </p>
        <p className="direitos">
          Todos os direitos reservados <br />
          <span> © Neotech 2024</span> 
        </p>
      </div>
    </div>
  );
};

export default Auth;
