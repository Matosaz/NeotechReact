import React, { useState, useEffect } from 'react';
import './Calculadora.css';
import { Radio, RadioGroup, FormControlLabel, Checkbox } from '@mui/material';

const Calculadora = () => {
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
        return 'Estimativa de orçamento:';

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted');
  };

  const nextStep = () => {
    if (currentStep < 4){
    setCurrentStep(currentStep + 1);
    console.log('currentStep incrementado para', currentStep + 1);

    }
  };

  const prevStep = () => {
    if (currentStep > 1){
    setCurrentStep(currentStep - 1);
    console.log('currentStep decrementado para', currentStep - 1);

  }
  };

  const updateProgress = () => {
    return (currentStep / 4) * 100;
  };

  const calculateEstimate = () => {
    const { itemType, itemQuantity, itemClassification } = formData;

    if (!itemType || !itemQuantity || !itemClassification) {
      alert('Por favor, preencha todos os campos necessários para calcular a estimativa!');
      return;
    }
  
    // Definir os preços por tipo de item
    const itemPrices = {
      celular: 50,  // preço por unidade
      computador: 100,
      televisao: 150,
      tablet: 75,
    };
  
    // Definir multiplicadores para o estado do item
    const stateMultipliers = {
      funcional: 1.2,
      danificado: 0.5,
      obsoleto: 0.7,
    };
  
    // Recupera o preço base para o tipo de item
    let basePrice = itemPrices[itemType] || 0;
    // Ajusta o preço com base no estado do item
    let priceMultiplier = stateMultipliers[itemClassification] || 1;
  
    // Calcula o preço total
    let estimatedPrice = basePrice * priceMultiplier * itemQuantity;
  
    console.log('Estimativa calculada:', estimatedPrice);

    // Atualiza o estado com a estimativa calculada
    setFormData({ ...formData, estimatedPrice });
  };
  return (
    <section className='body-orcamento'>
  <button onClick={Voltarorcamento} className='voltar-orcamento'>Retornar</button>
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
            <form className="form-orcamento" onSubmit={handleSubmit}>
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
                    <label>Senha</label>
                    <input
                      placeholder="Digite sua senha"
                      id="Password-orcamento"
                      name="Senha"
                      type="password"
                      className="form-control-orcamento"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group-orcamento">
                    <label>Telefone</label>
                    <input
                      placeholder="(99) 9999-9999"
                      id="Numero-orcamento"
                      name="Telefone"
                      type="tel"
                      className="form-control-orcamento"
                      onChange={handleChange}
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
                      id="itemQuantity-orcamento"
                      name="itemQuantity"
                      type="number"
                      className="form-control-orcamento"
                      value={formData.itemQuantity}
                      onChange={handleChange}
                      required
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
    <legend className='legend-orcamento'>Calculadora de orçamento</legend>
  
  {/* Exibe a estimativa calculada */}
<div className="form-group-orcamento">
  <div className='estimatedPrice'>
  <label htmlFor="a">Preço de reciclagem estimado:</label>
  <input
    id="estimatedPrice-orcamento"
    name="estimatedPrice"
    type="text"
    disabled
    className="form-control-orcamento"
    value={formData.estimatedPrice ? `R$ ${formData.estimatedPrice.toFixed(2)}` : 'R$ 0,00'} // Exibe 'R$ 0,00' caso a estimativa seja indefinida
    
  />
   </div>
</div>


    <div className="form-group-orcamento">
      <label htmlFor="itemQuantity">Quantidade</label>
      <input
        id="itemQuantity-orcamento"
        name="itemQuantity"
        type="number"
        className="form-control-orcamento"
        value={formData.itemQuantity}
        onChange={handleChange}
        required
        
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

    {/* Calcula a estimativa quando algum dado for alterado */}
    {formData.itemQuantity && formData.itemType && formData.itemClassification && (
      <div className="form-group-orcamento">
        <button type="button" onClick={calculateEstimate}>
          Calcular Estimativa
        </button>
      </div>
    )}
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
                  <button type="button" onClick={nextStep}>
                    Próximo
                  </button>
                ) : (
                  <button type="submit">Enviar</button>
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
