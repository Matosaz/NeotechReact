import React, { useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import './UserManagement.css';
import NeotechLogo from '../Logo7png.png'
import Sidebar1 from './Sidebar/SidebarManagement';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import jsPDF from 'jspdf';
import CircularProgress from '@mui/material/CircularProgress';
import 'jspdf-autotable';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Checkbox, FormControlLabel, FormGroup, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';  // Importando Checkbox do MUI
import { styled } from '@mui/material/styles';
import PrintIcon from '@mui/icons-material/Print';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ProfileAvatar from "../camerausericon.png";
import { Search } from 'lucide-react';

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  '&.Mui-checked': {
    color: theme.palette.success.main,
  },
  '&.MuiCheckbox-root': {
    color: theme.palette.text.secondary,
  },
}));

function UserManagement() {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ nome: '', ativo: false, administrador: false, email: '', senha: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const API_BASE_URL = "https://intellij-neotech.onrender.com/api/v1/users";
  const [avatar, setAvatar] = useState(users?.avatar || null); // Imagem armazenada no backend

  const generatePDF = () => {
    setLoadingPDF(true);

    const doc = new jsPDF();
    const img = new Image();
    img.src = NeotechLogo; // Caminho correto para a imagem importada

    img.onload = function () {
      const pageWidth = doc.internal.pageSize.width;

      const imgWidth = 30;
      const imgHeight = (img.height / img.width) * imgWidth;

      const imgX = (pageWidth - imgWidth) / 2;
      doc.addImage(img, 'PNG', imgX, 10, imgWidth, imgHeight);

      doc.setTextColor(47, 124, 55)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('Relatório de Usuários', pageWidth / 2, imgHeight + 20, { align: 'center' });

      doc.setTextColor(18, 54, 21);
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'italic');
      doc.text(`Gerado em: ${new Date().toLocaleString()}`, pageWidth / 2, imgHeight + 30, { align: 'center' });

      // Configuração da tabela
      const tableColumn = ['ID', 'Nome', 'Email', 'Status', 'Administrador'];
      const tableRows = users.map(user => [
        user.id,
        user.nome,
        user.email,
        user.codStatus,
        user.admin ? 'Sim' : 'Não',
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: imgHeight + 38,
        headStyles: { fillColor: [127, 192, 141], textColor: 255 },
        bodyStyles: { fontSize: 10 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        didDrawPage: function (data) {
          const str = `Página ${doc.internal.getNumberOfPages()}`;
          doc.setFontSize(8);
          const pageHeight = doc.internal.pageSize.height;
          doc.text(str, pageWidth / 2, pageHeight - 10, { align: 'center' });
        },
      });

      // Espaço para assinatura no final da página
      const pageHeight = doc.internal.pageSize.height;
      doc.line((pageWidth - 180) / 2, pageHeight - 20, (pageWidth + 180) / 2, pageHeight - 20);
      doc.text('Neotech', pageWidth / 2, pageHeight - 15, { align: 'center' });

      // Salvar PDF

      doc.save('relatorio_usuarios.pdf');
      setLoadingPDF(false);  // Finaliza o carregamento do PDF após o download

    };

    img.onerror = function () {
      setSnackbar({ open: true, message: 'Erro ao carregar o logotipo do PDF.', severity: 'error' });
      setLoadingPDF(false);

    };
  };
  const [isLoading, setIsLoading] = useState(true);
  const [loadingUserSubmit, setLoadingUserSubmit] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);

  useEffect(() => {
    fetch(API_BASE_URL)
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar usuários:', error);
        setIsLoading(false);
      });
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
      setLoadingUserSubmit(true);

      try {
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
          setSnackbar({ open: true, message: 'Erro ao adicionar o usuário:.' + response.statusText, severity: 'error' });
          return;
        }

        const data = await response.json();
        setUsers(prevUsers => [...prevUsers, data]);
        setSnackbar({ open: true, message: 'Usuário adicionado com sucesso!', severity: 'success' });
        resetForm();
      } catch (error) {

        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao adicionar o usuário';
        setSnackbar({ open: true, message: `Erro ao adicionar o usuário: ${errorMessage}`, severity: 'error' });

      } finally {
        setLoadingUserSubmit(false);
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
    setLoadingUserSubmit(true);

    const formData = new FormData();
    formData.append("data", JSON.stringify({
      nome: newUser.nome,
      email: newUser.email,
      admin: newUser.administrador,
      codStatus: newUser.ativo ? "ATIVO" : "INATIVO",
      senha: newUser.senha || ""
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/${currentUser.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        setSnackbar({ open: true, message: 'Erro ao atualizar o usuário:.' + response.statusText, severity: 'error' });
        return;
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => (user.id === currentUser.id ? updatedUser : user)));
      setSnackbar({ open: true, message: 'Usuário atualizado com sucesso!', severity: 'success' });
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar o usuário';
      setSnackbar({ open: true, message: `Erro ao atualizar o usuário: ${errorMessage}`, severity: 'error' });

    } finally {
      setLoadingUserSubmit(false);
    }
  };


  const handleOpenDeleteDialog = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  // Função para fechar o modal de confirmação
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Função para confirmar a exclusão
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await fetch(`${API_BASE_URL}/${userToDelete}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== userToDelete));
      setSnackbar({ open: true, message: 'Usuário excluído com sucesso!', severity: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao deletar o usuário';
      setSnackbar({ open: true, message: `Erro ao deletar o usuário: ${errorMessage}`, severity: 'error' });
    } finally {
      handleCloseDeleteDialog();
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
      accessorKey: 'avatar',
      header: 'Foto',
      size: 60,
      Cell: ({ row }) => {
        const avatar = row.original.avatar;
        const nome = row.original.nome;

        const imageSrc = avatar
          ? `data:image/png;base64,${avatar}`
          : ProfileAvatar;

        return (
          <img
            src={imageSrc}
            alt={`Avatar de ${nome}`}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '0.5px solid #e3e3e3'
            }}
          />
        );
      }
    },
    {
      accessorKey: 'nome',
      header: 'Usuário',
      headerStyle: { color: '#3498db', fontWeight: 'bold', textAlign: 'center' },
      cellStyle: { color: '#3498db', textAlign: 'center', fontSize: '16px' }
    },
    {
      accessorKey: 'codStatus',
      header: 'Status',
      Cell: ({ cell }) => {
        const status = cell.getValue();
        const isActive = status === 'ATIVO';
    
        return (
          <span
            style={{
              backgroundColor: isActive ? '#C8E6C9' : '#FFCDD2',
              color: isActive ? '#2e7d32' : '#c62828',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'inline-block',
              minWidth: '60px',
              textAlign: 'center'
            }}
          >
            {isActive ? 'Ativo' : 'Inativo'}
          </span>
        );
      },
      headerClassName: 'column-status-header',
      cellClassName: 'column-status-cell',
    },
    
   {
  accessorKey: 'admin',
  header: 'Administrador',
  Cell: ({ cell }) => {
    const isAdmin = cell.getValue();
    const color = isAdmin ? '#C8E6C9' : '#FFCDD2'; // Verde ou Vermelho
    const label = isAdmin ? 'Sim' : 'Não';

    return (
      <span
        style={{
          backgroundColor: color,
          color: isAdmin? '#2e7d32' : '#c62828',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: '600',
          display: 'inline-block',
          textAlign: 'center',
          minWidth: '60px',
        }}
      >
        {label}
      </span>
    );
  }
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
            <IconButton color="error" onClick={() => handleOpenDeleteDialog(row.original.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <div className='bodyManagement'>
      <div className="container-management">
        <Sidebar1 />

        {/* Modal de confirmação para exclusão */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: '15px',
              padding: 2,
              backgroundColor: '#f9f9f9', // ajuste conforme sua paleta
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              fontWeight: 'bold',
              color: '#2f7c37', // cor que remete ao verde da identidade visual
              fontSize: '20px'
            }}
          >
            {"Confirmar exclusão"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              sx={{ fontSize: '16px', color: '#333' }}
            >
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDeleteDialog}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                color: '#2f7c37',
                borderColor: '#2f7c37',
                '&:hover': {
                  backgroundColor: '#e8f5e9',
                  borderColor: '#2f7c37',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              autoFocus
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        <h1 className='titleManag'>Gerenciar usuários</h1>
        <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '410px' }}>
  <input
    type="text"
    placeholder="Pesquisar Usuários"
    value={searchTerm}
    onChange={handleSearch}
    style={{
      width: '100%',
      padding: '10px 12px',
      borderRadius: '10px',
      fontSize: '14px'
    }}
  />
  <Search
    size={20}
    style={{
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#999',
      pointerEvents: 'none'
    }}
  />
</div>



        <div className="form-container">
          <form onSubmit={(event) => {
            event.preventDefault();
            if (isEditing) {
              handleUpdateUser();
            } else {
              handleAddUser();
            }
          }}>
            <h2>{isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
            <div className="form-row">
              <input className='nome' type="text" name="nome" placeholder="Nome do Usuário" value={newUser.nome} onChange={handleInputChange} required />
              <input className='email' type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleInputChange} required />
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  name="senha"
                  placeholder="Senha"
                  value={newUser.senha}
                  onChange={handleInputChange}
                />
                <IconButton
                  onClick={toggleShowPassword}
                  className="toggle-password"
                  edge="start"
                  size="small"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </div>
              <FormGroup row sx={{
                marginLeft: "-40px",
                display: "flex",
                flexWrap: "nowrap", // impede quebra de linha
                gap: "20px", // espaçamento entre os itens
                alignItems: "center",
              }}>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newUser.ativo}
                      onChange={() => setNewUser(prevState => ({ ...prevState, ativo: !prevState.ativo }))}
                      sx={{
                        '&.Mui-checked': {
                          color: '#5faa84', // Cor do checkbox selecionado
                        },
                      }}
                    />
                  }
                  label="Ativo"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      className='checkbox'
                      checked={newUser.administrador}
                      onChange={() => setNewUser(prevState => ({ ...prevState, administrador: !prevState.administrador }))}
                      sx={{
                        '&.Mui-checked': {
                          color: '#5faa84', // Cor do checkbox selecionado
                        },
                      }}
                    />
                  }
                  label="Administrador"
                />
              </FormGroup>

              <button className='ADD_button' type="submit" disabled={loadingUserSubmit}>
                {loadingUserSubmit ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  isEditing ? 'Atualizar Usuário' : 'Adicionar Usuário'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="table-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando dados...</p>
          </div>
        ) :  (
            <MaterialReactTable
              columns={columns}
              data={filteredUsers}
              initialState={{ pagination: { pageSize: 5 } }}
              muiTablePaginationProps={{
                rowsPerPageOptions: [5, 10, 20],
              }}
            />
          )}
        </div>

        <button onClick={generatePDF} className="generate-pdf-button" disabled={loadingPDF}>
          {loadingPDF ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              <PrintIcon sx={{ marginRight: "8px" }} />
              Gerar Relatório
            </>
          )}
        </button>

        <Snackbar
          open={snackbar.open}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default UserManagement;
