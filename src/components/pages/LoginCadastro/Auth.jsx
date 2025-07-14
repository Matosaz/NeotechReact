import React, { useState, useContext, useEffect } from 'react';
import './Auth.css';
import { UserContext } from '../../UserContext';
import LogoNeotech2 from './Logo7.svg';
import { useNavigate } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
/*
 * Para underline vermelha em validação, adicione uma classe condicional na <span className="underline"> 
 * e defina o CSS para .underline.error { background: red; }.
 * Exemplo de uso abaixo:
 */

// Exemplo de função para determinar erro de cada campo:

const API_BASE_URL = "https://intellij-neotech.onrender.com/api/v1/users";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const [openModal, setOpenModal] = useState(false);
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });


  const getBrasiliaDateTime = () => {
    const now = new Date();
    // Ajusta para UTC-3 (Brasília) e formata como ISO string
    const offset = -3 * 60 * 60 * 1000; // UTC-3 em milissegundos
    const brasiliaTime = new Date(now.getTime() + offset);
    return brasiliaTime.toISOString();
  };
  // Verificar se a sessão expirou (parâmetro na URL)
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const expired = queryParams.get('expired');

    if (expired === 'true') {
      setSnackbar({
        open: true,
        message: 'Sua sessão expirou. Por favor, faça login novamente.',
        severity: 'warning'
      });

      // Limpar o parâmetro da URL
      navigate('/Auth', { replace: true });
    }
  }, [navigate]);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setEmailExists(false);
  };
  if (typeof window === 'undefined') {
    return null; // Ou um loading state para SSR
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') validatePassword(value);
  };


  useEffect(() => {
    if (!formData.password) {
      setIsTypingPassword(false);
      setShowPasswordInfo(false);
    }
  }, [formData.password]);

  // ...existin
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      validatePassword(value);
      setIsTypingPassword(true);
      // Tooltip permanece visível enquanto houver caracteres
      setShowPasswordInfo(value.length > 0);
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


  const getUnderlineClass = (field) => {
    if (field === 'name') {
      return !isLoginMode && formData.name && formData.name.trim().length < 3 ? 'underline error' : 'underline';
    }
    if (field === 'email') {
      return !isLoginMode && emailExists ? 'underline error' : 'underline';
    }
    if (field === 'password') {
      return (
        !isLoginMode &&
        isTypingPassword &&
        (
          !passwordValidations.length ||
          !passwordValidations.lowercase ||
          !passwordValidations.uppercase ||
          !passwordValidations.number ||
          !passwordValidations.specialChar
        )
      ) ? 'underline error' : 'underline';
    }
    if (field === 'confirmPassword') {
      return (
        !isLoginMode &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) ? 'underline error' : 'underline';
    }
    return 'underline';
  };
  const fetchUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Não tratar erro 401 aqui, pois estamos no processo de login

      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes do usuário');
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao carregar detalhes do usuário:", error);
      return null;
    }
  };

  const checkEmailExists = async (email) => {
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE_URL}/check-email?email=${email}`);
      setEmailExists(response.status === 409);

    } catch (error) {
      console.error("Erro ao verificar e-mail:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    if (!isLoginMode) {
    // Validação senha
    if (
      !passwordValidations.length ||
      !passwordValidations.lowercase ||
      !passwordValidations.uppercase ||
      !passwordValidations.number ||
      !passwordValidations.specialChar
    ) {
      setSnackbar({
        open: true,
        message: 'A senha não atende aos requisitos mínimos.',
        severity: 'warning',
      });
      setLoading(false);
      return;
    }
  }
    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      setSnackbar({ open: true, message: 'As senhas não coincidem.', severity: 'warning' });
      setLoading(false);
      return;
    } else {
      setErrors(prev => ({ ...prev, name: false }));
    }

    const nameRegex =/^[A-Za-zÀ-ÿ\s'-]+$/;
    if (!isLoginMode && formData.name.trim().length < 3 || !nameRegex.test(formData.name.trim()) ) {
      setSnackbar({
        open: true,
        message: 'O nome deve ter pelo menos 3 letras e conter APENAS letras.',
        severity: 'warning'
      });
      setLoading(false);
      return;
    } else {
      setErrors(prev => ({ ...prev, name: false }));
    }
    if (!isLoginMode) {
      await checkEmailExists(formData.email);
      if (emailExists) {
        setSnackbar({
          open: true,
          message: 'E-mail já cadastrado! Por favor, utilize outro!',
          severity: 'warning'
        });
        setLoading(false);
        return;
      }
    }

    const payload = {
      email: formData.email,
      senha: formData.password,
      ...(isLoginMode ? {} : {
        nome: formData.name, dataCriacao: getBrasiliaDateTime() // Adiciona a data atual automaticamente
      }),
    };

    try {
      const url = isLoginMode ? `${API_BASE_URL}/login` : API_BASE_URL;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(getBrasiliaDateTime());
      // Tratamento específico para erro 401 (Unauthorized)
      if (response.status === 401) {
        throw new Error('Credenciais inválidas. Verifique seu email e senha.');
      }

      if (!response.ok) throw new Error(isLoginMode ? 'Erro no login' : 'Erro no cadastro');

      const data = await response.json();

      if (isLoginMode) {
        const userId = parseInt(data.id, 10);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', userId); // Salvar o ID do usuário para referência

        const userData = await fetchUserDetails(userId);
        //Envio e armazenamento do valor de admin corrigido
        if (userData) {
          userData.admin = data.isAdmin === 'true';
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }

        setSnackbar({ open: true, message: 'Login realizado com sucesso!', severity: 'success' });
        setTimeout(() => navigate('/#'), 1000);
      } else {
        setSnackbar({ open: true, message: 'Cadastro realizado com sucesso!', severity: 'success' });
        setTimeout(toggleMode, 1000);
      }

    } catch (error) {
      setSnackbar({ open: true, message: `Erro: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (

    <div className="auth-container">
      <div className="auth-box">
        <img className="LogoNeotech2" src={LogoNeotech2} alt="Logo da Neotech" />
        <h2 className="boasvindas">{isLoginMode ? 'Que bom que você retornou!' : ''}</h2>
        <h2 className="Criarconta">{isLoginMode ? '' : 'Crie uma conta'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
          <div className="input-container tooltip-container">
              <input
                type="text"
                name="name"
                title="O nome deve conter apenas letras e espaços"
                value={formData.name}
                onChange={handleChange}
                required
                className={errors.name ? 'error' : ''}

              />
              <label className="label">Nome</label>

              <span className={getUnderlineClass('name')}></span>
              {!isLoginMode && formData.name && formData.name.trim().length >= 0 && formData.name.trim().length < 3 && (
                <div className="tooltip" style={{ color: '#e53935', marginTop: '5px' }}>
                  O nome deve possuir no mínimo 3 letras.
                </div>
              )}
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
                              className={errors.name ? 'error' : ''}

            />
            <label className="label">Email</label>
            <span className="underline"></span>
          </div>

          <div className="input-container tooltip-container">

            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
              required
              onFocus={() => {
                setShowPasswordInfo(formData.password.length >= 0);
                setIsTypingPassword(true);
              }}
              onBlur={() => {
                setIsTypingPassword(false);
                setShowPasswordInfo(formData.password.length > 0);
              }}
            />
            <IconButton sx={{
              position: 'absolute',
              top: '20%',
              right: '12px',
              zIndex: 1,
              color: '#555',

            }}
              onClick={toggleShowPassword}
              className="toggle-password-btn"
              edge="end"
              size="small"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
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
          <button
            type="submit"
            className="submit-btn"
            disabled={
              loading ||
              (
                !isLoginMode &&
                (
                  (isTypingPassword && (
                    !passwordValidations.length ||
                    !passwordValidations.lowercase ||
                    !passwordValidations.uppercase ||
                    !passwordValidations.number ||
                    !passwordValidations.specialChar
                  ))
                )
              )
            }
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : (isLoginMode ? 'Login' : 'Cadastrar')}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%', borderRadius: '8px',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default Auth;
