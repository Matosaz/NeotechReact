import React, { useState } from 'react';
import './styles.css';
import show from './olho.png';  // Ícone para mostrar a senha
import hide from './visivel.png'; // Ícone para ocultar a senha
import Sidebar1 from './Sidebar/SidebarManagement';
const initialUsersData = [
  {
    nome: 'Rodrigo Salomão',
    ativo: true,
    administrador: false,
    email: 'rodrigosalomao2001@gmail.com',
    senha: 'batatacomlimao'
  },
  


];

function App() {
  const [users, setUsers] = useState(initialUsersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ nome: '', ativo: false, administrador: false, email: '', senha: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Controle de exibição da senha

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    if (newUser.email && newUser.senha && newUser.nome) {
      setUsers([...users, { ...newUser, id: users.length + 1 }]);
      resetForm();
    }
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setNewUser(user);
  };

  const handleUpdateUser = () => {
    setUsers(users.map(user => (user.id === currentUser.id ? { ...newUser, id: currentUser.id } : user)));
    resetForm();
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setNewUser({ nome: '', ativo: false, administrador: false, email: '', senha: '' });
  };

  const filteredUsers = users.filter(user => 
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Alterna entre mostrar e ocultar a senha
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

      {/* Formulário para Adicionar/Editar Usuários */}
      <div className="form-container">
        
      <form 
      
  onSubmit={(event) => {
    event.preventDefault(); // Impede o comportamento padrão de envio
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
        required
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
        onChange={() => setNewUser({ ...newUser, ativo: !newUser.ativo })} 
      />
      Ativo
    </label>

    <label>
      <input className='adm' 
        type="checkbox" 
        name="administrador" 
        checked={newUser.administrador} 
        onChange={() => setNewUser({ ...newUser, administrador: !newUser.administrador })} 
      />
      Administrador
    </label>

    <button className='ADD_button' type="submit">
      {isEditing ? 'Atualizar Usuário' : 'Adicionar Usuário'}
    </button>
  </div>
</form>

      </div>

      {/* Tabela de Usuários */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Usuário ativo</th>
              <th>Administrador</th>
              <th>Email</th>
              <th>Senha</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.nome}</td>
                <td>{user.ativo ? 'True' : 'False'}</td>
                <td>{user.administrador ? 'True' : 'False'}</td>
                <td>{user.email}</td>
                <td>{user.senha}</td>
          
                <td className="action-buttons">
                  <button onClick={() => handleEditUser(user)}>Editar</button>
                  <button className="botaodeletar"onClick={() => handleDeleteUser(user.id)}>Excluir</button>
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
