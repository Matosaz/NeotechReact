import React, { useState, useEffect, useContext } from 'react';
import './Calculadora.css';
import { Radio, RadioGroup, FormControlLabel, Checkbox } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { InputTel } from '../ProfileSettings/MaskedInput';
import { UserContext } from "../../UserContext"; // Importando o UserContext

const Calculadora = () => {
    const {user, setUser } = useContext(UserContext); // Usando o contexto para pegar o usuário logado
  
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    website: '',
    companyEmail: '',
    nameOnCard: '',
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    address1: '',
    address2: '',
    zip: '',
    country: '',
    itemType: '',
    itemQuantity: '',
    itemClassification: '',
    itemDetails: '',
    otherItem: '' // Campo para o outro item
  });
  const [currentStep, setCurrentStep] = useState(1);

  const [telefone, settelefone] = useState(user?.telefone || "");

  const Voltarorcamento =() =>{
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
        return 'Quais itens você quer reciclar?';

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
  
    if (name === "itemQuantity") {
      // Permitir apenas números
      if (!/^\d*$/.test(value)) return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted');
  };

  const nextStep = () => {
    const form = document.querySelector('form');
    if (currentStep < 5 && form.checkValidity()){
    setCurrentStep(currentStep + 1);
    console.log('currentStep incrementado para', currentStep + 1);
    } else{
      form.reportValidity()
    }
  };

  const prevStep = () => {
    if (currentStep > 1){
    setCurrentStep(currentStep - 1);
    console.log('currentStep decrementado para', currentStep - 1);

  }
  };

  const updateProgress = () => {
    return (currentStep / 5) * 100;
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
                      name="Nome"
                      type="text"
                      className="form-control-orcamento"
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
                  pattern="\d{10,11}"  
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
                  <legend className='legend-orcamento'>Classificação e quantificação</legend>
                  
                  <div className="form-group-orcamento">
                    <label htmlFor="itemQuantity">Quantidade</label>
                    <input
                     type="text" 
                     name="itemQuantity" 
                     value={formData.itemQuantity} 
                     onChange={handleChange} 
                     required 
                     maxLength={4}
                     minLength={1}
                     pattern="\d+"  
                     title="Digite apenas números"
                     inputMode="numeric"
                     placeholder="Quantidade"
                    />
                  </div>
                  
                  <div className="form-group-orcamento">
                    <label htmlFor="itemType">Tipos de itens</label>
                    <select
                      id="itemType-orcamento"
                      name="itemType"
                      className="form-control-orcamento"
                      value={formData.itemType}
                      onChange={handleChange}
                      required
                    >
                      <option value="celular">Celular</option>
                      <option value="computador">Computador</option>
                      <option value="televisao">Televisão</option>
                      <option value="tablet">Tablet</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  {formData.itemType === 'outro' && (
                    <div className="form-group-orcamento">
                      <label htmlFor="otherItem">Descreva o outro item</label>
                      <input
                        id="otherItem-orcamento"
                        name="otherItem"
                        type="text"
                        className="form-control-orcamento"
                        value={formData.otherItem}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <div className="form-group-orcamento">
                    <label htmlFor="itemClassification">Classificação do Item</label>
                    <select
                      id="itemClassification-orcamento"
                      name="itemClassification"
                      className="form-control-orcamento"
                      value={formData.itemClassification}
                      onChange={handleChange}
                      required
                    >
                      <option value="funcional">Funcional</option>
                      <option value="danificado">Danificado</option>
                      <option value="obsoleto">Obsoleto</option>
                    </select>
                  </div>

                  <div className="form-group-orcamento">
                    <label htmlFor="itemDetails">Detalhes adicionais sobre o item (opcional)</label>
                    <textarea
                    
                      id="itemDetails-orcamento"
                      name="itemDetails"
                      className="form-control-orcamento"
                      value={formData.itemDetails}
                      onChange={handleChange}
                    />
                  </div>
                </fieldset>
              )}

              {/* Passo 4: Estimativa de Orçamento */}
              {currentStep === 4 && (
                <fieldset className='fieldset-orcamento'>
                  <legend className='legend-orcamento'>Escolha a data e horário para a coleta</legend>
                  <div className="form-group-orcamento">
                    <label htmlFor="collectionDate">Data da Coleta</label>
                    <input
                      type="date"
                      id="collectionDate"
                      name="collectionDate"
                      className="form-control-orcamento"
                      value={formData.collectionDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group-orcamento">
                    <label htmlFor="collectionTime">Horário da Coleta</label>
                    <input
                      type="time"
                      id="collectionTime"
                      name="collectionTime"
                      className="form-control-orcamento"
                      value={formData.collectionTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </fieldset>
              )}
                {currentStep === 5 && (
                <fieldset className='fieldset-orcamento'>
                  <legend className='legend-orcamento'>Confirmação do Agendamento</legend>
                  <div className="form-group-orcamento">
                    <label>Nome: {formData.name}</label>
                  </div>
                  <div className="form-group-orcamento">
                    <label>Email: {formData.email}</label>
                  </div>
                  <div className="form-group-orcamento">
                    <label>Telefone: {formData.telefone}</label>
                  </div>
                  <div className="form-group-orcamento">
                    <label>Itens para Coleta: {formData.itemType}</label>
                  </div>
                  <div className="form-group-orcamento">
                    <label>Quantidade: {formData.itemQuantity}</label>
                  </div>
                  <div className="form-group-orcamento">
                    <label>Data da Coleta: {formData.collectionDate}</label>
                  </div>
                  <div className="form-group-orcamento">
                    <label>Horário da Coleta: {formData.collectionTime}</label>
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
                {currentStep <=5 ? (
                  <button type="button" onClick={nextStep}>
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
