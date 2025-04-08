import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import "./ResetPassword.css";

const ResetPassword = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(""); // Para armazenar o código recebido por e-mail
  const [newPassword, setNewPassword] = useState(""); // Para armazenar a nova senha
  const [step, setStep] = useState(1); // 1: Enviar e-mail, 2: Inserir código e redefinir senha
  const [message, setMessage] = useState("");

  // Enviar o e-mail com o link de redefinição
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("https://intellij-neotech-production.up.railway.app/api/v1/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setStep(2); // Mudar para a etapa de inserir o código
        setMessage("Código enviado para o seu e-mail.");
      } else {
        setMessage("Erro ao enviar o código.");
      }
    } catch (error) {
      setMessage("Erro ao solicitar recuperação de senha.");
    }
  };

  // Verificar o código e redefinir a senha
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("https://intellij-neotech-production.up.railway.app/api/v1/users/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Senha redefinida com sucesso.");
        handleClose();
      } else {
        setMessage("Código inválido ou expirado.");
      }
    } catch (error) {
      setMessage("Erro ao redefinir a senha.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="reset-password-modal" sx={{ padding: '2rem' }}>
        <Typography variant="h6"  fontFamily="Lexend" component="h2" className="modal-title" sx={{ marginBottom: '0.5rem', fontWeight: "600" }}>
          Recuperação de Senha
        </Typography>
        <Typography variant="body2" fontFamily="Lexend" className="modal-description" sx={{ marginBottom: '1rem', textAlign: "center" }}>
          {step === 1 ? "Insira seu e-mail para receber um link de redefinição de senha." : "Insira o código enviado e sua nova senha."}
        </Typography>

        {/* Etapa 1: Solicitação do E-mail */}
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
                marginBottom: '1.5rem',
                borderRadius: "10px",
                background: "#e3e3e3",
                "& .MuiInputLabel-root": {
                  color: "#3333339a", // cor verde para a label
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#488042", // cor verde quando o campo estiver focado
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fontFamily="Lexend" 
              className="modal-button"
              sx={{ borderRadius: "8px", backgroundColor: "#5faa84", padding: '0.75rem' }}
            >
              Enviar Código
            </Button>
          </form>
        ) : (
          // Etapa 2: Inserção do Código e Nova Senha
          <form onSubmit={handleCodeSubmit}>
            <TextField
              fullWidth
              fontFamily="Lexend" 
              label="Código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="modal-input"
              sx={{
                marginBottom: '1rem',
                background: "#e3e3e3",
                "& .MuiInputLabel-root": {
                  color: "#3333339a", // cor verde para a label
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#488042", // cor verde quando o campo estiver focado
                },
              }}
            />
            <TextField
              fullWidth
              fontFamily="Lexend" 
              label="Nova Senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              type="password"
              className="modal-input"
              sx={{
                marginBottom: '1.5rem',
                background: "#e3e3e3",
                "& .MuiInputLabel-root": {
                  color: "#3333339a", // cor verde para a label
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#488042", // cor verde quando o campo estiver focado
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fontFamily="Lexend" 
              className="modal-button"
              sx={{ borderRadius: "8px", backgroundColor: "#5faa84", padding: '0.75rem' }}
            >
              Redefinir Senha
            </Button>
          </form>
        )}

        {message && (
          
          <Typography fontFamily="Lexend" variant="body2" className="modal-message" sx={{ marginTop: '0.5rem', fontSize: "24" }}>
            {message}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ResetPassword;
