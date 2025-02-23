import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import "./ResetPassword.css";

const ResetPassword = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("https://intellij-neotech-production.up.railway.app/api/v1/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || "Se este e-mail estiver cadastrado, um link será enviado.");
    } catch (error) {
      setMessage("Erro ao solicitar recuperação de senha.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="reset-password-modal" sx={{ padding: '2rem' }}>
        <Typography variant="h6" component="h2" className="modal-title" sx={{ marginBottom: '1rem' }}>
          Recuperação de Senha
        </Typography>
        <Typography variant="body2" className="modal-description" sx={{ marginBottom: '1rem' }}>
          Insira seu e-mail para receber um link de redefinição de senha.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="modal-input"
            sx={{ marginBottom: '1.5rem', borderRadius:"10px", }}
          />
          <Button type="submit" variant="contained" className="modal-button" sx={{ borderRadius:"8px", backgroundColor:"#5faa84", padding: '0.75rem' }}>
            Enviar
          </Button>
        </form>
        {message && (
          <Typography variant="body2" className="modal-message" sx={{ marginTop: '1rem',}}>
            {message}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ResetPassword;
