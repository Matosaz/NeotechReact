import React, { useState, useContext } from 'react';
import './Auth.css';
import { UserContext } from '../../UserContext';
import LogoNeotech2 from './Logo7.svg';
import { useNavigate } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') validatePassword(value);
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

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

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

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      setSnackbar({ open: true, message: 'As senhas não coincidem.', severity: 'warning' });
      setLoading(false);
      return;
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
      ...(isLoginMode ? {} : { nome: formData.name }),
    };

    try {
      const url = isLoginMode ? `${API_BASE_URL}/login` : API_BASE_URL;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(isLoginMode ? 'Erro no login' : 'Erro no cadastro');

      const data = await response.json();

      if (isLoginMode) {
        const userId = parseInt(data.id, 10);
        localStorage.setItem('token', data.token);

        const userData = await fetchUserDetails(userId);

        if (userData) {
          userData.isAdmin = data.isAdmin === 'true';
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }

        setSnackbar({ open: true, message: data.message, severity: 'success' });
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
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || (emailExists && !isLoginMode)}
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
          sx={{ width: '100%',      borderRadius: '8px',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default Auth;
