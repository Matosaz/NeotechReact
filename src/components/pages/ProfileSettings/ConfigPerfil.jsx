import React, { useState, useEffect, useContext } from "react";
import "./ConfigPerfil.css";
import Sidebar2 from "../../../assets/Management/Sidebar/SidebarManagement";
import ProfileAvatar from "../../../assets/camerausericon.png";
import { Input, InputTel, InputCep } from "./MaskedInput";
import { UserContext } from "../../UserContext"; // Importando o UserContext

const ConfigPerfil = () => {
  const { user, setUser } = useContext(UserContext); // Usando o contexto para pegar o usuário logado
  const [Cpf, setCpf] = useState(user?.cpf || ""); // Preenchendo com dados existentes, caso haja
  const [telefone, settelefone] = useState(user?.telefone || "");
  const [Cep, setCep] = useState(user?.cep || "");
  const [Endereco, setEndereco] = useState(user?.endereco || "");
  const [Cidade, setCidade] = useState(user?.cidade || "");
  const [Bairro, setBairro] = useState(user?.bairro || "");
  const [selectedState, setSelectedState] = useState(user?.estado || "");
  const [birthDate, setBirthDate] = useState(user?.data_nascimento || "");

  const [states, setStates] = useState([]); // Definindo o estado para armazenar os estados

  const handleSaveChanges = async () => {
    if (!user || !user?.id) {
      alert("Usuário ou ID não encontrado.");
      console.log("Id do usuário:"+user?.id)
      return;
    }
    if (!user) {
      return <p>Carregando dados do usuário...</p>;
    }

    const updatedUser = {
      cpf: Cpf,
      telefone: telefone,
      cep: Cep,
      endereco: Endereco,
      cidade: Cidade,
      bairro: Bairro,
      estado: selectedState,
      data_nascimento: birthDate,
    };

    try {
   
    
      const response = await fetch(`http://localhost:8080/api/v1/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),

      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar perfil');
      }

      const updatedData = await response.json();
      setUser(updatedData); // Atualizando o estado do contexto com os novos dados
      alert('Perfil atualizado com sucesso');
    } catch (error) {
      alert(error.message);
    }
  };

  const currentDate = new Date().toISOString().split("T")[0]; // Pega a data atual no formato yyyy-mm-dd

  // Função para validar a data de nascimento
  const handleBirthDateChange = (event) => {
    const value = event.target.value;
    if (value > currentDate) {
      setBirthDate(currentDate);
    } else {
      setBirthDate(value);
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        const data = await response.json();
        const statesFormatted = data.map((state) => ({
          name: state.nome,
          code: state.sigla,
        }));
        statesFormatted.sort((a, b) => a.name.localeCompare(b.name));
        setStates(statesFormatted); // Atualizando o estado de 'states'
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };

    fetchStates();
  }, []); // Carrega os estados apenas uma vez

  // Função para buscar dados pelo CEP
  const fetchCepData = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setEndereco(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setSelectedState(data.uf || "");
      } else {
        alert("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar informações do CEP:", error);
    }
  };

  // Função chamada ao alterar o valor do CEP
  const handleCepChange = (value) => {
    // Remove a máscara, apenas números
    const cleanedCep = value.replace(/\D/g, "");
    setCep(value);
    if (cleanedCep.length === 8) {
      fetchCepData(cleanedCep);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div style={{ display: "flex" }}>
          <Sidebar2 />
        </div>
        <main className="profile-main">
          <section className="profile-info">
            <div className="profile-card">
              <img src={ProfileAvatar} alt="User" className="profile-avatar" />
              <div className="profile-details">
                <h2>{user?.nome || "Nome do Usuário"}</h2>
                <p>{user?.email || "Email do Usuário"}</p>
              </div>
            </div>
            <form className="profile-form">
              {/* Campos do formulário */}
              <div className="profile-form-group">
                <label>Nome completo</label>
                <input type="text" value={user?.nome} readOnly />
              </div>
              <div className="profile-form-group">
                <label>Telefone</label>
                <InputTel
                  value={telefone}
                  onChange={(event) => settelefone(event.target.value)}
                />
              </div>
              <div className="profile-form-group">
                <label>Gênero</label>
                <select>
                  <option>Masculino</option>
                  <option>Feminino</option>
                  <option>Não-binário</option>
                  <option>Prefiro não informar</option>
                </select>
              </div>
              <div className="profile-form-group">
                <label>Data de nascimento</label>
                <input type="date" value={birthDate} onChange={handleBirthDateChange} max={currentDate} />
              </div>
              <div className="profile-form-group">
                <label>CPF</label>
                <Input
                  value={Cpf}
                  onChange={(event) => setCpf(event.target.value)}
                />
              </div>
              <div className="profile-form-group">
                <label>CEP</label>
                <InputCep
                  value={Cep}
                  onChange={(event) => handleCepChange(event.target.value)}
                />
              </div>
              <div className="profile-form-group">
                <label>Endereço</label>
                <input
                  type="text"
                  placeholder="Logradouro"
                  value={Endereco}
                  onChange={(event) => setEndereco(event.target.value)}
                />
              </div>
              <div className="profile-form-group">
                <label>Bairro</label>
                <input
                  type="text"
                  placeholder="Bairro"
                  value={Bairro}
                  onChange={(event) => setBairro(event.target.value)}
                />
              </div>
              <div className="profile-form-group">
                <label>Cidade</label>
                <input
                  type="text"
                  placeholder="Cidade"
                  value={Cidade}
                  onChange={(event) => setCidade(event.target.value)}
                />
              </div>
              <div className="profile-form-group">
                <label>Estado</label>
                <select
                  value={selectedState}
                  onChange={(event) => setSelectedState(event.target.value)}
                >
                  <option value="">Selecione um estado</option>
                  {states.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            <section className="profile-email-section">
              <h3>My email Address</h3>
              <p>
                <span className="profile-email-address">{user?.email || "Email não disponível"}</span>
                <span className="profile-email-age">1 mês atrás</span>
              </p>
              <button className="profile-salvar-alteracoes" onClick={handleSaveChanges}>
                Salvar alterações
              </button>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ConfigPerfil;
