import React, { useState, useContext } from 'react';
import './Auth.css';
import { UserContext } from '../../UserContext';
import LogoNeotech2 from './Logo7.svg';
import { useNavigate } from 'react-router-dom';
import ResetPassword from './ResetPassword';


const API_BASE_URL = "https://intellij-neotech.onrender.com/api/v1/users";


const Auth = () => {
  const { setUser } = useContext(UserContext); // Acessa o contexto
  const [openModal, setOpenModal] = useState(false); // Estado para o modal
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
      const response = await fetch(`${API_BASE_URL}/check-email?email=${formData.email}`);
      const data = await response.json();

      if (data.exists ) {
        setEmailExists(true);
      } else {
        setEmailExists(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setEmailExists(true);
        alert("E-mail já cadastrado! Por favor, use outro.");
      } else {
        console.error("Erro ao verificar e-mail:", error);
      }
    }
  };const fetchUserDetails = async (userId) => {
    try {
      console.log("Buscando detalhes do usuário para ID:", userId);
  
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user')}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes do usuário');
      }
  
      const userData = await response.json();
      console.log("Dados completos do usuário recebidos:", userData);
  
      return userData;  // 🔹 Agora a função retorna os dados completos
    } catch (error) {
      console.error("Erro ao carregar detalhes do usuário:", error);
      return null;
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
      alert("E-mail já cadastrado! Por favor, utilize outro!"); // Se já existir, exibe um alerta e impede o cadastro
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
      const url = isLoginMode ? `${API_BASE_URL}/login` : API_BASE_URL;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(isLoginMode ? 'Erro no login' : 'Erro no cadastro.');
      }

      const data = await response.json();

      // Login// Login
if (isLoginMode) {
  const isAdminBoolean = data.isAdmin === 'true';
  const userId = parseInt(data.id, 10);

  localStorage.setItem('token', data.token);

  // Buscar detalhes completos do usuário antes de salvar no contexto/localStorage
  const userData = await fetchUserDetails(userId);

  if (userData) {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

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
          {isLoginMode && (
            <p className="Forgotpassword" onClick={() => setOpenModal(true)}>
              Esqueceu a senha?
            </p>)}
          {!isLoginMode && (
            <div className="input-container">
              <input
                className='confirmpasswordinput'
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
          <span className="span-direitos">© Neotech 2025</span>
        </p>
      </div>
      <ResetPassword open={openModal} handleClose={() => setOpenModal(false)} />

    </div>
  );
};

export default Auth;
