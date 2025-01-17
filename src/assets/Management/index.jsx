import React, { useState } from 'react';
import './styles.css';
import show from './olho.png';  // Ícone para mostrar a senha
import hide from './visivel.png'; // Ícone para ocultar a senha
import Sidebar1 from './Sidebar/SidebarManagement';

function App() {
  const [users, setUsers] = useState([]); // Inicializa com um array vazio
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ nome: '', ativo: false, administrador: false, email: '', senha: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddUser = async () => {
    if (newUser.email && newUser.senha && newUser.nome) {
      try {
        const response = await fetch('http://localhost:8080/api/v1/users', {  // Ajuste aqui
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: newUser.nome,
            email: newUser.email,
            senha: newUser.senha,
            admin: newUser.administrador,
            codStatus: newUser.ativo ? "ATIVO" : "INATIVO"
          }),
        });

        if (!response.ok) {
          alert('Erro ao adicionar usuário: ' + response.statusText);
        }

        const data = await response.json();
        setUsers(prevUsers => [...prevUsers, data]);
        resetForm();
      } catch (error) {
        setErrorMessage(error.message);
        alert('Erro ao adicionar usuário:', error);
      }
    }
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setNewUser({ 
      nome: user.nome, 
      ativo: user.codStatus === "ATIVO", 
      administrador: user.admin, 
      email: user.email, 
      senha: '' // Limpa a senha para não mostrar ao editar
    });
  };
  const handleUpdateUser = async () => {
    if (!currentUser || typeof currentUser.id !== 'number') return;
  
    const updatedFields = {};
    
    // Verificar alterações de nome
    if (newUser.nome !== currentUser.nome) {
        updatedFields.nome = newUser.nome;
    }
  
    // Verificar alterações de email
    if (newUser.email && newUser.email !== currentUser.email) {
        updatedFields.email = newUser.email; 
    }
  
    // Verificar se a senha foi preenchida (não comparar com a senha atual por questões de segurança)
    if (newUser.senha) {
        updatedFields.senha = newUser.senha; 
    }
   // Verificar alteração no campo de administrador
   if (typeof newUser.administrador === 'boolean') {
    updatedFields.admin = newUser.administrador;
}
  
    // Atualizar status de ativo/inativo sempre
    updatedFields.codStatus = newUser.ativo ? "ATIVO" : "INATIVO"; 
  
    // Verificar se há campos a serem atualizados
    if (Object.keys(updatedFields).length === 0) {
        alert("Nenhuma alteração detectada.");
        return;
    }
  
    try {
        const response = await fetch(`http://localhost:8080/api/v1/users/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFields),
        });
  
        if (!response.ok) {
            const errorText = await response.text();
            alert(`Erro ao atualizar usuário: ${response.status} - ${errorText}`);
        }
  
        const updatedUser = await response.json();
        setUsers(users.map(user => (user.id === currentUser.id ? updatedUser : user)));
        resetForm();
    } catch (error) {
        setErrorMessage(error.message);
        alert('Erro ao atualizar usuário:', error);
    }
  };
  

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`/api/v1/users/${id}`, { // Ajuste aqui
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      setErrorMessage('Erro ao deletar usuário');
      alert('Erro ao deletar usuário:', error);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setNewUser({ nome: '', ativo: false, administrador: false, email: '', senha: '' });
    setErrorMessage('');
  };

  const filteredUsers = users.filter(user => 
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container"> 
      <div style={{ display: "flex" }}> 
        <Sidebar1 />
      </div>
      
      <h1>Usuários</h1>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Pesquisar Usuários" 
          value={searchTerm} 
          onChange={handleSearch} 
        />
        <button>Pesquisar</button>
      </div>


      <div className="form-container">
        <form 
          onSubmit={(event) => {
            event.preventDefault();
            if (isEditing) {
              handleUpdateUser();
            } else {
              handleAddUser();
            }
          }}
        >
          <h2>{isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>

          <div className="form-row">
            <input 
              className='nome'
              type="text" 
              name="nome" 
              placeholder="Nome do Usuário" 
              value={newUser.nome} 
              onChange={handleInputChange} 
              required
            />

            <input 
              className='email'
              type="email" 
              name="email" 
              placeholder="Email" 
              value={newUser.email} 
              onChange={handleInputChange} 
              required
            />

            <div className="password-container">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="senha" 
                placeholder="Senha" 
                value={newUser.senha} 
                onChange={handleInputChange} 
              />
              <button 
                type="button" 
                onClick={toggleShowPassword} 
                className="toggle-password"
              >
                <img src={showPassword ? hide : show} alt={showPassword ? "Ocultar senha" : "Mostrar senha"} />
              </button>
            </div>

            <label>
              <input className='ativo' 
                type="checkbox" 
                name="ativo" 
                checked={newUser.ativo} 
                onChange={() => setNewUser(prevState => ({ ...prevState, ativo: !prevState.ativo }))} 
              />
              Ativo
            </label>

            <label>
              <input className='adm' 
                type="checkbox" 
                name="administrador" 
                checked={newUser.administrador} 
                onChange={() => setNewUser(prevState => ({ ...prevState, administrador: !prevState.administrador }))} 
              />
              Administrador
            </label>

            <button className='ADD_button' type="submit">
              {isEditing ? 'Atualizar Usuário' : 'Adicionar Usuário'}
            </button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Usuário ativo</th>
              <th>Administrador</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.nome}</td>
                <td>{user.codStatus === "ATIVO" ? 'True' : 'False'}</td>
                <td>{user.admin ? 'True' : 'False'}</td>
                <td>{user.email}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEditUser(user)}>Editar</button>
                  <button className="botaodeletar" onClick={() => handleDeleteUser(user.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
