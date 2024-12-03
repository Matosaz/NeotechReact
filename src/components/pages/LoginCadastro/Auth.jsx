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
  const navigate = useNavigate();

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
    navigate('/#'); // Redireciona para a página inicial
  };

  return (
    <div className="auth-container">
      <video autoPlay loop playsInline className="VideoBackground" src={LoginVideo}></video>
      <div className="auth-box">
        <img className="LogoNeotech2" src={LogoNeotech2} alt="Logo da Neotech" />
        <h2 className='boasvindas'>{isLoginMode ? 'Que bom que você retornou!' : ''}</h2>
        <h2 className="Criarconta">{isLoginMode ? '' : 'Crie uma conta'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="input-container">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLoginMode}
              />
              <label className="label">Nome</label>
              <span className="underline"></span>
            </div>
          )}
          <div className="input-container">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label className="label">Email</label>
            <span className="underline"></span>
          </div>
          <div className="input-container">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label className="label">Senha</label>
            <span className="underline"></span>
          </div>
          {!isLoginMode && (
            <div className="input-container">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLoginMode}
              />
              <label className="label">Confirmar senha</label>
              <span className="underline"></span>
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
          <span>© Neotech 2024</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
