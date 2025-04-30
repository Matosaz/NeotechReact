import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import "./ResetPassword.css";

const ResetPassword = ({ open, handleClose }) => {
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

  const handleCloseAndReset = () => {
    resetForm();
    handleClose();
  };

  const handleBackdropClick = (event) => {
    // Impede o fechamento ao clicar fora do modal
    event.stopPropagation();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return setMessage("E-mail inválido.");

    setMessage("");
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
        setMessage("Código enviado para o seu e-mail.");
      } else {
        setMessage("Erro ao enviar o código.");
      }
    } catch {
      setMessage("Erro ao solicitar recuperação de senha.");
    }

    setLoading(false);
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) return setMessage("A senha deve conter pelo menos 6 caracteres.");

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://intellij-neotech.onrender.com/api/v1/users/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Senha redefinida com sucesso.");
        setTimeout(() => {
          handleCloseAndReset();
        }, 2000);
      } else {
        setMessage("Código inválido ou expirado.");
      }
    } catch {
      setMessage("Erro ao redefinir a senha.");
    }

    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      aria-labelledby="reset-password-modal"
    >
      <Box
        className="reset-password-modal"
        sx={{ padding: "2rem", position: "relative" }}
        onClick={handleBackdropClick}
      >
        {/* Botão de fechar */}
        <IconButton
          onClick={handleCloseAndReset}
          sx={{ position: "absolute", top: 10, right: 10, color: "#444" }}
        >
          <X size={22} />
        </IconButton>

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
              sx={{ borderRadius: "8px", backgroundColor: "#5faa84", padding: "0.75rem" }}
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
      </Box>
    </Modal>
  );
};

export default ResetPassword;
