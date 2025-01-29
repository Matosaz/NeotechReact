import React, { useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import './styles.css';
import show from './olho.png';
import hide from './visivel.png';
import Sidebar1 from './Sidebar/SidebarManagement';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ nome: '', ativo: false, administrador: false, email: '', senha: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Erro ao buscar usuários:', error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredUsers = users.filter(user => 
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
        const response = await fetch('http://localhost:8080/api/v1/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Especifica o tipo de conteúdo correto
          },
          body: JSON.stringify({
            nome: newUser.nome,
            email: newUser.email,
            senha: newUser.senha,
            admin: newUser.administrador,
            codStatus: newUser.ativo ? 'ATIVO' : 'INATIVO'
          }),
        });

        if (!response.ok) {
          alert('Erro ao adicionar usuário: ' + response.statusText);
          return;
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
      ativo: user.codStatus === 'ATIVO',
      administrador: user.admin,
      email: user.email,
      senha: user.senha
    });
  };
  const handleUpdateUser = async () => {
    if (!currentUser || typeof currentUser.id !== 'number') return;
  
    const formData = new FormData();
    formData.append("data", JSON.stringify({
      nome: newUser.nome,
      email: newUser.email,
      admin: newUser.administrador,
      codStatus: newUser.ativo ? "ATIVO" : "INATIVO",
      senha: newUser.senha || ""
    }));
  
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/${currentUser.id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        alert('Erro ao atualizar usuário: ' + response.statusText);
        return;
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
      await fetch(`http://localhost:8080/api/v1/users/${id}`, {
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

  const columns = [
    { 
      accessorKey: 'nome', 
      header: 'Usuário',
      headerStyle: { color: '#3498db', fontWeight: 'bold', textAlign: 'center' },
      cellStyle: { color: '#3498db', textAlign: 'center', fontSize: '16px' }
    },
    { 
      accessorKey: 'codStatus', 
      header: 'Status', 
      cell: ({ cell }) => (cell.getValue() === 'Ativo' ? 'Ativo' : 'Inativo'),
      headerClassName: 'column-status-header',
      cellClassName: 'column-status-cell',
    },
    { 
      accessorKey: 'admin', 
      header: 'Administrador', 
      Cell: ({ cell }) => (cell.getValue() ? 'True' : 'False'),
      headerClassName: 'column-administrador-header',
      cellClassName: 'column-administrador-cell',
    },
    { accessorKey: 'email', header: 'Email' },
    {
      header: 'Ações',
      Cell: ({ row }) => (
        <div className="action-buttons">
          <Tooltip title="Editar">
            <IconButton onClick={() => handleEditUser(row.original)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton color="error" onClick={() => handleDeleteUser(row.original.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <div className="container"> 
      <Sidebar1 />
      
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
        <form onSubmit={(event) => { event.preventDefault(); 
          if (isEditing){
            handleUpdateUser();
          }else{
            handleAddUser();
          }
        }}>
          <h2>{isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
          <div className="form-row">
            <input className='nome' type="text" name="nome" placeholder="Nome do Usuário" value={newUser.nome} onChange={handleInputChange} required />
            <input className='email' type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleInputChange} required />
            <div className="password-container">
              <input type={showPassword ? 'text' : 'password'} autoComplete='current-password' name="senha" placeholder="Senha" value={newUser.senha} onChange={handleInputChange} />
              <button type="button" onClick={toggleShowPassword} className="toggle-password">
                <img src={showPassword ? hide : show} alt={showPassword ? "Ocultar senha" : "Mostrar senha"} />
              </button>
            </div>
            <label>
              <input className='ativo' type="checkbox" name="ativo" checked={newUser.ativo} onChange={() => setNewUser(prevState => ({ ...prevState, ativo: !prevState.ativo }))} /> Ativo
            </label>
            <label>
              <input className='adm' type="checkbox" name="administrador" checked={newUser.administrador} onChange={() => setNewUser(prevState => ({ ...prevState, administrador: !prevState.administrador }))} /> Administrador
            </label>
            <button className='ADD_button' type="submit">{isEditing ? 'Atualizar Usuário' : 'Adicionar Usuário'}</button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <MaterialReactTable columns={columns} data={filteredUsers} />
      </div>
    </div>
  );
}

export default App;
