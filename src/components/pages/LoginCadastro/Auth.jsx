import React, { useState, useContext } from 'react';
import './Auth.css';
import { UserContext } from '../../UserContext';
import LoginVideo from './LoginBackground.mp4';
import LogoNeotech2 from './LogoLogin.png';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { setUser } = useContext(UserContext); // Acessa o contexto
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
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();

  // Alterna entre login e cadastro
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setEmailExists(false); // Resetar o alerta ao mudar de modo
  };

  // Atualiza o estado dos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  // Função para validar a senha
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validando a senha a cada mudança
    if (name === 'password') {
      validatePassword(value);
    }
  };

  // Validação da senha
  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidations(validations);
  };

  const checkEmailExists = async () => {
    if (!formData.email) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/check-email?email=${formData.email}`);
      const data = await response.json();

      if (data.exists) {
        setEmailExists(true);
        window.alert("E-mail já cadastrado!"); // Alerta quando o e-mail já existe
      } else {
        setEmailExists(false);
      }
    } catch (error) {if (error.response && error.response.status === 409) {
      setEmailExists(true);
      alert("E-mail já cadastrado! Por favor, use outro.");
    } else {
      console.error("Erro ao verificar e-mail:", error);
    }
  }
};
  // Envia o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se as senhas coincidem
    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    if (!isLoginMode && emailExists) {
      alert("E-mail já cadastrado!"); // Se já existir, exibe um alerta e impede o cadastro
      return;
    }

    const payload = {
      email: formData.email,
      senha: formData.password,
    };

    if (!isLoginMode) {
      payload.nome = formData.name;  // Envia o nome no cadastro
    }

    try {
      const url = isLoginMode
        ? 'http://localhost:8080/api/v1/users/login'
        : 'http://localhost:8080/api/v1/users';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(isLoginMode ? 'Erro no login' : 'Erro no cadastro.');
      }

      const data = await response.json();

      // Login
      if (isLoginMode) {
        const isAdminBoolean = data.isAdmin === 'true';  // Converte "true" ou "false" em string para um booleano real
        const userId = parseInt(data.id, 10);  // Convertendo o id para número inteiro

        localStorage.setItem('token', data.token);
        setUser({ id: userId, nome: data.nome || 'Usuário', email: data.email,  isAdmin:isAdminBoolean }); // Corrigido para passar o nome
        localStorage.setItem('user', JSON.stringify({ id: userId, nome: data.nome, email: data.email, isAdmin: isAdminBoolean }));
        alert(data.message); // Mensagem do backend, mas sem dados pessoais
        navigate('/#');
      } else {
        alert('Cadastro realizado com sucesso!');
        toggleMode(); // Alterna para o modo de login
      }
    } catch (error) {
      alert(`Erro: ${error.message}`); // Exibe mensagem genérica de erro
    }
  };

  return (
    <div className="auth-container">
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
              onBlur={checkEmailExists} // Verifica o e-mail ao perder o foco
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
          <button type="submit" className="submit-btn" disabled={emailExists && !isLoginMode}>
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
