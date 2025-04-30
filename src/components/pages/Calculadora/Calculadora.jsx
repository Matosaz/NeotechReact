import React, { useState, useEffect, useContext } from 'react';
import './Calculadora.css';
import { Radio, RadioGroup, FormControlLabel, Checkbox, TextField, } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { InputTel } from '../ProfileSettings/MaskedInput';
import { UserContext } from "../../UserContext"; // Importando o UserContext
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
import backgroundImage from '../../../assets/TesteCalculadora.png'; // ajuste o caminho conforme sua pasta


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Calculadora = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(UserContext); // Usando o contexto para pegar o usuário logado
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    id: user?.id || '',
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cep: user?.cep || '',
    endereco: user?.endereco || '',
    metodoContato: '',
    aceitaContato: false,
    numero: user?.numero || '',
    complemento: user?.complemento || '',
    bairro: user?.bairro || '',
    cidade: user?.cidade || '',

    estado: user?.estado || '',
    dataColeta: '',
    horaColeta: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [disableNextButton, setDisableNextButton] = useState(false); // Estado para desabilitar o botão de próximo

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
            <p className='contact-orcamento-p'>Essas informações são importantes para enviarmos um resumo do agendamento e lhe ajudarmos se possuir alguma dúvida :)</p>
          </>
        );
      case 3:
        return 'Onde a coleta será realizada?';

      case 4:
        return 'Quando você almeja que a coleta ocorra?:';
      case 5:
        return 'Verifique se as informações estão corretas';
      case 6:
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
    if (cleanedCep.length === 8) {
      fetchCepData(cleanedCep);
    }
  };

  const fetchCepData = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulário enviado na etapa:", currentStep); // 🐛 debug
    if (currentStep != 5) return; // ✅ Garante que só envia no passo 5



    setLoading(true)
    // Converter hora para formato com segundos
    const horaComSegundos = formData.horaColeta.includes(':')
      ? `${formData.horaColeta}:00`
      : `${formData.horaColeta.slice(0, 2)}:${formData.horaColeta.slice(2, 4)}:00`;

    // Preparar dados no formato esperado pelo backend
    const requestData = {
      dataColeta: formData.dataColeta,
      horaColeta: horaComSegundos,
      metodoContato: formData.metodoContato,
      aceitaContato: formData.aceitaContato,
      usuario: { id: user?.id }

    };


    // Verifica se todos os campos obrigatórios estão preenchidos

    if (!formData.metodoContato) {
      setSnackbar({
        open: true,
        message: 'Por favor, selecione um método de contato',
        severity: 'warning',
      }); return;
    }
    if (formData.aceitaContato === null || formData.aceitaContato === undefined) {
      setSnackbar({
        open: true,
        message: 'Por favor, informe se deseja receber contato',
        severity: 'warning',
      }); return;
    }

    try {
      const response = await fetch("https://intellij-neotech.onrender.com/api/v1/orcamentos", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await response.text();
      if (!response.ok) {
        console.error('Erro na requisição:', responseText);
        setSnackbar({
          open: true,
          message: (`Erro: ${responseText.message || 'Erro ao enviar dados'}`),
          severity: 'error',
        });;
        setLoading(false);

        return;
      }

      console.log('Dados recebidos:', responseText);
      setCurrentStep(6); // Avança para a tela de sucesso

    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao enviar os dados para o servidor',
        severity: 'error',
      });
    } finally {
      setLoading(false); // Desativa o loading independente do resultado
    }
  };
  const nextStep = () => {
    const form = document.querySelector('form');

    // Validação do passo atual
    if (currentStep < 6 && form.checkValidity()) {
      if (currentStep === 4) {
        const selectedDate = dayjs(formData.dataColeta);
        const selectedTime = dayjs(formData.horaColeta, 'HH:mm');
        const now = dayjs();

        if (!selectedDate.isValid()) {
          setDateError('Por favor, selecione uma data válida.');
          setTimeError('');
          setDisableNextButton(true);
          return;
        }

        if (!selectedTime.isValid()) {
          setTimeError('Por favor, selecione um horário válido.');
          setDateError('');
          setDisableNextButton(true);
          return;
        }

        // Verifica se a data e o horário são anteriores às atuais
        if (selectedDate.isBefore(now, 'day') || (selectedDate.isSame(now, 'day') && selectedTime.isBefore(now, 'minute'))) {
          setDateError('A data e/ou o horário selecionado é anterior ao horário atual.');
          setTimeError('A data e/ou o horário selecionado é anterior ao horário atual.');
          setDisableNextButton(true);
          return;
        }

        // Se passou nas validações, limpa os erros e habilita o botão
        setDateError('');
        setTimeError('');
        setDisableNextButton(false);
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(currentStep + 1);
      }
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
    return (currentStep / 6) * 100;
  };
  const handleDateChange = (newValue) => {
    if (newValue) {
      const selectedDate = dayjs(newValue);
      const now = dayjs();

      if (selectedDate.isBefore(now, 'day')) {
        setDateError('A data deve ser posterior à data atual.');
        setDisableNextButton(true); // Desabilita o botão
      } else {
        setDateError('');
        setDisableNextButton(false); // Habilita o botão
      }

      setFormData({ ...formData, dataColeta: newValue.format('YYYY-MM-DD') });
    }
  };

  const handleTimeChange = (newValue) => {
    if (newValue) {
      const selectedTime = dayjs(newValue, 'HH:mm');
      const now = dayjs();
      const selectedDate = dayjs(formData.dataColeta);

      if (selectedDate.isSame(now, 'day') && selectedTime.isBefore(now, 'minute')) {
        setTimeError('O horário deve ser posterior ao horário atual.');
        setDisableNextButton(true);
      } else {
        setTimeError('');
        setDisableNextButton(false);
      }

      const hours = String(newValue.hour()).padStart(2, '0');
      const minutes = String(newValue.minute()).padStart(2, '0');
      setFormData({ ...formData, horaColeta: `${hours}:${minutes}` });
    }
  };

  // Função para desabilitar datas anteriores à data de hoje
  const shouldDisableDate = (date) => {
    return date.isBefore(dayjs(), 'day');
  };

  // Função para desabilitar horários passados para o dia de hoje
  const shouldDisableTime = (time) => {
    const now = dayjs();
    const selectedDate = dayjs(formData.dataColeta);

    if (selectedDate.isSame(now, 'day')) {
      return time.isBefore(now, 'minute');
    }
    return false;
  };

  return (
    <>
      {currentStep === 6 ? (
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
                Seu agendamento foi confirmado e em breve entraremos em contato para confirmar os detalhes.
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
          <button type="button" onClick={Voltarorcamento} className='voltar-orcamento'> <ArrowBack fontSize="small" className="icon" />Retornar</button>
          <div className='upper-orcamento'>

            <h2 className='title-orcamento'>{getStepTitle()}</h2>
{/* teste */}

            <div className="wrap-orcamento">
              <div className="col-lg-12-orcamento">
                {/* Barra de Progresso */}
                <div id="progress-orcamento">
                  <div
                    id="progress-complete-orcamento"
                    style={{ width: `${updateProgress()}%` }}
                  ></div>
                </div>

                {/* Formulário Multi-step */}
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


                  {/* Passo 4: Estimativa de Orçamento */}
                  {currentStep === 4 && (
                    <fieldset className='fieldset-orcamento'>
                      <legend className='legend-orcamento'>Escolha a data e horário para a coleta</legend>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <div className="form-group-orcamento">
                          <label>Data da Coleta</label>
                          <DesktopDatePicker
                            value={formData.dataColeta ? dayjs(formData.dataColeta) : null}
                            onChange={handleDateChange}
                            shouldDisableDate={shouldDisableDate}// Bloqueia datas anteriores
                            slotProps={{ textField: { fullWidth: true } }}

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
                            slotProps={{ textField: { fullWidth: true } }}
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
                  {currentStep === 5 && (
                    <fieldset className='fieldset-orcamento'>
                      <legend className='legend-orcamento'>Confirmação do Agendamento</legend>
                      <div className="ConfirmDesign">
                        <div className="form-group-orcamento">
                          <label>Nome: {formData.nome}</label>
                        </div>
                        <div className="form-group-orcamento">
                          <label>Email: {formData.email}</label>
                        </div>
                        <div className="form-group-orcamento">
                          <label>Telefone: {formData.telefone}</label>
                        </div>

                        <div className="form-group-orcamento">
                          <label>Bairro: {formData.bairro}</label>
                        </div>

                        <div className="form-group-orcamento">
                          <label>CEP: {formData.cep}</label>
                        </div>

                        <div className="form-group-orcamento">
                          <label>Cidade: {formData.cidade}</label>
                        </div>
                        <div className="form-group-orcamento">
                          <label>Número: {formData.numero}</label>
                        </div>
                        <div className="form-group-orcamento">
                          <label>Endereço: {formData.endereco}</label>
                        </div>
                        <div className="form-group-orcamento">
                          <label>Data da Coleta: {formData.dataColeta}</label>
                        </div>
                        <div className="form-group-orcamento">
                          <label>Horário da Coleta: {formData.horaColeta}</label>
                        </div>
                      </div>
                    </fieldset>
                  )}


                  {/* Navegação */}
                  <div className="form-navigation">
                    {currentStep > 1 && (
                      <button type="button" className="buttonprevious" onClick={prevStep}>
                        Voltar
                      </button>
                    )}
                    {currentStep <= 4 ? (
                      <button type="button" onClick={nextStep} disabled={disableNextButton}>
                        Próximo
                      </button>
                    ) : currentStep === 5 ? (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleSubmit} // Explicitamente chama o handleSubmit no clique

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
                            <span style={{ opacity: 0 }}>Confirmar agendamento</span>
                          </>
                        ) : (
                          'Confirmar agendamento'
                        )}
                      </button>
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