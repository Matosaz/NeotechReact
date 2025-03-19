import React, { useState, useEffect, useContext } from 'react';
import './Calculadora.css';
import { Radio, RadioGroup, FormControlLabel, Checkbox } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { InputTel } from '../ProfileSettings/MaskedInput';
import { UserContext } from "../../UserContext"; // Importando o UserContext
import { InputCep } from '../ProfileSettings/MaskedInput';
import { DesktopDatePicker, DesktopTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const Calculadora = () => {
  const { user, setUser } = useContext(UserContext); // Usando o contexto para pegar o usuário logado
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cep: user?.cep || '',
    endereco: user?.endereco || '',
    
    numero: user?.numero || '',
    complemento: user?.complemento || '',
    bairro: user?.bairro || '',
    cidade: user?.cidade || '',
    
    estado: user?.estado || '',
    collectionDate: '',
    collectionTime: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [telefone, settelefone] = useState(user?.telefone || "");
  const [disableNextButton, setDisableNextButton] = useState(false); // Estado para desabilitar o botão de próximo
  const [contactMethod, setContactMethod] = useState('');

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
        return 'Vamos começar. Para quem será o orçamento?';
      case 2:
        return (
          <>
            Como podemos te retornar?
            <p className='contact-orcamento-p'>Essas informações são importantes para enviarmos o orçamento e lhe ajudarmos se possuir alguma dúvida :)</p>
          </>
        );
      case 3:
        return 'Onde a coleta será realizada?';

      case 4:
        return 'Quando você almeja que a coleta ocorra?:';
      case 5:
        return 'Verifique se as informações estão corretas';
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
  };const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare os dados do formulário
    const requestData = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      endereco: formData.endereco,
      numero: formData.numero,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      
      cep: formData.cep,
      collectionDate: formData.collectionDate,
      collectionTime: formData.collectionTime,
    };
    console.log('Dados enviados:', requestData);

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!requestData.nome || !requestData.email || !requestData.telefone || !requestData.endereco || !requestData.numero || !requestData.bairro || !requestData.cidade || !requestData.estado || !requestData.cep || !requestData.collectionDate || !requestData.collectionTime) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
  
    try {
      const response = await fetch( "https://intellij-neotech.onrender.com/api/v1/orcamentos", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        alert('Agendamento confirmado com sucesso!');
      } if (!response.ok) {
        // Tente obter o corpo da resposta como texto
        const errorText = await response.text();
        console.error('Erro na requisição:', errorText);
        alert(`Erro: ${errorText}`);
      } else {
        // Caso a resposta seja válida, converta para JSON
        const data = await response.json();
        console.log('Dados recebidos:', data);
        alert('Agendamento confirmado com sucesso!');
      }
      
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      alert('Erro ao enviar os dados para o servidor.');
    }
  };
  
  
const nextStep = () => {
  const form = document.querySelector('form');

  // Validação do passo atual
  if (currentStep < 5 && form.checkValidity()) {
    if (currentStep === 4) {
      const selectedDate = dayjs(formData.collectionDate);
      const selectedTime = dayjs(formData.collectionTime, 'HH:mm');
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
      console.log('currentStep decrementado para', currentStep - 1);

    }
  };

  const updateProgress = () => {
    return (currentStep / 5) * 100;
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
  
      setFormData({ ...formData, collectionDate: newValue.format('YYYY-MM-DD') });
    }
  };
  
  const handleTimeChange = (newValue) => {
    if (newValue) {
      const selectedTime = dayjs(newValue, 'HH:mm');
      const now = dayjs();
      const selectedDate = dayjs(formData.collectionDate);
  
      if (selectedDate.isSame(now, 'day') && selectedTime.isBefore(now, 'minute')) {
        setTimeError('O horário deve ser posterior ao horário atual.');
        setDisableNextButton(true); // Desabilita o botão
      } else {
        setTimeError('');
        setDisableNextButton(false); // Habilita o botão
      }
  
      setFormData({ ...formData, collectionTime: newValue.format('HH:mm') });
    }
  };
  

// Função para desabilitar datas anteriores à data de hoje
const shouldDisableDate = (date) => {
  return date.isBefore(dayjs(), 'day');
};

// Função para desabilitar horários passados para o dia de hoje
const shouldDisableTime = (time) => {
  const now = dayjs();
  const selectedDate = dayjs(formData.collectionDate);
  
  if (selectedDate.isSame(now, 'day')) {
    return time.isBefore(now, 'minute');
  }
  return false;
};

  return (
    <section className='body-orcamento'>
      <button onClick={Voltarorcamento} className='voltar-orcamento'> <ArrowBack fontSize="small" className="icon" />Retornar</button>
      <div className='upper-orcamento'>

        <h2 className='title-orcamento'>{getStepTitle()}</h2>


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
                      value={telefone}
                      onChange={(event) => settelefone(event.target.value)}
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
                      name="contactMethod"
                      onChange={handleChange}
                      sx={{
                        flexDirection: 'row',
                        gap: '20px',
                      }}
                    >
                      <FormControlLabel
                        value="WhatsApp"
                        control={
                          <Radio
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
                        label="Por WhatsApp"
                      />
                      <FormControlLabel
                        value="Emailradio"
                        control={
                          <Radio
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
                        label="Por e-mail"
                      />
                    </RadioGroup>
                  </div>
                  <div className="form-group-orcamento2">
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="acceptContact"
                          onChange={handleChange}
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
                        value={formData.collectionDate ? dayjs(formData.collectionDate) : null}
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
                        value={formData.collectionTime ? dayjs(formData.collectionTime, 'HH:mm') : null}
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
                      <label>Data da Coleta: {formData.collectionDate}</label>
                    </div>
                    <div className="form-group-orcamento">
                      <label>Horário da Coleta: {formData.collectionTime}</label>
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
                ) : (
                  <button type="submit">Confirmar agendamento</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculadora;
