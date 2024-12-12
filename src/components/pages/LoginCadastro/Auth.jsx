import React, { useState } from 'react';
import './Auth.css';
import LoginVideo from './LoginBackground.mp4';
import LogoNeotech2 from './LogoLogin.png';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validando a senha a cada mudança
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se não for no modo de login, verificamos as senhas
    if (!isLoginMode) {
      if (formData.password !== formData.confirmPassword) {
        alert('As senhas não coincidem.');
        return;
      }
    }

    const payload = {
      email: formData.email,
      senha: formData.password, // Garantir que o campo é enviado como 'senha'
    };

    // Se for cadastro, adicionamos o nome
    if (!isLoginMode) {
      payload.nome = formData.name; // Garantir que o campo 'nome' é passado corretamente
    }

    try {
      const url = isLoginMode ? 'http://localhost:8080/api/v1/users/login' : 'http://localhost:8080/api/v1/users';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(payload),
    
      });

      if (!response.ok) {
        throw new Error(isLoginMode ? 'Erro no login' : 'Erro no cadastro');
      }

      const data = await response.json();

      if (isLoginMode) {
        localStorage.setItem('token', data.token); // Salvar token no localStorage
        alert('Login bem-sucedido!');
        navigate('/#'); // Redirecionar após login
      } else {
        alert('Cadastro realizado com sucesso!');
        toggleMode(); // Alterna para o modo de login
      }
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="auth-container">
      <video autoPlay loop playsInline className="VideoBackground" src={LoginVideo}></video>
      <div className="auth-box">
        <img className="LogoNeotech2" src={LogoNeotech2} alt="Logo da Neotech" />
        <h2 className="boasvindas">{isLoginMode ? 'Que bom que você retornou!' : ''}</h2>
        <h2 className="Criarconta">{isLoginMode ? '' : 'Crie uma conta'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="input-container">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
          <div className="input-container tooltip-container">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
              required
              minLength={isLoginMode ? undefined : 8}
              pattern={isLoginMode ? undefined : "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"}
              onFocus={() => setShowPasswordInfo(true)}
              onBlur={() => setShowPasswordInfo(false)}
            />
            <label className="label">Senha</label>
            <span className="underline"></span>

            {/* Tooltip */}
            {showPasswordInfo && !isLoginMode && (
              <div className="tooltip">
                <p style={{ color: passwordValidations.length ? 'green' : 'red' }}>
                  {passwordValidations.length ? '✔' : '✖'} Pelo menos 8 caracteres
                </p>
                <p style={{ color: passwordValidations.lowercase ? 'green' : 'red' }}>
                  {passwordValidations.lowercase ? '✔' : '✖'} Contém uma letra minúscula
                </p>
                <p style={{ color: passwordValidations.uppercase ? 'green' : 'red' }}>
                  {passwordValidations.uppercase ? '✔' : '✖'} Contém uma letra maiúscula
                </p>
                <p style={{ color: passwordValidations.number ? 'green' : 'red' }}>
                  {passwordValidations.number ? '✔' : '✖'} Contém um número
                </p>
                <p style={{ color: passwordValidations.specialChar ? 'green' : 'red' }}>
                  {passwordValidations.specialChar ? '✔' : '✖'} Contém um caractere especial (@, #, $, etc.)
                </p>
              </div>
            )}
          </div>
          {!isLoginMode && (
            <div className="input-container">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
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
          <button type="button" className="trocar-btn" onClick={toggleMode}>
            {isLoginMode ? 'Cadastrar' : 'Login'}
          </button>
        </p>
        <p className="direitos">
          Todos os direitos reservados <br />
          <span className="span-direitos">© Neotech 2024</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
