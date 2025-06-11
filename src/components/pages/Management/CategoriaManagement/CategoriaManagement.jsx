import React, { useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import './CategoriaManagement.css';
import NeotechLogo from "../../../../assets/Logo7png.png";
import Sidebar1 from '../Sidebar/SidebarManagement';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import jsPDF from 'jspdf';
import CircularProgress from '@mui/material/CircularProgress';
import 'jspdf-autotable';
import { Checkbox, FormControlLabel, FormGroup, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';  // Importando Checkbox do MUI
import PrintIcon from '@mui/icons-material/Print';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Search } from 'lucide-react';
import Typography from '@mui/material/Typography';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CategoriaManagement() {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCategory, setNewCategory] = useState({
        nome: '',
        descricao: '',
        precoPorKg: '',
        codStatus: 'ATIVO' // Valor padrão conforme backend
    });

    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const API_BASE_URL = "https://intellij-neotech.onrender.com/api/v1/categorias";
    const [isLoading, setIsLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingPDF, setLoadingPDF] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_BASE_URL);
            const data = await response.json();
            console.log('Categorias recebidas:', data); // <--- ADICIONE ISSO

            setCategories(data);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            setSnackbar({ open: true, message: 'Erro ao carregar categorias', severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const generatePDF = () => {
        setLoadingPDF(true);

        const doc = new jsPDF();
        const img = new Image();
        img.src = NeotechLogo;

        img.onload = function () {
            const pageWidth = doc.internal.pageSize.width;
            const imgWidth = 30;
            const imgHeight = (img.height / img.width) * imgWidth;
            const imgX = (pageWidth - imgWidth) / 2;

            doc.addImage(img, 'PNG', imgX, 10, imgWidth, imgHeight);
            doc.setTextColor(47, 124, 55);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(22);
            doc.text('Relatório de Categorias de Reciclagem', pageWidth / 2, imgHeight + 20, { align: 'center' });

            doc.setTextColor(18, 54, 21);
            doc.setFontSize(12);
            doc.setFont('Helvetica', 'italic');
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, pageWidth / 2, imgHeight + 30, { align: 'center' });

            const tableColumn = ['ID', 'Nome', 'Descrição', 'Preço por Kg (R$)', 'Status'];
            const tableRows = categories.map(category => [
                category.id,
                category.nome,
                category.descricao,
                category.precoPorKg.toFixed(2),
                category.codStatus.trim() === "ATIVO" ? 'Ativo' : 'Inativo'
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

            const pageHeight = doc.internal.pageSize.height;
            doc.line((pageWidth - 180) / 2, pageHeight - 20, (pageWidth + 180) / 2, pageHeight - 20);
            doc.text('Neotech', pageWidth / 2, pageHeight - 15, { align: 'center' });

            doc.save('relatorio_categorias_reciclagem.pdf');
            setLoadingPDF(false);
        };

        img.onerror = function () {
            setSnackbar({ open: true, message: 'Erro ao carregar o logotipo do PDF.', severity: 'error' });
            setLoadingPDF(false);
        };
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCategories = categories.filter(category =>
        category.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;

        // Para campos numéricos, converter para número
        const processedValue = name === 'precoPorKg'
            ? value === '' ? '' : parseFloat(value) || 0
            : value;

        setNewCategory(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : processedValue
        }));
    };

    const handleAddCategory = async () => {
        if (!newCategory.nome || newCategory.precoPorKg <= 0) {
            setSnackbar({ open: true, message: 'Nome e preço são obrigatórios', severity: 'error' });
            return;
        }

        setLoadingSubmit(true);
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: newCategory.nome,
                    descricao: newCategory.descricao,
                    precoPorKg: newCategory.precoPorKg,
                    codStatus: newCategory.codStatus
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar categoria');
            }

            const data = await response.json();
            setCategories(prev => [...prev, data]);
            setSnackbar({ open: true, message: 'Categoria adicionada com sucesso!', severity: 'success' });
            resetForm();
        } catch (error) {
            setSnackbar({ open: true, message: `Erro: ${error.message}`, severity: 'error' });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleEditCategory = (category) => {
        setIsEditing(true);
        setCurrentCategory(category);
        setNewCategory({
            nome: category.nome,
            descricao: category.descricao,
            precoPorKg: category.precoPorKg,
            codStatus: category.codStatus
        });
    };

    const handleUpdateCategory = async () => {
        if (!currentCategory) return;
        setLoadingSubmit(true);

        try {
            const response = await fetch(`${API_BASE_URL}/${currentCategory.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: newCategory.nome,
                    descricao: newCategory.descricao,
                    precoPorKg: newCategory.precoPorKg,
                    codStatus: newCategory.codStatus
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar categoria');
            }

            const updatedCategory = await response.json();
            setCategories(categories.map(cat =>
                cat.id === currentCategory.id ? updatedCategory : cat
            ));
            setSnackbar({ open: true, message: 'Categoria atualizada com sucesso!', severity: 'success' });
            resetForm();
        } catch (error) {
            setSnackbar({ open: true, message: `Erro: ${error.message}`, severity: 'error' });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleOpenDeleteDialog = (categoryId) => {
        setCategoryToDelete(categoryId);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            await fetch(`${API_BASE_URL}/${categoryToDelete}`, {
                method: 'DELETE',
            });
            setCategories(categories.filter(cat => cat.id !== categoryToDelete));
            setSnackbar({ open: true, message: 'Categoria excluída com sucesso!', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: `Erro ao deletar categoria: ${error.message}`, severity: 'error' });
        } finally {
            handleCloseDeleteDialog();
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentCategory(null);
        setNewCategory({
            nome: '',
            descricao: '',
            precoPorKg: 0,
            codStatus: "ATIVO"
        });
        setErrorMessage('');
    };

    const columns = [
        {
            accessorKey: 'nome',
            header: 'Nome da Categoria',
            headerStyle: { fontWeight: 'bold' },
        },
        {

            accessorKey: 'descricao',
            header: 'Descrição',
            Cell: ({ cell }) => (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {cell.getValue() || '-'}
                </div>
            ),
        },
        {
            accessorKey: 'precoPorKg',
            header: 'Preço por Kg (R$)',
            Cell: ({ cell }) => `R$ ${parseFloat(cell.getValue()).toFixed(2)}`,
        },
        {
            accessorKey: 'codStatus',
            header: 'Status',
            Cell: ({ cell }) => {
                const status = cell.getValue();
                const isActive = status?.trim().toUpperCase() === 'ATIVO';

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
                        }}
                    >
                        {isActive ? 'Ativo' : 'Inativo'}
                    </span>
                );
            },
        },
        {
            header: 'Ações',
            muiTableBodyCellProps: {
                align: 'left',
            },
            Cell: ({ row }) => (
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.5rem' }}>
                    <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditCategory(row.original)}>
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
        <div className='CategoriaManagement'>
            <div className="container-management">
                <Sidebar1 />

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
                            Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
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

                            sx={{ borderRadius: '8px', textTransform: 'none', }}
                        >
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>

                <h1 className='titleManag'>Gerenciamento Categorias</h1>
                <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '410px' }}>
                    <input
                        type="text"
                        placeholder="Pesquisar Categorias"
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
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (isEditing) {
                            handleUpdateCategory();
                        } else {
                            handleAddCategory();
                        }
                    }}>
                        <h2>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                        <div className="form-row">
                            <input
                                className="nome"
                                type="text"
                                name="nome"
                                placeholder="Nome da categoria"
                                value={newCategory.nome}
                                onChange={handleInputChange}
                                required
                            />
                            <textarea
                                className="descricao"
                                name="descricao"
                                placeholder="Descrição da categoria"
                                value={newCategory.descricao}
                                onChange={handleInputChange}
                                rows={3}
                            />

                            <input
                                className="precoPorKg"
                                type="number"
                                name="precoPorKg"
                                placeholder="Preço por Kg (R$)"
                                value={newCategory.precoPorKg}
                                onChange={handleInputChange}
                                required
                                step="0.01"
                                min="0"
                                onBlur={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    setNewCategory(prev => ({
                                        ...prev,
                                        precoPorKg: value.toFixed(2)
                                    }));
                                }}
                            />
                            <div className="status-select-container">
                                <select
                                    name="codStatus"
                                    value={newCategory.codStatus}
                                    onChange={handleInputChange}
                                    className="status-select"
                                >
                                    <option value="ATIVO">Ativo</option>
                                    <option value="INATIVO">Inativo</option>
                                </select>
                            </div>

                            <button className='ADD_button' type="submit" disabled={loadingSubmit}>
                                {loadingSubmit ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    isEditing ? 'Atualizar Categoria' : 'Adicionar Categoria'
                                )}
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className='CANCEL_button'>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="table-container">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Carregando dados...</p>
                        </div>
                    ) : (
                        <MaterialReactTable
                            columns={columns}
                            data={filteredCategories}
                            initialState={{
                                pagination: { pageSize: 5 }, density: 'compact' // <- densidade mínima padronizada
                            }}
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [5, 10, 20],
                            }}
                            enableColumnResizing={false} // <- remove barra de ajuste
                            enableStickyHeader
                            enableFullScreenToggle={false}

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

export default CategoriaManagement;