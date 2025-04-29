import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import "./ResetPassword.css";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ResetPassword = ({ open, handleClose }) => {

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const resetForm = () => {
    setEmail("");
    setCode("");
    setNewPassword("");
    setStep(1);
    setMessage("");
    setLoading(false);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };
  
  const handleCloseAndReset = () => {
    resetForm();
    handleClose();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      return setSnackbar({ open: true, message: 'Email inválido!', severity: 'error' }); // ou 'error'
      ;
    }

    setSnackbar("");
    setLoading(true);

    try {
      const response = await fetch("https://intellij-neotech.onrender.com/api/v1/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setStep(2);
        setSnackbar({ open: true, message: 'O código foi enviado para o seu email!', severity: 'success' }); // ou 'error'
      } else {
        setSnackbar({ open: true, message: 'Erro ao enviar o código', severity: 'error' }); // ou 'error'

      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao solicitar recuperação de senha.', severity: 'error' }); // ou 'error'

    }

    setLoading(false);
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      return setSnackbar({ open: true, message: 'A senha deve conter ao mínimo seis caracteres.', severity: 'warning' }); // ou 'error'


    }

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://intellij-neotech.onrender.com/api/v1/users/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();
      console.log(data); // Verifique o que está sendo retornado pela API

      if (data.success) {
        setSnackbar({ open: true, message: 'Senha redefinida com sucesso.', severity: 'error' }); // ou 'error'

        setTimeout(() => {
          handleCloseAndReset();
        }, 1000);
      } else {
        setSnackbar({ open: true, message: 'Código inválido ou experirado.', severity: 'warning' }); // ou 'error'

      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao redefinir a senha.', severity: 'error' }); // ou 'error'
    }

    setLoading(false);
  };

  return (

    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          handleCloseAndReset();
        }
      }}
    >      <Box className="reset-password-modal" sx={{ padding: "2rem", position: "relative" }}>
        <Button
          onClick={handleCloseAndReset}
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
            minWidth: "auto",
            padding: "4px 4px",
            color: "#444",
            transition: "color 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#e3e3e3",
            }
          }}
        >
          <CloseIcon />
        </Button>
        <Typography
          variant="h6"
          fontFamily="Lexend"
          component="h2"
          className="modal-title"
          sx={{ marginBottom: "0.5rem", fontWeight: "600" }}
        >
          Recuperação de Senha
        </Typography>

        <Typography
          variant="body2"
          fontFamily="Lexend"
          className="modal-description"
          sx={{ marginBottom: "1rem", textAlign: "center" }}
        >
          {step === 1
            ? "Insira seu e-mail para receber um link de redefinição de senha."
            : "Insira o código enviado e sua nova senha."}
        </Typography>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              placeholder="usuario@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="modal-input"
              sx={{
                marginBottom: "1.5rem",
                borderRadius: "10px",
                background: "#e3e3e3",
                "& .MuiInputLabel-root": {
                  color: "#3333339a",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#488042",
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fontFamily="Lexend"
              disabled={loading}
              className="modal-button"
              sx={{ borderRadius: "8px", backgroundColor: "#5faa84", padding: "0.75rem", textTransform:'none', fontWeight:'500' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar Código"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit}>
            <TextField
              fullWidth
              label="Código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="modal-input"
              sx={{
                marginBottom: "1rem",
                background: "#e3e3e3",
                "& .MuiInputLabel-root": {
                  color: "#3333339a",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#488042",
                },
              }}
            />
            <TextField
              fullWidth
              label="Nova Senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              type="password"
              className="modal-input"
              sx={{
                marginBottom: "1.5rem",
                background: "#e3e3e3",
                "& .MuiInputLabel-root": {
                  color: "#3333339a",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#488042",
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fontFamily="Lexend"
              disabled={loading}
              className="modal-button"
              sx={{ borderRadius: "8px", backgroundColor: "#5faa84", padding: "0.75rem" }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Redefinir Senha"}
            </Button>
          </form>
        )}

        {message && (
          <Typography
            fontFamily="Lexend"
            variant="body2"
            className="modal-message"
            sx={{
              marginTop: "0.5rem",
              color: message.toLowerCase().includes("sucesso") ? "green" : "red",
              fontSize: "1rem",
              textAlign: "center",
            }}
          >
            {message}
          </Typography>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            position: 'absolute',
            marginBottom: '-55px', // Distância da parte inferior da tela
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%', // Pode ajustar a largura para seu gosto
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: '8px' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default ResetPassword;
