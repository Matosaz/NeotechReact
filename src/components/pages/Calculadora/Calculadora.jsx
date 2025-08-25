import React, { useState, useEffect, useContext } from 'react';
import './Calculadora.css';
import { Radio, RadioGroup, FormControlLabel, Checkbox, TextField, Dialog, DialogTitle, DialogActions, DialogContentText, DialogContent } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { InputTel } from '../ProfileSettings/MaskedInput';
import { UserContext } from "../../UserContext";
import { InputCep } from '../ProfileSettings/MaskedInput';
import { DesktopDatePicker, DesktopTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import backgroundImage from '../../../assets/TesteCalculadora.png';
import { Receipt } from 'lucide-react';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Calculadora = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    id: user?.id || '',
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: '',
    cep: '',
    endereco: user?.endereco || '',
    metodoContato: '',
    aceitaContato: false,
    numero: '',
    bairro: '',
    cidade: '',
    itens: [],
    novaCategoria: '',
    novaQuantidade: '',
    categoriasDisponiveis: [],
    estado: '',
    dataColeta: '',
    horaColeta: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [disableNextButton, setDisableNextButton] = useState(false);
  const [openloginModal, setOpenLoginModal] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('https://intellij-neotech.onrender.com/api/v1/categorias');
        const data = await response.json();
        setFormData(prev => ({ ...prev, categoriasDisponiveis: data }));
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao carregar categorias disponíveis',
          severity: 'error'
        });
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    // Calcular valor total sempre que os itens mudarem
    const total = formData.itens.reduce((total, item) => 
      total + (item.categoria.precoPorKg * item.quantidade), 0);
    setValorTotal(total);
  }, [formData.itens]);

  const Voltarorcamento = () => {
    window.history.back();
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Vamos começar. Para quem será a coleta?';
      case 2:
        return (
          <>
            Como podemos te retornar?
            <p className='contact-orcamento-p'>Essas informações são importantes para enviarmos um resumo do orçamento e lhe ajudarmos se possuir alguma dúvida :)</p>
          </>
        );
      case 3:
        return 'Onde a coleta será realizada?';
      case 4:
        return 'Quando você almeja que a coleta ocorra?:';
      case 5:
        return 'Quais itens você deseja reciclar?';
      case 6:
        return 'Verifique se as informações estão corretas!';
      case 7:
        return 'Hora de finalizarmos o agendamento!';
      case 8:
        return 'Agendamento Confirmado!';
      default:
        return 'Vamos começar!';
    }
  };

  const getCountries = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    return data.map((country) => ({
      name: country.name.common,
      code: country.cca2,
    }));
  };

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCepChange = (value) => {
    const cleanedCep = value.replace(/\D/g, "");
    setFormData({ ...formData, cep: value });
    if (cleanedCep.length === 0) {
      setFormData(prev => ({
        ...prev,
        endereco: '',
        bairro: '',
        cidade: '',
        estado: '',
        numero: '',
      }));
      return;
    }
    if (cleanedCep.length === 8) {
      fetchCepData(cleanedCep);
    }
  };

  const fetchCepData = async (cep) => {
    setCepLoading(true);
    setDisableNextButton(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        setSnackbar({
          open: true,
          message: 'CEP não encontrado. Verifique o número digitado.',
          severity: 'error'
        });
        setFormData((prev) => ({
          ...prev,
          endereco: '',
          bairro: '',
          cidade: '',
          estado: '',
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
        }));
        setSnackbar({
          open: true,
          message: 'CEP encontrado com sucesso!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
      setSnackbar({
        open: true,
        message: 'Erro ao consultar CEP. Tente novamente.',
        severity: 'error'
      });
    } finally {
      setCepLoading(false);
      setDisableNextButton(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep !== 6) return;

    setLoading(true);

    // Validar campos obrigatórios
    if (!formData.metodoContato) {
      setSnackbar({
        open: true,
        message: 'Por favor, selecione um método de contato',
        severity: 'warning',
      });
      setLoading(false);
      return;
    }

    if (formData.aceitaContato === null || formData.aceitaContato === undefined) {
      setSnackbar({
        open: true,
        message: 'Por favor, informe se deseja receber contato',
        severity: 'warning',
      });
      setLoading(false);
      return;
    }

    // Converter hora para formato com segundos
    const horaComSegundos = formData.horaColeta.includes(':')
      ? `${formData.horaColeta}:00`
      : `${formData.horaColeta.slice(0, 2)}:${formData.horaColeta.slice(2, 4)}:00`;

    const categoriasPayload = formData.itens.map(item => ({ id: item.categoria.id }));

    // Preparar dados no formato esperado pelo backend
    const requestData = {
      categorias: categoriasPayload,
      dataColeta: formData.dataColeta,
      horaColeta: horaComSegundos,
      metodoContato: formData.metodoContato,
      aceitaContato: formData.aceitaContato,
      usuario: { id: user?.id },
      quantidadeKg: formData.itens.reduce((total, item) => total + item.quantidade, 0),
      pontos: formData.itens.reduce((total, item) => total + item.pontos, 0),
      cep: formData.cep,
      endereco: formData.endereco,
      numero: formData.numero,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      valorTotal: valorTotal
    };

    // Salvar no localStorage em vez de enviar imediatamente
    localStorage.setItem("orcamento-pendente", JSON.stringify(requestData));
    
   // Gerar PIX usando endpoint correto
    try {
      const pixResponse = await fetch(`https://intellij-neotech.onrender.com/api/v1/orcamentos/teste-pix?valor=${valorTotal}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (pixResponse.ok) {
        const pixData = await pixResponse.json();
        setPixData(pixData);
        setCurrentStep(7);
      } else {
        const errorText = await pixResponse.text();
        throw new Error(errorText || "Erro ao gerar PIX");
    
      }
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao gerar código PIX',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePaymentConfirmed = async () => {
    const orcamento = JSON.parse(localStorage.getItem("orcamento-pendente"));
    if (!orcamento) return;

    setLoading(true);
    try {
      const response = await fetch("https://intellij-neotech.onrender.com/api/v1/orcamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orcamento),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao enviar orçamento");
      }

      // Limpa cache e vai para sucesso
      localStorage.removeItem("orcamento-pendente");
      setCurrentStep(8);

    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao confirmar pagamento",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    const form = document.querySelector('form');

    if (currentStep < 8 && form.checkValidity()) {
      if (currentStep === 1 && !user) {
        setOpenLoginModal(true);
        return;
      }

      if (currentStep === 4 && !validateDateTime()) {
        return;
      }
      setCurrentStep(currentStep + 1);
    } else {
      form.reportValidity();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProgress = () => {
    return (currentStep / 8) * 100;
  };

  const handleDateChange = (newDate) => {
    const now = dayjs();
    const selectedDate = dayjs(newDate);

    setDateError('');
    setTimeError('');

    if (selectedDate.isBefore(now, 'day')) {
      setDateError('Não é possível selecionar uma data passada');
      setDisableNextButton(true);
    } else {
      if (formData.horaColeta) {
        const horaSemSegundos = formData.horaColeta.split(':').slice(0, 2).join(':');
        const selectedTime = dayjs(horaSemSegundos, 'HH:mm');

        if (selectedDate.isSame(now, 'day') && selectedTime.isBefore(now)) {
          setTimeError('Selecione um horário futuro para hoje');
          setDisableNextButton(true);
        } else {
          setDisableNextButton(false);
        }
      } else {
        setDisableNextButton(false);
      }
    }

    setFormData(prev => ({
      ...prev,
      dataColeta: selectedDate.format('YYYY-MM-DD')
    }));
  };

  const validateDateTime = () => {
    const now = dayjs();
    const selectedDate = dayjs(formData.dataColeta);
    const selectedTime = formData.horaColeta ? dayjs(formData.horaColeta, 'HH:mm') : null;

    setDateError('');
    setTimeError('');
    setDisableNextButton(false);

    if (!selectedDate.isValid()) {
      setDateError('Selecione uma data válida');
      setDisableNextButton(true);
      return false;
    }

    if (selectedDate.isBefore(now, 'day')) {
      setDateError('Não é possível selecionar uma data passada');
      setDisableNextButton(true);
      return false;
    }

    if (!selectedTime || !selectedTime.isValid()) {
      setTimeError('Selecione um horário válido');
      setDisableNextButton(true);
      return false;
    }

    if (selectedDate.isSame(now, 'day') && selectedTime.isBefore(now)) {
      setTimeError('Selecione um horário futuro para hoje');
      setDisableNextButton(true);
      return false;
    }

    return true;
  };

  const shouldDisableDate = (date) => {
    return date.isBefore(dayjs(), 'day');
  };

  const handleTimeChange = (newTime) => {
    const now = dayjs();
    const selectedDate = dayjs(formData.dataColeta);
    const selectedTime = dayjs(newTime);

    setTimeError('');

    if (!selectedDate.isValid()) {
      setTimeError('Selecione uma data primeiro');
      setDisableNextButton(true);
      return;
    }

    const hours = String(selectedTime.hour()).padStart(2, '0');
    const minutes = String(selectedTime.minute()).padStart(2, '0');

    setFormData(prev => ({
      ...prev,
      horaColeta: `${hours}:${minutes}`
    }));

    if (selectedDate.isSame(now, 'day') && selectedTime.isBefore(now)) {
      setTimeError('Selecione um horário futuro para hoje');
      setDisableNextButton(true);
    } else {
      setDisableNextButton(false);
    }
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  }

  const handleRedirectToLogin = () => {
    window.location.href = '/Auth';
  }

  const shouldDisableTime = (timeValue, view) => {
    const now = dayjs();
    const selectedDate = dayjs(formData.dataColeta);

    if (selectedDate.isSame(now, 'day')) {
      const selectedTime = dayjs(timeValue);

      if (view === 'hours') {
        return selectedTime.hour() < now.hour();
      }

      if (view === 'minutes' && selectedTime.hour() === now.hour()) {
        return selectedTime.minute() < now.minute();
      }
    }

    return false;
  };

  const calcularPontos = (categoria, quantidade) => {
    if (!categoria || typeof quantidade !== 'number' || quantidade <= 0) return 0;
    const pontosPorKg = Number(categoria.pontosPorKg) || 1;
    return Math.round(quantidade * 50);
  };

  const addItem = () => {
    if (formData.itens.length >= 10) {
      setSnackbar({
        open: true,
        message: 'Você atingiu o limite de 10 itens por orçamento',
        severity: 'warning',
      });
      return;
    }

    if (formData.novaCategoria && formData.novaQuantidade) {
      const categoriaSelecionada = formData.categoriasDisponiveis.find(
        cat => cat.id == formData.novaCategoria
      );
      const novoItem = {
        categoria: categoriaSelecionada,
        quantidade: parseFloat(formData.novaQuantidade),
        pontos: calcularPontos(categoriaSelecionada, parseFloat(formData.novaQuantidade))
      };

      setFormData({
        ...formData,
        itens: [...formData.itens, novoItem],
        novaCategoria: '',
        novaQuantidade: ''
      });
    }
  };

  return (
    <>
      <Dialog
        open={openloginModal}
        onClose={handleCloseLoginModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <h2 className="alert-dialog-title" >
          Login necessário!
        </h2>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Para continuar com o orçamento, é necessário estar logado em sua conta.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button onClick={handleCloseLoginModal} className='CANCEL_button_orc' >
            Cancelar
          </button>
          <button onClick={handleRedirectToLogin} className='button_redirect_login'>
            Efetue Login
          </button>
        </DialogActions>
      </Dialog>

      {currentStep === 8 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="success-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundImage: `url(${backgroundImage})`,
            backgroundColor: '#f5f5f5',
            padding: '20px'
          }}
        >
          <div className="success-content">
            <CheckCircle
              size={85}
              color="#5CAF60"
              strokeWidth={1.7}
              className="success-icon"
            />
            <h3 className="success-title">Coleta Agendada com Sucesso!</h3>

            <div className="success-details">
              <p className="success-message">
                Seu orçamento foi confirmado e em breve entraremos em contato para confirmar os detalhes.
              </p>

              <div className="resume-card">
                <h4>Resumo do Agendamento</h4>
                <div className="resume-item">
                  <span className="resume-label">Data:</span>
                  <span className="resume-value">{dayjs(formData.dataColeta).format('DD/MM/YYYY')}</span>
                </div>
                <div className="resume-item">
                  <span className="resume-label">Horário:</span>
                  <span className="resume-value"> às {formData.horaColeta} </span>
                </div>
                <div className="resume-item">
                  <span className="resume-label">Local:</span>
                  <span className="resume-value">
                    {formData.endereco}, {formData.numero} - {formData.bairro}, {formData.cidade}/{formData.estado}
                  </span>
                </div>
              </div>

              <p className="success-note">
                Um e-mail de confirmação foi enviado para <strong>{formData.email}</strong> com todos os detalhes.
              </p>
            </div>

            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={() => window.location.href = '/'}
              sx={{
                mt: 3,
                backgroundColor: "#2E7D42",
                borderRadius: '8px',
                fontWeight: '600',
                textTransform: 'none',
              }}
            >
              Voltar para a Página Inicial
            </Button>
          </div>
        </motion.div>
      ) : (
        <section className='body-orcamento'>
          <button type="button" onClick={Voltarorcamento} className='voltar-orcamento'> 
            <ArrowBack fontSize="small" className="icon" />Retornar
          </button>
          <div className='upper-orcamento'>
            <h2 className='title-orcamento'>{getStepTitle()}</h2>

            <div className="wrap-orcamento" style={{ maxWidth: currentStep === 6 ? "600px" : "800px"}}>
              <div className="col-lg-12-orcamento">
                <div id="progress-orcamento">
                  <div
                    id="progress-complete-orcamento"
                    style={{ width: `${updateProgress()}%` }}
                  ></div>
                </div>

                <form className="form-orcamento" onSubmit={handleSubmit} noValidate>
                  {/* Passo 1: Account information */}
                  {currentStep === 1 && (
                    <fieldset className='fieldset-orcamento'>
                      <legend className='legend-orcamento'>Identificação</legend>
                      <div className="form-group-orcamento">
                        <label>Nome</label>
                        <input
                          placeholder='Digite seu nome'
                          id="Name-orcamento"
                          name="nome"
                          type="text"
                          className="form-control-orcamento"
                          value={formData.nome}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group-orcamento">
                        <label>Email</label>
                        <input
                          placeholder="Digite seu email"
                          id="Email-orcamento"
                          name="email"
                          type="email"
                          className="form-control-orcamento"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group-orcamento">
                        <label>Telefone</label>
                        <InputTel
                          required
                          value={formData.telefone}
                          onChange={(event) => setFormData({ ...formData, telefone: event.target.value })}
                          pattern="\(\d{2}\) \d{4,5}-\d{4}"
                          title="Digite um número de telefone válido (ex: (99) 99999-9999)"
                        />
                      </div>
                    </fieldset>
                  )}

                  {/* Passo 2: Contact Information */}
                  {currentStep === 2 && (
                    <fieldset className="fieldset-orcamento">
                      <legend className="legend-orcamento">Contato</legend>
                      <div className="form-group-orcamento2">
                        <RadioGroup
                          name="metodoContato"
                          value={formData.metodoContato}
                          onChange={(e) => setFormData({ ...formData, metodoContato: e.target.value })}
                          sx={{
                            flexDirection: 'row',
                            gap: '20px',
                          }}
                        >
                          <FormControlLabel
                            value="whatsapp"
                            control={
                              <Radio
                                sx={{
                                  '&.Mui-checked': {
                                    color: '#4caf50',
                                  },
                                }}
                              />
                            }
                            label="WhatsApp"
                          />
                          <FormControlLabel
                            value="email"
                            control={
                              <Radio
                                sx={{
                                  '&.Mui-checked': {
                                    color: '#4caf50',
                                  },
                                }}
                              />
                            }
                            label="Email"
                          />
                        </RadioGroup>
                      </div>
                      <div className="form-group-orcamento2">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.aceitaContato}
                              onChange={(e) => setFormData({ ...formData, aceitaContato: e.target.checked })}
                              sx={{
                                '&.Mui-checked': {
                                  color: '#4caf50',
                                  transition: 'transform 0.3s ease',
                                  transform: 'scale(1.2)',
                                },
                                transition: 'transform 0.3s ease',
                              }}
                            />
                          }
                          label="Aceito receber o contato da Neotech em meu e-mail e/ou WhatsApp"
                        />
                      </div>
                    </fieldset>
                  )}

                  {/* Passo 3: Item Recycling Information */}
                  {currentStep === 3 && (
                    <fieldset className='fieldset-orcamento'>
                      <legend className='legend-orcamento'>Endereço</legend>
                      <div className="form-group-orcamento">
                        <label>CEP</label>
                        <InputCep value={formData.cep} onChange={(e) => handleCepChange(e.target.value)} />
                      </div>
                      <div className="form-group-orcamento">
                        <label>Endereço</label>
                        <input
                          type="text"
                          name="endereco"
                          value={formData.endereco}
                          onChange={handleChange}
                          required
                          placeholder="Digite seu endereço"
                        />
                      </div>
                      <div className="form-group-orcamento">
                        <label>Número</label>
                        <input
                          type="text"
                          name="numero"
                          value={formData.numero}
                          onChange={handleChange}
                          required
                          placeholder="Número da residência"
                        />
                      </div>
                      <div className="form-group-orcamento">
                        <label>Bairro</label>
                        <input
                          type="text"
                          name="bairro"
                          value={formData.bairro}
                          onChange={handleChange}
                          required
                          placeholder="Digite seu bairro"
                        />
                      </div>
                      <div className="form-group-orcamento">
                        <label>Cidade</label>
                        <input
                          type="text"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleChange}
                          required
                          placeholder="Digite sua cidade"
                        />
                      </div>
                      <div className="form-group-orcamento">
                        <label>Estado</label>
                        <input
                          type="text"
                          name="estado"
                          value={formData.estado}
                          onChange={handleChange}
                          required
                          placeholder="Digite seu estado"
                        />
                      </div>
                    </fieldset>
                  )}

                  {/* Passo 4: Data e Hora */}
                  {currentStep === 4 && (
                    <fieldset className='fieldset-orcamento'>
                      <legend className='legend-orcamento'>Escolha a data e horário para a coleta</legend>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <div className="form-group-orcamento">
                          <label>Data da Coleta</label>
                          <DesktopDatePicker
                            value={formData.dataColeta ? dayjs(formData.dataColeta) : null}
                            onChange={handleDateChange}
                            shouldDisableDate={shouldDisableDate}
                            slotProps={{
                              textField: {
                                fullWidth: true, 
                                margin: 'dense',
                                error: !!dateError,
                                helperText: dateError,
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                className="form-control-orcamento"
                                error={!!dateError}
                                helperText={dateError}
                                sx={{
                                  backgroundColor: '#dad7d75d',
                                  borderRadius: '8px',
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: 'none' }
                                  }
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="form-group-orcamento">
                          <label>Horário da Coleta</label>
                          <DesktopTimePicker
                            value={formData.horaColeta ? dayjs(formData.horaColeta, 'HH:mm') : null}
                            onChange={handleTimeChange}
                            shouldDisableTime={shouldDisableTime}
                            slotProps={{
                              textField: {
                                error: !!timeError,
                                helperText: timeError, 
                                fullWidth: true, 
                                margin: 'dense',
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                className="form-control-orcamento"
                                error={!!timeError}
                                helperText={timeError}
                                sx={{
                                  backgroundColor: '#dad7d75d',
                                  borderRadius: '8px',
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: 'none' },
                                  },
                                }}
                              />
                            )}
                          />
                        </div>
                      </LocalizationProvider>
                    </fieldset>
                  )}

                  {/* Passo 5: Itens para reciclagem */}
                  {currentStep === 5 && (
                    <fieldset className='fieldset-orcamento'>
                      <legend className='legend-orcamento'>Itens para Reciclagem</legend>
                      <div className="itens-container">
                        {formData.itens && formData.itens.length > 0 && (
                          <div className="itens-list">
                            <h4>Itens adicionados:</h4>
                            <ul>
                              {formData.itens.map((item, index) => (
                                <li key={index}>
                                  <span className="item-info">
                                    {item.quantidade}kg de {item.categoria.nome}
                                    <span className="item-price">
                                      (R$ {(item.categoria.precoPorKg * item.quantidade).toFixed(2)})
                                    </span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newItens = [...formData.itens];
                                      newItens.splice(index, 1);
                                      setFormData({ ...formData, itens: newItens });
                                    }}
                                    className="remove-item-btn"
                                  >
                                    Remover
                                  </button>
                                </li>
                              ))}
                            </ul>
                            <div className="total-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Receipt size={20} style={{ marginRight: '8px', color: "#2e7d32" }} />
                                <h4 style={{ margin: 0 }}>Total estimado:</h4>
                              </div>
                              <span className="total-value" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                R$ {formData.itens.reduce((total, item) =>
                                  total + (item.categoria.precoPorKg * item.quantidade), 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}

                        {formData.itens.length >= 10 && (
                          <div className="max-itens-warning">
                            Você atingiu o limite máximo de 10 itens por orçamento.
                          </div>
                        )}

                        {formData.itens.length < 10 && (
                          <div className="novo-item-form">
                            <div className="form-group-orcamento">
                              <label>Categoria do Item</label>
                              <select
                                name="novaCategoria"
                                value={formData.novaCategoria || ''}
                                onChange={(e) => setFormData({ ...formData, novaCategoria: e.target.value })}
                                required={formData.itens.length === 0}
                                className="form-control-orcamento"
                              >
                                <option value="">Selecione uma categoria</option>
                                {formData.categoriasDisponiveis
                                  .filter(cat => cat.codStatus.trim() === 'ATIVO')
                                  .map((categoria) => (
                                    <option key={categoria.id} value={categoria.id} disabled={formData.itens.some(item => item.categoria.id === categoria.id)}>
                                      {categoria.nome} (R$ {categoria.precoPorKg.toFixed(2)}/kg)
                                      {formData.itens.some(item => item.categoria.id === categoria.id) && ' - Já adicionado'}
                                    </option>
                                  ))}
                              </select>
                            </div>

                            <div className="form-group-orcamento">
                              <label>Quantidade (kg)</label>
                              <input
                                type="number"
                                name="novaQuantidade"
                                min="0.1"
                                step="0.1"
                                value={formData.novaQuantidade || ''}
                                onChange={(e) => setFormData({ ...formData, novaQuantidade: e.target.value })}
                                required={formData.itens.length === 0}
                                placeholder="Ex: 2.5"
                                className="form-control-orcamento"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={addItem}
                              className="add-item-btn"
                            >
                              Adicionar Item
                            </button>
                          </div>
                        )}
                      </div>
                    </fieldset>
                  )}

                  {/* Passo 6: Confirmação */}
                  {currentStep === 6 && (
                    <fieldset className='fieldset-orcamento'>
                      <legend className='legend-orcamento-confirmar'>Confirme todos os seus dados!</legend>
                      <div className="receipt-container">
                        <div className="receipt-header">
                          <div className="receipt-logo"></div>
                          <h3 className="receipt-title">Orçamento</h3>
                          <div className="receipt-meta">
                            <span>{new Date().toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>

                        <div className="receipt-divider"></div>

                        <div className="receipt-section">
                          <h4 className="receipt-section-title">Informações Pessoais</h4>
                          <div className="receipt-row">
                            <span className="receipt-label">Nome:</span>
                            <span className="receipt-value">{formData.nome}</span>
                          </div>
                          <div className="receipt-row">
                            <span className="receipt-label">Contato:</span>
                            <span className="receipt-value">{formData.telefone} | {formData.email}</span>
                          </div>
                        </div>

                        <div className="receipt-divider"></div>

                        <div className="receipt-section">
                          <h4 className="receipt-section-title">Local da Coleta</h4>
                          <div className="receipt-row">
                            <span className="receipt-label">Endereço:</span>
                            <span className="receipt-value">{formData.endereco}, {formData.numero}</span>
                          </div>
                          <div className="receipt-row">
                            <span className="receipt-label">Bairro:</span>
                            <span className="receipt-value">{formData.bairro}</span>
                          </div>
                          <div className="receipt-row">
                            <span className="receipt-label">Cidade/Estado:</span>
                            <span className="receipt-value">{formData.cidade}/{formData.estado}</span>
                          </div>
                          <div className="receipt-row">
                            <span className="receipt-label">CEP:</span>
                            <span className="receipt-value">{formData.cep}</span>
                          </div>
                        </div>

                        <div className="receipt-divider"></div>

                        <div className="receipt-section">
                          <h4 className="receipt-section-title">Detalhes da Coleta</h4>
                          <div className="receipt-row">
                            <span className="receipt-label">Data:</span>
                            <span className="receipt-value">{dayjs(formData.dataColeta).format('DD/MM/YYYY')}</span>
                          </div>
                          <div className="receipt-row">
                            <span className="receipt-label">Horário:</span>
                            <span className="receipt-value">{formData.horaColeta}</span>
                          </div>
                        </div>

                        {formData.itens.length > 0 && (
                          <>
                            <div className="receipt-divider"></div>
                            <div className="receipt-section">
                              <h4 className="receipt-section-title">Itens para Reciclagem</h4>
                              {formData.itens.map((item, index) => (
                                <div className="receipt-item" key={index}>
                                  <span className="item-name">{item.categoria.nome}</span>
                                  <span className="item-quantity">{item.quantidade} kg</span>
                                  <span className="item-points">{item.pontos} pts</span>

                                  <span className="item-price">R$ {(item.categoria.precoPorKg * item.quantidade).toFixed(2)}</span>
                                </div>
                              ))}
                              <div className="receipt-total" >

                                <span> <Receipt size={20} style={{ marginRight: '5px', marginBottom: '-px', color: "#2e7d32" }} />Total Estimado:</span>
                                <span className="total-value">R$ {formData.itens.reduce((total, item) =>
                                  total + (item.categoria.precoPorKg * item.quantidade), 0).toFixed(2)}</span>
                              </div>
                            </div>
                          </>
                        )}


                      </div>
                    </fieldset>
                  )}
                  {/* Passo 7: PIX */}
                  {currentStep === 7 && (
                    <fieldset className='fieldset-orcamento'>
                      <legend className='legend-orcamento' style={{ textAlign: 'center', marginBottom: '-20px' }}>Pagamento via PIX</legend>

                      <div className="pix-container">
                        <div className="pix-header">
                          <p>Escaneie o QR Code ou copie o código para pagar</p>
                        </div>

                        <div className="pix-content">
                          <div className="pix-qr-code">
                            {!pixData ? (
                              <div className="loading-pix">
                                <CircularProgress />
                                <p>Gerando QR Code PIX...</p>
                              </div>
                            ) : (
                              <img
                                src={pixData.qrCodeDataUrl || pixData.qrCodeBase64}
                                alt="QR Code PIX"
                                className="qr-code-image"
                                style={{ width: '250px', height: '250px' }}
                              />)}
                          </div>

                          <div className="pix-details">
                            <div className="pix-amount">
                              <span className="label">Valor:</span>
                              <span className="value">
                                R$ {pixData?.valorTotal?.toFixed(2) || valorTotal.toFixed(2)}
                              </span>
                            </div>

                            <div className="pix-code-section">
                              <span className="label">Chave PIX:</span>
                              <div className="copy-field">
                                <span className="pix-code">{pixData?.chavePix}</span>
                                <button
                                  className={`copy-button ${copied ? 'copied' : ''}`}
                                  onClick={() => copyToClipboard(pixData?.chavePix)}
                                  title="Copiar chave PIX"
                                >
                                  {copied ? 'Copiado!' : 'Copiar'}
                                </button>
                              </div>
                            </div>

                            <div className="pix-instructions">
                              <h4>Como pagar:</h4>
                              <ol>
                                <li>Abra o app do seu banco</li>
                                <li>Selecione a opção PIX</li>
                                <li>Escaneie o QR Code ou cole a chave PIX</li>
                                <li>Confirme o pagamento</li>
                              </ol>
                            </div>
                          </div>
                        </div>

                        <div className="pix-footer">
                          <p>Após o pagamento, clique em "Já efetuei o pagamento" para finalizar</p>
                        </div>
                      </div>
                    </fieldset>
                  )}
                  {/* Navegação */}
                  <div className="form-navigation">
                    {currentStep > 1 && currentStep !== 7 && (
                      <button type="button" className="buttonprevious" onClick={prevStep}>
                        Voltar
                      </button>
                    )}
                    {currentStep <= 5 ? (
                      <button type="button" onClick={nextStep} className={disableNextButton || cepLoading ? "disabled-button" : "enabled-button"}
                        disabled={disableNextButton || cepLoading}>
                        Próximo
                      </button>
                    ) : currentStep === 6 ? (
                      <button
                        type="button"
                        disabled={loading || disableNextButton || cepLoading}
                        onClick={handleSubmit}
                        style={{ position: 'relative' }}
                      >
                        {loading ? (
                          <>
                            <CircularProgress
                              size={24}
                              color="inherit"
                              style={{
                                position: 'absolute',
                                left: '50%',
                                marginLeft: '-12px',
                              }}
                            />
                            <span style={{ opacity: 0 }}>Gerar PIX</span>
                          </>
                        ) : (
                          'Gerar PIX'
                        )}
                      </button>
                    ) : currentStep === 7 ? (
                      <>
                        <button type="button" className="buttonprevious" onClick={() => setCurrentStep(6)}>
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={handlePaymentConfirmed}
                          disabled={loading}
                          className="enabled-button"
                          style={{ position: 'relative' }}
                        >
                          {loading ? (
                            <>
                              <CircularProgress
                                size={24}
                                color="inherit"
                                style={{
                                  position: 'absolute',
                                  left: '50%',
                                  marginLeft: '-12px',
                                }}
                              />
                              <span style={{ opacity: 0 }}>Já efetuei o pagamento</span>
                            </>
                          ) : (
                            'Já efetuei o pagamento'
                          )}
                        </button>
                      </>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}

            >
              <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}
                sx={{
                  width: '100%', borderRadius: '8px',
                }}>
                {snackbar.message}
              </Alert>
            </Snackbar>
          </div>
        </section>
      )}
    </>
  )
};

export default Calculadora;