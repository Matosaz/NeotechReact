import React, { useState, useEffect, useContext, useRef } from "react";
import "./ConfigPerfil.css";
import Sidebar2 from "../../../assets/Management/Sidebar/SidebarManagement";
import ProfileAvatar from "../../../assets/camerausericon.png";
import { Input, InputTel, InputCep } from "./MaskedInput";
import { UserContext } from "../../UserContext"; // Importando o UserContext

const ConfigPerfil = () => {
  const {user, setUser } = useContext(UserContext); // Usando o contexto para pegar o usuário logado
  const [Cpf, setCpf] = useState(user?.cpf || ""); // Preenchendo com dados existentes, caso haja
  const [telefone, settelefone] = useState(user?.telefone || "");
  const [Cep, setCep] = useState(user?.cep || "");
  const [Endereco, setEndereco] = useState(user?.endereco || "");
  const [Cidade, setCidade] = useState(user?.cidade || "");
  const [Bairro, setBairro] = useState(user?.bairro || "");
  const [selectedState, setSelectedState] = useState(user?.estado || "");
  const [birthDate, setBirthDate] = useState(user?.data_nascimento || "");

  const [states, setStates] = useState([]); // Definindo o estado para armazenar os estados
  const [avatar, setAvatar] = useState(user?.avatar || null); // Imagem armazenada no backend
  const [previewAvatar, setPreviewAvatar] = useState(null); // Pré-visualização local



  const handleSaveChanges = async () => {

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

      const formData = new FormData();
    formData.append("data", JSON.stringify(updatedUser));
    if (previewAvatar) {
        formData.append("avatar", avatar);
    }
   // Convertendo para número inteiro no frontend
      const response = await fetch(`http://localhost:8080/api/v1/users/${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json(); // Captura o erro detalhado
        throw new Error(`Falha ao atualizar perfil: ${errorData.message || 'Erro desconhecido'}`);
      }
      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData);
        localStorage.removeItem("previewAvatar"); // Limpa o localStorage
        alert("Perfil atualizado com sucesso!");
      } 
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao salvar as alterações.");
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
    const savedPreviewAvatar = localStorage.getItem("previewAvatar");
    if (savedPreviewAvatar) {
      URL.revokeObjectURL(savedPreviewAvatar);
      localStorage.removeItem("previewAvatar");
    }

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




  const fileInputRef = useRef(null); // Referência para o input

const handleImageClick = () => {
  fileInputRef.current.click(); // Simula o clique no input
};



const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) { const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]; // Formatos permitidos
    if (!allowedTypes.includes(file.type)) {
      alert("Por favor, selecione uma imagem nos formatos PNG, JPEG ou JPG.");
      return;
    }
    
    const objectURL = URL.createObjectURL(file);
    console.log("URL gerada:", objectURL); // Verifique se a URL está sendo gerada corretamente
    setPreviewAvatar(objectURL); // Atualiza a pré-visualização local
    setAvatar(file); // Armazena o arquivo para upload posterior

    // Salva a URL temporária da imagem no localStorage
    localStorage.setItem('previewAvatar', objectURL);
  } else {
    alert('Por favor, selecione uma imagem válida.');
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

  const handleCpfChange = (value) => {
    // Remove a máscara, apenas números
    const cleanedCpf = value.replace(/\D/g, "");
    setCpf(cleanedCpf); // Agora o CPF é limpo de caracteres não numéricos
    if (cleanedCpf.length === 11) {
      fetchCepData(cleanedCpf);
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
            <input className="AvatarInput" type="file" accept="image/*"  ref={fileInputRef} onChange={handleAvatarChange}/>
              <img  src={
                previewAvatar ||
               (avatar ? `data:image/png;base64,${avatar}` : ProfileAvatar) 
                }

              alt="User" className="profile-avatar" onClick={handleImageClick} />
              <img className="EditAvatarPic"alt="svgImg" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIzODRweCIgaGVpZ2h0PSIzODRweCI+ICAgIDxwYXRoIGQ9Ik0gMTggMiBMIDE1LjU4NTkzOCA0LjQxNDA2MjUgTCAxOS41ODU5MzggOC40MTQwNjI1IEwgMjIgNiBMIDE4IDIgeiBNIDE0LjA3NjE3MiA1LjkyMzgyODEgTCAzIDE3IEwgMyAyMSBMIDcgMjEgTCAxOC4wNzYxNzIgOS45MjM4MjgxIEwgMTQuMDc2MTcyIDUuOTIzODI4MSB6Ii8+PC9zdmc+"/>
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
                  onChange={(event) => handleCpfChange(event.target.value)}
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
