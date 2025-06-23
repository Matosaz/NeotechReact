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
import { Checkbox, FormControlLabel, FormGroup, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Tabs, Tab, Box, Fade } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Search, RefreshCw, FileText } from 'lucide-react';
import Typography from '@mui/material/Typography';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Removendo o componente LoadingDots e a animação, pois usaremos CircularProgress

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
    const [loadingRelatedOrcamentos, setLoadingRelatedOrcamentos] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Efeito para verificar e normalizar os status das categorias após o carregamento
    useEffect(() => {
        if (categories.length > 0) {
            // Verificar se há categorias com status inconsistentes
            const categoriesWithIssues = categories.filter(cat =>
                cat.codStatus !== 'ATIVO' && cat.codStatus !== 'INATIVO'
            );

            if (categoriesWithIssues.length > 0) {
                // Corrigir automaticamente os status inconsistentes
                const correctedCategories = categories.map(cat => {
                    if (cat.codStatus !== 'ATIVO' && cat.codStatus !== 'INATIVO') {
                        // Determinar o status correto com base no valor atual
                        const correctedStatus = cat.codStatus?.trim().toUpperCase() === 'ATIVO' ? 'ATIVO' : 'INATIVO';
                        return { ...cat, codStatus: correctedStatus };
                    }
                    return cat;
                });

                // Atualizar o estado com as categorias corrigidas
                setCategories(correctedCategories);
            }
        }
    }, [categories]);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_BASE_URL);
            const data = await response.json();

            // Normalizar os status das categorias
            const normalizedData = data.map(category => ({
                ...category,
                codStatus: category.codStatus?.trim().toUpperCase() === "ATIVO" ? "ATIVO" : "INATIVO"
            }));




            setCategories(normalizedData);
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
            doc.text('Relatório de Categorias', pageWidth / 2, imgHeight + 20, { align: 'center' });

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
            doc.text(`Total de categorias: ${categories.length}`, 14, imgHeight + 40);
            
            const categoriasAtivas = categories.filter(cat => cat.codStatus === 'ATIVO').length;
            doc.text(`Categorias ativas: ${categoriasAtivas}`, 14, imgHeight + 46);
            doc.text(`Categorias inativas: ${categories.length - categoriasAtivas}`, 14, imgHeight + 52);

            // Configuração da tabela
            const tableColumn = ['ID', 'Nome', 'Descrição', 'Preço/Kg (R$)', 'Status'];
            const tableRows = categories.map(category => [
                category.id,
                category.nome,
                category.descricao || '-',
                `R$ ${category.precoPorKg.toFixed(2)}`,
                category.codStatus === 'ATIVO' ? 'Ativo' : 'Inativo'
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
                        doc.text('Relatório de Categorias', pageWidth / 2, 15, { align: 'center' });
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
            doc.save(`relatorio_categorias_${dataFormatada}.pdf`);
            
          setSnackbar({ open: true, message: 'Relatório gerado com sucesso!', severity: 'success' });
            setLoadingPDF(false);
        };

        img.onerror = function () {
            setSnackbar({ open: true, message: 'Erro ao carregar o logotipo do PDF.', severity: 'error' });
            setLoadingPDF(false);
        };
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const refreshData = () => {
        setIsRefreshing(true);
        fetchCategories()
            .then(() => {
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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCategories = categories.filter(category =>
        category.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = async (event) => {
        const { name, value, type, checked } = event.target;

        // Para campos numéricos, converter para número
        const processedValue = name === 'precoPorKg'
            ? value === '' ? '' : parseFloat(value) || 0
            : value;

        // Verificar se está alterando o status para INATIVO
        if (name === 'codStatus' && value === 'INATIVO' && currentCategory && currentCategory.codStatus === 'ATIVO') {
            setLoadingRelatedOrcamentos(true);
            try {
                const ORCAMENTOS_API_URL = "https://intellij-neotech.onrender.com/api/v1/orcamentos";
                const response = await fetch(ORCAMENTOS_API_URL);

                if (response.ok) {
                    const orcamentos = await response.json();
                    const relatedOrcamentos = orcamentos.filter(orcamento =>
                        orcamento.categorias &&
                        orcamento.categorias.some(cat => cat.id === currentCategory.id) &&
                        orcamento.codStatus !== 'INATIVO'
                    );

                    if (relatedOrcamentos.length > 0) {
                        setSnackbar({
                            open: true,
                            message: `Atenção: Existem ${relatedOrcamentos.length} orçamento(s) relacionado(s) a esta categoria. Eles serão inativados automaticamente.`,
                            severity: 'warning'
                        });
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar orçamentos relacionados:', error);
                setSnackbar({
                    open: true,
                    message: 'Erro ao verificar orçamentos relacionados.',
                    severity: 'error'
                });
            } finally {
                setLoadingRelatedOrcamentos(false);
            }
        }

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

            // Voltar para a aba de listagem após adicionar
            setTabValue(0);
        } catch (error) {
            setSnackbar({ open: true, message: `Erro: ${error.message}`, severity: 'error' });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleEditCategory = (category) => {
        setIsEditing(true);
        setCurrentCategory(category);

        // Garantir que o status seja exatamente "ATIVO" ou "INATIVO"
        const normalizedStatus = category.codStatus?.trim().toUpperCase() === "ATIVO" ? "ATIVO" : "INATIVO";

        setNewCategory({
            nome: category.nome,
            descricao: category.descricao,
            precoPorKg: category.precoPorKg,
            codStatus: normalizedStatus
        });

        // Mudar para a aba de edição
        setTabValue(1);

        // Feedback visual
        setSnackbar({
            open: true,
            message: `Editando categoria: ${category.nome}`,
            severity: 'info'
        });
    };

    const handleUpdateCategory = async () => {
        if (!currentCategory) return;
        setLoadingSubmit(true);

        try {
            // Normalizar o status para garantir que seja exatamente "ATIVO" ou "INATIVO"
            const normalizedStatus = newCategory.codStatus?.trim().toUpperCase() === "ATIVO" ? "ATIVO" : "INATIVO";

            // Verificar se a categoria está sendo inativada
            const isBeingInactivated = currentCategory.codStatus === 'ATIVO' && normalizedStatus === 'INATIVO';



            // Atualizar a categoria
            const response = await fetch(`${API_BASE_URL}/${currentCategory.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: newCategory.nome,
                    descricao: newCategory.descricao,
                    precoPorKg: newCategory.precoPorKg,
                    codStatus: normalizedStatus
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar categoria');
            }

            const updatedCategory = await response.json();
            setCategories(categories.map(cat =>
                cat.id === currentCategory.id ? updatedCategory : cat
            ));

            // Se a categoria foi inativada, atualizar os orçamentos relacionados
            if (isBeingInactivated) {
                await updateRelatedOrcamentos(currentCategory.id);
            }

            setSnackbar({ open: true, message: 'Categoria atualizada com sucesso!', severity: 'success' });
            resetForm();

            // Voltar para a aba de listagem após atualizar
            setTabValue(0);
        } catch (error) {
            setSnackbar({ open: true, message: `Erro: ${error.message}`, severity: 'error' });
        } finally {
            setLoadingSubmit(false);
        }
    };

    // Função para atualizar orçamentos relacionados à categoria inativada
    const updateRelatedOrcamentos = async (categoryId) => {
        setLoadingRelatedOrcamentos(true);
        try {
            // Buscar todos os orçamentos
            const ORCAMENTOS_API_URL = "https://intellij-neotech.onrender.com/api/v1/orcamentos";
            const response = await fetch(ORCAMENTOS_API_URL);

            if (!response.ok) {
                throw new Error('Erro ao buscar orçamentos');
            }

            const orcamentos = await response.json();

            // Filtrar orçamentos que contêm a categoria inativada
            const affectedOrcamentos = orcamentos.filter(orcamento =>
                orcamento.categorias &&
                orcamento.categorias.some(cat => cat.id === categoryId) &&
                orcamento.codStatus !== 'INATIVO'
            );

            // Atualizar cada orçamento afetado para status INATIVO
            for (const orcamento of affectedOrcamentos) {
                const payload = {
                    id: orcamento.id,
                    dataColeta: orcamento.dataColeta,
                    horaColeta: orcamento.horaColeta,
                    metodoContato: orcamento.metodoContato,
                    codStatus: 'INATIVO', // Alterando para INATIVO
                    cep: orcamento.cep,
                    endereco: orcamento.endereco,
                    bairro: orcamento.bairro,
                    numero: orcamento.numero,
                    aceitaContato: orcamento.aceitaContato,
                    categorias: orcamento.categorias,
                    usuario: { id: orcamento.usuario.id }
                };

                await fetch(`${ORCAMENTOS_API_URL}/${orcamento.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
            }

            if (affectedOrcamentos.length > 0) {
                setSnackbar({
                    open: true,
                    message: `${affectedOrcamentos.length} orçamento(s) relacionado(s) foram inativados automaticamente.`,
                    severity: 'info'
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar orçamentos relacionados:', error);
            setSnackbar({
                open: true,
                message: `Erro ao inativar orçamentos relacionados: ${error.message}`,
                severity: 'error'
            });
        } finally {
            setLoadingRelatedOrcamentos(false);
        }
    };

    const handleOpenDeleteDialog = async (categoryId) => {
        setCategoryToDelete(categoryId);
        setLoadingRelatedOrcamentos(true);

        // Verificar se há orçamentos relacionados
        try {
            const ORCAMENTOS_API_URL = "https://intellij-neotech.onrender.com/api/v1/orcamentos";
            const response = await fetch(ORCAMENTOS_API_URL);

            if (response.ok) {
                const orcamentos = await response.json();
                const relatedOrcamentos = orcamentos.filter(orcamento =>
                    orcamento.categorias &&
                    orcamento.categorias.some(cat => cat.id === categoryId) &&
                    orcamento.codStatus !== 'INATIVO'
                );

                if (relatedOrcamentos.length > 0) {
                    setSnackbar({
                        open: true,
                        message: `Atenção: Existem ${relatedOrcamentos.length} orçamento(s) relacionado(s) a esta categoria. Eles serão inativados automaticamente.`,
                        severity: 'warning'
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao verificar orçamentos relacionados:', error);
            setSnackbar({
                open: true,
                message: 'Erro ao verificar orçamentos relacionados.',
                severity: 'error'
            });
        } finally {
            setLoadingRelatedOrcamentos(false);
            setDeleteDialogOpen(true);
        }
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;

        setLoadingRelatedOrcamentos(true);

        try {
            // Antes de excluir, inativar os orçamentos relacionados
            const categoryToBeDeleted = categories.find(cat => cat.id === categoryToDelete);
            if (categoryToBeDeleted && categoryToBeDeleted.codStatus === 'ATIVO') {
                await updateRelatedOrcamentos(categoryToDelete);
            }

            // Excluir a categoria
            await fetch(`${API_BASE_URL}/${categoryToDelete}`, {
                method: 'DELETE',
            });

            setCategories(categories.filter(cat => cat.id !== categoryToDelete));
            setSnackbar({ open: true, message: 'Categoria excluída com sucesso!', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: `Erro ao deletar categoria: ${error.message}`, severity: 'error' });
        } finally {
            setLoadingRelatedOrcamentos(false);
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
            Cell: ({ cell, row }) => {
                const status = cell.getValue();
                const isActive = status?.trim().toUpperCase() === 'ATIVO';

                // Log para debug

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
                        <IconButton
                            onClick={() => handleEditCategory(row.original)}
                            disabled={loadingRelatedOrcamentos}
                            sx={{
                                backgroundColor: 'rgba(105, 167, 136, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(95, 170, 132, 0.2)',
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <EditIcon sx={{ color: '#4c906b' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={loadingRelatedOrcamentos ? "Verificando orçamentos..." : "Excluir"}>
                        <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(row.original.id)}
                            disabled={loadingRelatedOrcamentos} sx={{
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >

                            {loadingRelatedOrcamentos && categoryToDelete === row.original.id ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <DeleteIcon color="error" />
                            )}
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
                            disabled={loadingRelatedOrcamentos}
                            sx={{ borderRadius: '8px', textTransform: 'none', }}
                        >
                            {loadingRelatedOrcamentos ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Confirmar'
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>

                <div className="header-container">
                    <h1 className='titleManag'>Gerenciamento Categorias</h1>
                </div>

                <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '450px', marginBottom: '20px' }}>
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

                <Box sx={{
                    backgroundColor: "transparent",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: 'space-between'
                }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="gerenciamento de categorias"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: '14px',
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
                        <Tab label="Lista de Categorias" icon={<Search size={18} />} iconPosition="start" />
                        <Tab label="Adicionar/Editar Categoria" icon={<FileText size={18} />} iconPosition="start" />
                    </Tabs>

                    <div className='headerButtons'>
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
                    <div style={{
                        display: tabValue === 0 ? 'block' : 'none',
                        borderRadius: "0 0 16px 16px",
                        marginTop: "-1px"
                    }}>
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
                                    enableColumnResizing={false}
                                    enableStickyHeader
                                    enableFullScreenToggle={false}
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
                    <div style={{
                        display: tabValue === 1 ? 'block' : 'none',
                        backgroundColor: "transparent",
                        borderRadius: "0 0 16px 16px",
                        marginTop: "-1px"
                    }}>
                        <div className="form-container">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (isEditing) {
                                    handleUpdateCategory();
                                } else {
                                    handleAddCategory();
                                }
                            }}>
                                <h2 style={{ marginTop: "10px" }}>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                                {errorMessage && (
                                    <div className="error-message">
                                        {errorMessage}
                                    </div>
                                )}
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
                                    <div className="status-select-container" style={{ position: 'relative' }}>
                                        <select
                                            name="codStatus"
                                            value={newCategory.codStatus || "ATIVO"}
                                            onChange={(e) => {
                                                // Garantir que o valor seja exatamente "ATIVO" ou "INATIVO"
                                                const statusValue = e.target.value === "ATIVO" ? "ATIVO" : "INATIVO";
                                                handleInputChange({
                                                    target: {
                                                        name: "codStatus",
                                                        value: statusValue,
                                                        type: "select"
                                                    }
                                                });
                                            }}
                                            className="status-select"
                                            disabled={loadingRelatedOrcamentos}
                                        >
                                            <option value="ATIVO">Ativo</option>
                                            <option value="INATIVO">Inativo</option>
                                        </select>
                                        {loadingRelatedOrcamentos && (
                                            <div style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)'
                                            }}>
                                                <CircularProgress size={20} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-buttons">
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

export default CategoriaManagement;