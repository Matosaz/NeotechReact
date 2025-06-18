import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import './UserManagement.css';
import NeotechLogo from "../../../../assets/Logo7png.png"
import Sidebar1 from '../Sidebar/SidebarManagement';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import jsPDF from 'jspdf';
import CircularProgress from '@mui/material/CircularProgress';
import 'jspdf-autotable';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Checkbox, FormControlLabel, FormGroup, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Tabs, Tab, Box, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import PrintIcon from '@mui/icons-material/Print';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ProfileAvatar from "../../../../assets/camerausericon.png";
import { Search, RefreshCw, UserPlus, FileText } from 'lucide-react';
import Typography from '@mui/material/Typography';

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
    img.src = NeotechLogo;

    img.onload = function () {
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Adicionar fundo sutil
      doc.setFillColor(250, 250, 250);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Adicionar borda decorativa
      doc.setDrawColor(127, 192, 141);
      doc.setLineWidth(0.5);
      doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

      // Adicionar logo
      const imgWidth = 30;
      const imgHeight = (img.height / img.width) * imgWidth;
      const imgX = (pageWidth - imgWidth) / 2;
      doc.addImage(img, 'PNG', imgX, 10, imgWidth, imgHeight);

      // Título do relatório
      doc.setTextColor(47, 124, 55);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('Relatório de Usuários', pageWidth / 2, imgHeight + 20, { align: 'center' });

      // Data de geração
      const dataAtual = new Date().toLocaleString();
      doc.setTextColor(18, 54, 21);
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'italic');
      doc.text(`Gerado em: ${dataAtual}`, pageWidth / 2, imgHeight + 30, { align: 'center' });

      // Informações do relatório
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Total de usuários: ${users.length}`, 14, imgHeight + 40);
      
      const usuariosAtivos = users.filter(user => user.codStatus === 'ATIVO').length;
      const usuariosAdmins = users.filter(user => user.admin).length;
      
      doc.text(`Usuários ativos: ${usuariosAtivos}`, 14, imgHeight + 46);
      doc.text(`Administradores: ${usuariosAdmins}`, 14, imgHeight + 52);

      // Configuração da tabela
      const tableColumn = ['ID', 'Nome', 'Email', 'Status', 'Administrador'];
      const tableRows = users.map(user => [
        user.id,
        user.nome,
        user.email,
        user.codStatus === 'ATIVO' ? 'Ativo' : 'Inativo',
        user.admin ? 'Sim' : 'Não',
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: imgHeight + 60,
        headStyles: { 
          fillColor: [95, 170, 132], 
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: { 
          fontSize: 10,
          cellPadding: 3
        },
        alternateRowStyles: { 
          fillColor: [240, 250, 240] 
        },
        columnStyles: {
          0: { cellWidth: 20 },
          2: { cellWidth: 'auto' },
          3: { halign: 'center' },
          4: { halign: 'center' }
        },
        didDrawPage: function (data) {
          // Adicionar cabeçalho em cada página
          if (data.pageNumber > 1) {
            doc.setFillColor(250, 250, 250);
            doc.rect(0, 0, pageWidth, 20, 'F');
            doc.setDrawColor(127, 192, 141);
            doc.setLineWidth(0.5);
            doc.line(0, 20, pageWidth, 20);
            
            doc.setTextColor(47, 124, 55);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(12);
            doc.text('Relatório de Usuários', pageWidth / 2, 15, { align: 'center' });
          }
          
          // Adicionar rodapé em cada página
          const str = `Página ${data.pageNumber} de ${doc.internal.getNumberOfPages()}`;
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(str, pageWidth / 2, pageHeight - 10, { align: 'center' });
          
          // Adicionar data no rodapé
          doc.text(dataAtual, pageWidth - 15, pageHeight - 10, { align: 'right' });
        },
        margin: { top: 25, bottom: 25 }
      });

      // Espaço para assinatura no final da página
      const finalY = doc.lastAutoTable.finalY + 20;
      
      if (finalY < pageHeight - 40) {
        doc.line((pageWidth - 180) / 2, finalY, (pageWidth + 180) / 2, finalY);
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text('Neotech', pageWidth / 2, finalY + 5, { align: 'center' });
        doc.setFontSize(8);
        doc.text('Documento gerado automaticamente pelo sistema', pageWidth / 2, finalY + 12, { align: 'center' });
      }

      // Salvar PDF com nome personalizado incluindo a data
      const dataFormatada = new Date().toISOString().split('T')[0];
      doc.save(`relatorio_usuarios_${dataFormatada}.pdf`);
      
      setSnackbar({ open: true, message: 'Relatório gerado com sucesso!', severity: 'success' });
      setLoadingPDF(false);
    };

    img.onerror = function () {
      setSnackbar({ open: true, message: 'Erro ao carregar o logotipo do PDF.', severity: 'error' });
      setLoadingPDF(false);
    };
  };
  const [isLoading, setIsLoading] = useState(true);
  const [loadingUserSubmit, setLoadingUserSubmit] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const refreshData = () => {
    setIsRefreshing(true);
    fetch(API_BASE_URL)
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setSnackbar({ open: true, message: 'Dados atualizados com sucesso!', severity: 'success' });
      })
      .catch(error => {
        console.error('Erro ao atualizar dados:', error);
        setSnackbar({ open: true, message: 'Erro ao atualizar dados', severity: 'error' });
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(API_BASE_URL)
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar usuários:', error);
        setIsLoading(false);
        setSnackbar({ open: true, message: 'Erro ao carregar usuários', severity: 'error' });
      });
  }, [refreshTrigger]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    return users.filter(user => 
      user.nome.toLowerCase().includes(searchTermLower) || 
      user.email.toLowerCase().includes(searchTermLower) ||
      (user.codStatus && user.codStatus.toLowerCase().includes(searchTermLower))
    );
  }, [users, searchTerm]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    
    // Limpar mensagem de erro quando o usuário começa a digitar
    if (errorMessage) {
      setErrorMessage('');
    }
    
    setNewUser(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Função para validar o formulário
  const validateForm = () => {
    // Validar nome
    if (!newUser.nome || newUser.nome.trim().length < 3) {
      setErrorMessage('O nome deve ter pelo menos 3 caracteres');
      return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newUser.email || !emailRegex.test(newUser.email)) {
      setErrorMessage('Por favor, insira um email válido');
      return false;
    }
    
    // Validar senha (apenas para novos usuários)
    if (!isEditing && (!newUser.senha || newUser.senha.length < 6)) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };

  const handleAddUser = async () => {
    if (!validateForm()) return;
    
    setLoadingUserSubmit(true);

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: newUser.nome.trim(),
          email: newUser.email.trim(),
          senha: newUser.senha,
          admin: newUser.administrador,
          codStatus: newUser.ativo ? 'ATIVO' : 'INATIVO'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setSnackbar({ 
          open: true, 
          message: `Erro ao adicionar o usuário: ${response.statusText || errorText}`, 
          severity: 'error' 
        });
        return;
      }

      const data = await response.json();
      setUsers(prevUsers => [...prevUsers, data]);
      setSnackbar({ open: true, message: 'Usuário adicionado com sucesso!', severity: 'success' });
      resetForm();
      
      // Voltar para a aba de listagem após adicionar
      setTabValue(0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao adicionar o usuário';
      setSnackbar({ open: true, message: `Erro ao adicionar o usuário: ${errorMessage}`, severity: 'error' });
    } finally {
      setLoadingUserSubmit(false);
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
      senha: user.senha || ''
    });
    
    // Mudar para a aba de edição
    setTabValue(1);
    
    // Feedback visual
    setSnackbar({ 
      open: true, 
      message: `Editando usuário: ${user.nome}`, 
      severity: 'info' 
    });
  };
  const handleUpdateUser = async () => {
    if (!currentUser || typeof currentUser.id !== 'number') return;
    
    if (!validateForm()) return;
    
    setLoadingUserSubmit(true);

    const formData = new FormData();
    formData.append("data", JSON.stringify({
      nome: newUser.nome.trim(),
      email: newUser.email.trim(),
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
        const errorText = await response.text();
        setSnackbar({ 
          open: true, 
          message: `Erro ao atualizar o usuário: ${response.statusText || errorText}`, 
          severity: 'error' 
        });
        return;
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => (user.id === currentUser.id ? updatedUser : user)));
      setSnackbar({ 
        open: true, 
        message: `Usuário ${updatedUser.nome} atualizado com sucesso!`, 
        severity: 'success' 
      });
      resetForm();
      
      // Voltar para a aba de listagem após atualizar
      setTabValue(0);
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

  const columns = useMemo(() => [
    {
      accessorKey: 'avatar',
      header: 'Foto',
      size: 60,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const avatar = row.original.avatar;
        const nome = row.original.nome;

        const imageSrc = avatar
          ? `data:image/png;base64,${avatar}`
          : ProfileAvatar;

        return (
          <Tooltip title={`Foto de ${nome}`} arrow placement="right">
            <img
              src={imageSrc}
              alt={`Avatar de ${nome}`}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '0.5px solid #e3e3e3',
                transition: 'transform 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                }
              }}
            />
          </Tooltip>
        );
      }
    },
    {
      accessorKey: 'nome',
      header: 'Usuário',
      size: 150,
      filterVariant: 'text',
      Cell: ({ cell, row }) => (
        <div style={{ 
          fontWeight: 500, 
          color: '#555', 
          cursor: 'pointer',
          transition: 'color 0.2s ease'
        }}
        onClick={() => handleEditUser(row.original)}
        >
          {cell.getValue()}
        </div>
      ),
      muiTableHeadCellProps: {
        sx: {
          color: '#555',
          fontWeight: 'bold',
        }
      }
    },
    {
      accessorKey: 'codStatus',
      header: 'Status',
      size: 100,
      filterVariant: 'select',
      filterSelectOptions: [
        { text: 'Ativo', value: 'ATIVO' },
        { text: 'Inativo', value: 'INATIVO' }
      ],
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
              fontWeight: '600',
              display: 'inline-block',
              minWidth: '60px',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            {isActive ? 'Ativo' : 'Inativo'}
          </span>
        );
      },
      muiTableHeadCellProps: {
        sx: {
          color: '#555',
          fontWeight: 'bold',
        }
      }
    },
    {
      accessorKey: 'admin',
      header: 'Administrador',
      size: 120,
      filterVariant: 'select',
      filterSelectOptions: [
        { text: 'Sim', value: true },
        { text: 'Não', value: false }
      ],
      Cell: ({ cell }) => {
        const isAdmin = cell.getValue();
        const color = isAdmin ? '#C8E6C9' : '#FFCDD2';
        const label = isAdmin ? 'Sim' : 'Não';

        return (
          <span
            style={{
              backgroundColor: color,
              color: isAdmin ? '#2e7d32' : '#c62828',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'inline-block',
              textAlign: 'center',
              minWidth: '60px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            {label}
          </span>
        );
      },
      muiTableHeadCellProps: {
        sx: {
          color: '#555',
          fontWeight: 'bold',
        }
      }
    },
    { 
      accessorKey: 'email', 
      header: 'Email',
      size: 200,
      filterVariant: 'text',
      muiTableHeadCellProps: {
        sx: {
          color: '#555',
          fontWeight: 'bold',
        }
      }
    },
    {
      header: 'Ações',
      size: 100,
      enableSorting: false,
      enableColumnFilter: false,
      muiTableBodyCellProps: {
        align: 'center',
      },
      Cell: ({ row }) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <Tooltip title="Editar usuário" arrow>
            <IconButton 
              onClick={() => handleEditUser(row.original)}
              sx={{
                backgroundColor: 'rgba(12, 243, 128, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(95, 170, 132, 0.2)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <EditIcon sx={{ color: '#5faa84' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir usuário" arrow>
            <IconButton 
              onClick={() => handleOpenDeleteDialog(row.original.id)}
              sx={{
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.2)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ], []);
  ;

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
              backgroundColor: '#f9f9f9',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              fontWeight: 'bold',
              color: '#2f7c37',
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

        <div className="header-container">
          <h1 className='titleManag'>Gerenciar usuários</h1>
        </div>
        
        <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '410px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Pesquisar por nome, email ou status..."
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

        <Box sx={{ 
          backgroundColor:"#fafafa", 
          borderRadius: "16px", 
          padding: "0 15px",
          display: "flex", 
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="gerenciamento de usuários"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 500,
                color: '#555',
                '&.Mui-selected': {
                  color: '#2f7c37',
                  fontWeight: 600,
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#2f7c37',
              }
            }}
          >
            <Tab label="Lista de Usuários" icon={<Search size={18} />} iconPosition="start" />
            <Tab label="Adicionar/Editar Usuário" icon={<UserPlus size={18} />} iconPosition="start" />
          </Tabs>
          
          <div style={{ display: "flex", gap: "10px", alignItems: "center", backgroundColor: "#fafafa" }}>
            <button 
              onClick={refreshData} 
              className="refresh-data-button" 
              disabled={isRefreshing}
              style={{ backgroundColor: "#fafafa", color: "#2f7c37", border: "1px solid rgba(95, 170, 132, 0.3)" }}
            >
              {isRefreshing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  <RefreshCw size={18} style={{ marginRight: "8px" }} className={isRefreshing ? "rotating" : ""} />
                  Atualizar Dados
                </>
              )}
            </button>
            
            <button 
              onClick={generatePDF} 
              className="generate-pdf-button" 
              disabled={loadingPDF}
              style={{ backgroundColor: "#fafafa", color: "#2f7c37", border: "1px solid rgba(95, 170, 132, 0.3)" }}
            >
              {loadingPDF ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  <PrintIcon sx={{ marginRight: "8px" }} />
                  Gerar Relatório
                </>
              )}
            </button>
          </div>
        </Box>

        <Fade in={tabValue === 0} timeout={300}>
          <div style={{ display: tabValue === 0 ? 'block' : 'none' }}>

            <div className="table-container">
              {isLoading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Carregando dados...</p>
                </div>
              ) : (
                <MaterialReactTable
                  columns={columns}
                  data={filteredUsers}
                  initialState={{ 
                    pagination: { pageSize: 5 },
                    density: 'compact'
                  }}
                  muiTablePaginationProps={{
                    rowsPerPageOptions: [5, 10, 20],
                    labelRowsPerPage: "Linhas por página:",
                    showFirstButton: true,
                    showLastButton: true,
                  }}
                  enableColumnFilters
                  enableGlobalFilter={false}
                  positionFilterRow="top"
                  muiFilterTextFieldProps={{
                    sx: { 
                      '& .MuiInputBase-root': { 
                        justifyContent: 'flex-start' 
                      } 
                    }
                  }}
                  muiTableBodyProps={{
                    sx: {
                      '& tr:nth-of-type(odd)': {
                        backgroundColor: 'rgb(255, 255, 255)',
                      },
                    }
                  }}
                />
              )}
            </div>
          </div>
        </Fade>

        <Fade in={tabValue === 1} timeout={300}>
          <div style={{ display: tabValue === 1 ? 'block' : 'none' }}>
            <div className="form-container">
              <form onSubmit={(event) => {
                event.preventDefault();
                if (isEditing) {
                  handleUpdateUser();
                } else {
                  handleAddUser();
                }
              }}>
                <h2 style={{ marginTop: "10px" }}>{isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
                {errorMessage && (
                  <div className="error-message">
                    {errorMessage}
                  </div>
                )}
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
                    marginLeft: isEditing ? "10px" : "-60px",
                    display: "flex",
                    flexWrap: "nowrap",
                    gap: isEditing ? "5px" : "15px",
                    alignItems: "center",
                  }}>
                    <div className="status-user-select-container">
                      <select
                        name="codStatus"
                        value={newUser.ativo || 'ATIVO'}
                        onChange={(e) => setNewUser({ ...newUser, ativo: e.target.value })}
                        className="status-user-select"
                      >
                        <option value="ATIVO">Ativo</option>
                        <option value="INATIVO">Inativo</option>
                      </select>
                    </div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          className='checkbox'
                          checked={newUser.administrador}
                          onChange={() => setNewUser(prevState => ({ ...prevState, administrador: !prevState.administrador }))}
                          sx={{
                            '&.Mui-checked': {
                              color: '#5faa84',
                            },
                          }}
                        />
                      }
                      label={<Typography sx={{ color: '#fafafa' }}>Administrador</Typography>}
                    />
                  </FormGroup>

                  <div className="form-buttons">
                    <button className='ADD_button' type="submit" disabled={loadingUserSubmit}>
                      {loadingUserSubmit ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        isEditing ? 'Atualizar Usuário' : 'Adicionar Usuário'
                      )}
                    </button>

                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className='CANCEL_button_USER'>
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Fade>

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
