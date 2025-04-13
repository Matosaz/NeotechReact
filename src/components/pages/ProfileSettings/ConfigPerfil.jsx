import React, { useState, useEffect, useContext, useRef } from "react";
import "./ConfigPerfil.css";
import Sidebar2 from "../../../assets/Management/Sidebar/SidebarUser";
import ProfileAvatar from "../../../assets/camerausericon.png";
import { Input, InputTel, InputCep } from "./MaskedInput";
import { UserContext } from "../../UserContext"; // Importando o UserContext
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';


const ConfigPerfil = () => {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(UserContext); // Usando o contexto para pegar o usuário logado
  const [Cpf, setCpf] = useState(user?.cpf || ""); // Preenchendo com dados existentes, caso haja
  const [telefone, settelefone] = useState(user?.telefone || "");
  const [Cep, setCep] = useState(user?.cep || "");
  const [Endereco, setEndereco] = useState(user?.endereco || "");
  const [Cidade, setCidade] = useState(user?.cidade || "");
  const [Bairro, setBairro] = useState(user?.bairro || "");
  const [selectedState, setSelectedState] = useState(user?.estado || "");
  const [birthDate, setBirthDate] = useState(user?.data_nascimento || "");
  const [dateError, setDateError] = useState('');
  const [states, setStates] = useState([]); // Definindo o estado para armazenar os estados
  const [avatar, setAvatar] = useState(user?.avatar || null); // Imagem armazenada no backend
  const [previewAvatar, setPreviewAvatar] = useState(null); // Pré-visualização local
  useEffect(() => {
    if (user) {
      settelefone(user.telefone || "");
      setCep(user.cep || "");
      setEndereco(user.endereco || "");
      setCidade(user.cidade || "");
      setBairro(user.bairro || "");
      setSelectedState(user.estado || "");
      setBirthDate(user.data_nascimento || "");
      setAvatar(user.avatar || null);
      setCpf(user.cpf || "");

    }
  }, [user]);

  const API_BASE_URL = "https://intellij-neotech.onrender.com/api/v1/users";

  const fetchCepData = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setEndereco(data.logradouro || "");
        setCidade(data.localidade || "");
        setBairro(data.bairro || "");
        setSelectedState(data.uf || "");
      } else {
        setSnackbar({ open: true, message: 'CEP não encontrado.', severity: 'warning' });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };


  // Função para desabilitar datas anteriores
  const shouldDisableDate = (date) => {
    return date.isAfter(dayjs(), 'day');
  };

  const handleSaveChanges = async () => {
    if (!user || !user.id) {
      setSnackbar({
        open: true,
        message: 'Erro: Usuário não encontrado. Por favor, faça login novamente.',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
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

      if (previewAvatar && avatar instanceof File) {
        formData.append("avatar", avatar);
      }

      const response = await fetch(`${API_BASE_URL}/${user.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Falha ao atualizar perfil: ${errorData.message || "Erro desconhecido"}`);
      }

      const newUserData = await response.json();

      setUser((prevUser) => {
        const updatedUser = { ...prevUser, ...newUserData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      });

      setSnackbar({
        open: true,
        message: 'Perfil atualizado com sucesso!',
        severity: 'success',
      });

    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Ocorreu um erro ao salvar as alterações.",
        severity: 'error',
      });
    } finally {
      setLoading(false); // ✅ Finaliza carregamento
    }
  };


  // Função para validar a data de nascimento


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

  useEffect(() => {
    // Ao carregar o componente, verifique se o usuário tem um avatar no banco
    if (user?.avatar) {
      setAvatar(user.avatar); // Carrega a URL ou base64 do backend
    }
  }, [user]);

  const fileInputRef = useRef(null); // Referência para o input

  const handleImageClick = () => {
    fileInputRef.current.click(); // Simula o clique no input
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]; // Formatos permitidos
      if (!allowedTypes.includes(file.type)) {
        setSnackbar({ open: true, message: 'Por favor, selecione uma imagem nos formatos PNG, JPEG ou JPG.', severity: 'warning' });
        return;
      }

      const objectURL = URL.createObjectURL(file);
      setPreviewAvatar(objectURL); // Atualiza a pré-visualização local
      setAvatar(file); // Armazena o arquivo para upload posterior

      // Salva a URL temporária da imagem no localStorage
      localStorage.setItem('previewAvatar', objectURL);
    } else {
      setSnackbar({ open: true, message: 'Por favor, selecione uma imagem válida', severity: 'warning' });
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

  // Função chamada ao alterar o valor do CPF
  const handleCpfChange = (value) => {
    // Remove a máscara, apenas números
    const cleanedCpf = value.replace(/\D/g, "");
    setCpf(cleanedCpf); // Agora o CPF é limpo de caracteres não numéricos
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
              <input className="AvatarInput" type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} />
              <img src={
                previewAvatar ||
                (avatar ? `data:image/png;base64,${avatar}` : ProfileAvatar)
              }

                alt="User" className="profile-avatar" onClick={handleImageClick} />
              <img className="EditAvatarPic" alt="svgImg" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIzODRweCIgaGVpZ2h0PSIzODRweCI+ICAgIDxwYXRoIGQ9Ik0gMTggMiBMIDE1LjU4NTkzOCA0LjQxNDA2MjUgTCAxOS41ODU5MzggOC40MTQwNjI1IEwgMjIgNiBMIDE4IDIgeiBNIDE0LjA3NjE3MiA1LjkyMzgyODEgTCAzIDE3IEwgMyAyMSBMIDcgMjEgTCAxOC4wNzYxNzIgOS45MjM4MjgxIEwgMTQuMDc2MTcyIDUuOTIzODI4MSB6Ii8+PC9zdmc+" />
              <div className="profile-details">
                <h2>{user?.nome || "Nome do Usuário"}</h2>
                <p>{user?.email || "Email do Usuário"}</p>

              </div>
            </div>
            <form className="profile-form">
              {/* Campos do formulário */}
              <div className="profile-form-group">
                <label>Nome completo</label>
                <input
                  type="text"
                  value={user?.nome}
                  required
                  minLength="3"
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div className="profile-form-group">
                <label>Telefone</label>
                <InputTel
                  value={telefone}
                  onChange={(event) => settelefone(event.target.value)}
                  required
                  pattern="^\(\d{2}\)\s\d{4,5}-\d{4}$" // Validação para o formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
                  title="Telefone deve estar no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX"
                />
              </div>
              <div className="profile-form-group">
                <label>Gênero</label>
                <select required>
                  <option value="">Selecione seu gênero</option>
                  <option>Masculino</option>
                  <option>Feminino</option>
                  <option>Não-binário</option>
                  <option>Prefiro não informar</option>
                </select>
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <div className="profile-form-group">
                  <label>Data de Nascimento</label>
                  <DesktopDatePicker
                    value={birthDate ? dayjs(birthDate) : null}
                    onChange={(newValue) => setBirthDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
                    shouldDisableDate={shouldDisableDate}
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!dateError}
                        helperText={dateError}
                        required
                      />
                    )}
                  />
                </div>
              </LocalizationProvider>
              <div className="profile-form-group">
                <label>CPF</label>
                <Input
                  value={Cpf}
                  onChange={(event) => handleCpfChange(event.target.value)}
                  required
                  pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" // Validação para o formato XXX.XXX.XXX-XX
                  title="CPF deve estar no formato XXX.XXX.XXX-XX"
                />
              </div>
              <div className="profile-form-group">
                <label>CEP</label>
                <InputCep
                  value={Cep}
                  onChange={(event) => handleCepChange(event.target.value)}
                  required
                  pattern="\d{5}-\d{3}" // Validação para o formato XXXXX-XXX
                  title="CEP deve estar no formato XXXXX-XXX"
                />
              </div>
              <div className="profile-form-group">
                <label>Endereço</label>
                <input
                  type="text"
                  placeholder="Logradouro"
                  value={Endereco}
                  onChange={(event) => setEndereco(event.target.value)}
                  required
                />
              </div>
              <div className="profile-form-group">
                <label>Bairro</label>
                <input
                  type="text"
                  placeholder="Bairro"
                  value={Bairro}
                  onChange={(event) => setBairro(event.target.value)}
                  required
                />
              </div>
              <div className="profile-form-group">
                <label>Cidade</label>
                <input
                  type="text"
                  placeholder="Cidade"
                  value={Cidade}
                  onChange={(event) => setCidade(event.target.value)}
                  required
                />
              </div>
              <div className="profile-form-group">
                <label>Estado</label>
                <select
                  value={selectedState}
                  onChange={(event) => setSelectedState(event.target.value)}
                  required
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
              <button
                className="profile-salvar-alteracoes"
                disabled={loading}
                onClick={handleSaveChanges}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} style={{ color: '#fff' }} />
                    Salvando...
                  </>
                ) : (
                  'Salvar alterações'
                )}
              </button>
            </section>
          </section>
        </main>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>

    </div>
  );
};

export default ConfigPerfil;
