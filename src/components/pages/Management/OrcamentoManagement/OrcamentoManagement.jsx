import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import './OrcamentoManagement.css';
import NeotechLogo from "../../../../assets/Logo7png.png";
import Sidebar1 from '../Sidebar/SidebarManagement';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import {
    IconButton,
    Tooltip,
    CircularProgress,
    TextField,
    Checkbox,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    MenuItem,
    Snackbar
} from '@mui/material';
import { Alert as MuiAlert } from '@mui/material';
import { AlignLeft, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DesktopDatePicker, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function OrcamentoManagement() {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [orcamentos, setOrcamentos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editOrcamento, setEditOrcamento] = useState({
        categoria: null,
        horaColeta: '',
        dataColeta: '',
        metodoContato: '',
        aceitaContato: true,
        codStatus: 'AGENDADA' // Valor padrão

    });
    const [isEditing, setIsEditing] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [dateError, setDateError] = useState('');
    const [timeError, setTimeError] = useState('');
    const [disableSaveButton, setDisableSaveButton] = useState(false);
    const [currentOrcamento, setCurrentOrcamento] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orcamentoToDelete, setOrcamentoToDelete] = useState(null);
    const API_BASE_URL = "https://intellij-neotech.onrender.com/api/v1/orcamentos";
    const CATEGORIES_API_URL = "https://intellij-neotech.onrender.com/api/v1/categorias";
    const [isLoading, setIsLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingPDF, setLoadingPDF] = useState(false);

    useEffect(() => {
        fetchOrcamentos();
        fetchCategories();
    }, []);

    const fetchOrcamentos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_BASE_URL);
            const data = await response.json();
            setOrcamentos(data);
        } catch (error) {
            console.error('Erro ao buscar orçamentos:', error);
            setSnackbar({ open: true, message: 'Erro ao carregar orçamentos', severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(CATEGORIES_API_URL);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [searchTerm]);

    const filteredOrcamentos = useMemo(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return orcamentos.filter((orcamento) =>
            orcamento.categorias?.some((cat) =>
                cat.nome?.toLowerCase().includes(lowerSearchTerm)
            ) ||
            orcamento.metodoContato?.toLowerCase().includes(lowerSearchTerm) ||
            orcamento.usuario?.nome?.toLowerCase().includes(lowerSearchTerm)
        );
    }, [orcamentos, searchTerm]);

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    const handleEditOrcamento = (orcamento) => {
        setSnackbar({ open: false, message: '', severity: 'info' }); // <-- Fecha snackbar antigo
        setCurrentOrcamento(orcamento);
        setEditOrcamento({
            horaColeta: orcamento.horaColeta.substring(0, 5),
            dataColeta: orcamento.dataColeta,
            metodoContato: orcamento.metodoContato,
            codStatus: orcamento.codStatus || 'AGENDADA'

        });
        setEditDialogOpen(true);
    };
    const handleUpdateOrcamento = async (e) => {
        e.preventDefault();

        if (disableSaveButton) {
            setSnackbar({ open: true, message: 'Corrija os erros antes de salvar', severity: 'error' });
            return;
        }

        setLoadingSubmit(true);

        try {
            const payload = {
                id: currentOrcamento.id,
                // Campos editáveis:
                dataColeta: editOrcamento.dataColeta || currentOrcamento.dataColeta,
                horaColeta: editOrcamento.horaColeta
                    ? (editOrcamento.horaColeta.length === 5 ? editOrcamento.horaColeta + ':00' : editOrcamento.horaColeta)
                    : currentOrcamento.horaColeta,
                metodoContato: editOrcamento.metodoContato || currentOrcamento.metodoContato,
                codStatus: editOrcamento.codStatus || currentOrcamento.codStatus,
                // Campos não editáveis (mantidos do original):
                cep: currentOrcamento.cep,
                endereco: currentOrcamento.endereco,
                bairro: currentOrcamento.bairro,
                numero: currentOrcamento.numero,
                aceitaContato: currentOrcamento.aceitaContato,
                categorias: currentOrcamento.categorias,
                usuario: { id: currentOrcamento.usuario.id }
            };
            const response = await fetch(`${API_BASE_URL}/${currentOrcamento.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            let responseData;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                responseData = await response.json();
            } else {
                responseData = await response.text(); // <- evita o erro!
            }

            if (!response.ok) {
                const errorMsg = typeof responseData === 'string'
                    ? responseData
                    : responseData.message || responseData.error || `Erro ${response.status}: ${response.statusText}`;
                throw new Error(errorMsg);
            }

            // Atualização bem-sucedida
            setOrcamentos(prevOrcamentos =>
                prevOrcamentos.map(orcamento =>
                    orcamento.id === currentOrcamento.id ? { ...orcamento, ...responseData } : orcamento
                )
            );

            setSnackbar({
                open: true,
                message: 'Orçamento atualizado com sucesso!',
                severity: 'success'
            });
            setEditDialogOpen(false);

        } catch (error) {
            console.error('Erro na atualização:', error);
            setSnackbar({
                open: true,
                message: `Falha ao atualizar: ${error.message}`,
                severity: 'error'
            });
        } finally {
            setLoadingSubmit(false);
        }
    };
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setEditOrcamento(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const handleOpenDeleteDialog = (id) => {
        setOrcamentoToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await fetch(`${API_BASE_URL}/${orcamentoToDelete}`, { method: 'DELETE' });
            setOrcamentos(orcamentos.filter(o => o.id !== orcamentoToDelete));
            setSnackbar({ open: true, message: 'Orçamento excluído com sucesso!', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: `Erro ao excluir: ${error.message}`, severity: 'error' });
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentOrcamento(null);
    };


    const generatePDF = () => {
        setLoadingPDF(true);

        const doc = new jsPDF();
        const img = new Image();
        img.src = NeotechLogo;

        img.onload = function () {
            const pageWidth = doc.internal.pageSize.width;

            // Ajusta o tamanho do logo proporcionalmente
            const imgWidth = 40;
            const imgHeight = (img.height / img.width) * imgWidth;
            const imgX = (pageWidth - imgWidth) / 2;

            // Adiciona o logo centralizado
            doc.addImage(img, 'PNG', imgX, 10, imgWidth, imgHeight);

            // Título do documento
            doc.setTextColor(47, 124, 55);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(20);
            doc.text('Relatório de Orçamentos de Reciclagem', pageWidth / 2, imgHeight + 25, { align: 'center' });

            // Data de geração do relatório
            doc.setTextColor(18, 54, 21);
            doc.setFont('Helvetica', 'italic');
            doc.setFontSize(10);
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, pageWidth / 2, imgHeight + 35, { align: 'center' });

            // Define as colunas da tabela
            const tableColumn = [
                'ID',
                'Usuário',
                'Categoria',
                'Data Coleta',
                'Hora Coleta',
                'CEP',
                'Endereço',
                'Bairro',
                'Número',
                'Status'


            ];

            // Mapeia os dados para as linhas da tabela
            const tableRows = orcamentos.map((orc) => [
                orc.id,
                orc.usuario?.nome || '-',
                orc.categorias?.map(cat => cat.nome).join(', ') || '-',
                orc.dataColeta ? new Date(orc.dataColeta).toLocaleDateString() : '-',
                orc.horaColeta ? orc.horaColeta.substring(0, 5) : '-',
                orc.cep || '-',
                orc.endereco || '-',
                orc.bairro || '-',
                orc.numero || '-',
                orc.codStatus === 'AGENDADA' ? 'Agendada' :
                    orc.codStatus === 'EM ANDAMENTO' ? 'Em andamento' :
                        orc.codStatus === 'CONCLUIDA' ? 'Concluída' :
                            orc.codStatus === 'INATIVO' ? 'Inativo' : orc.codStatus || '-'

            ]);

            // Adiciona a tabela ao documento
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: imgHeight + 45,
                headStyles: { fillColor: [127, 192, 141], textColor: 255 },
                bodyStyles: { fontSize: 9 },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                margin: { left: 10, right: 10 },
                didDrawPage: (data) => {
                    // Rodapé com número da página
                    const str = `Página ${doc.internal.getNumberOfPages()}`;
                    doc.setFontSize(8);
                    const pageHeight = doc.internal.pageSize.height;
                    doc.text(str, pageWidth / 2, pageHeight - 10, { align: 'center' });
                },
            });

            // Linha separadora no rodapé
            const pageHeight = doc.internal.pageSize.height;
            doc.setDrawColor(127, 192, 141);
            doc.setLineWidth(0.8);
            doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);

            // Texto do rodapé
            doc.setFontSize(10);
            doc.setTextColor(47, 124, 55);
            doc.text('Neotech', pageWidth / 2, pageHeight - 12, { align: 'center' });

            // Salva o PDF
            doc.save('relatorio_orcamentos_reciclagem.pdf');
            setLoadingPDF(false);
        };

        img.onerror = () => {
            setSnackbar({ open: true, message: 'Erro ao carregar o logo para o PDF.', severity: 'error' });
            setLoadingPDF(false);
        };
    };

    const handleDateChange = (newDate) => {
        const now = dayjs();
        const selectedDate = dayjs(newDate);

        setDateError('');
        setTimeError('');

        if (selectedDate.isBefore(now, 'day')) {
            setDateError('Não é possível selecionar uma data passada');
            setDisableSaveButton(true);
        } else {
            // Verifica se o horário precisa ser revalidado
            if (editOrcamento.horaColeta) {
                const horaSemSegundos = editOrcamento.horaColeta.split(':').slice(0, 2).join(':');
                const selectedTime = dayjs(horaSemSegundos, 'HH:mm');

                if (selectedDate.isSame(now, 'day')) {
                    if (selectedTime.isBefore(now)) {
                        setTimeError('Selecione um horário futuro para hoje');
                        setDisableSaveButton(true);
                    } else {
                        setDisableSaveButton(false);
                    }
                } else {
                    setDisableSaveButton(false);
                }
            } else {
                setDisableSaveButton(false);
            }
        }

        setEditOrcamento(prev => ({
            ...prev,
            dataColeta: selectedDate.format('YYYY-MM-DD')
        }));
    };

    const handleTimeChange = (newTime) => {
        const now = dayjs();
        const selectedTime = dayjs(newTime);
        const selectedDate = dayjs(editOrcamento.dataColeta || currentOrcamento?.dataColeta);

        setTimeError('');

        if (selectedDate.isSame(now, 'day')) {
            if (selectedTime.isBefore(now)) {
                setTimeError('Selecione um horário futuro para hoje');
                setDisableSaveButton(true);
                return;
            }
        }

        setDisableSaveButton(false);
        const hours = String(selectedTime.hour()).padStart(2, '0');
        const minutes = String(selectedTime.minute()).padStart(2, '0');
        setEditOrcamento(prev => ({
            ...prev,
            horaColeta: `${hours}:${minutes}`
        }));
    };

    const shouldDisableDate = (date) => {
        return date.isBefore(dayjs(), 'day');
    };


    useEffect(() => {
        const now = dayjs();
        let hasError = false;

        // Verifica se há data e se é diferente da original
        if (editOrcamento.dataColeta && editOrcamento.dataColeta !== currentOrcamento?.dataColeta) {
            const selectedDate = dayjs(editOrcamento.dataColeta);

            if (selectedDate.isBefore(now, 'day')) {
                setDateError('Não é possível selecionar uma data passada');
                hasError = true;
            }
        }

        // Verifica se há hora e se é diferente da original
        if (editOrcamento.horaColeta &&
            editOrcamento.horaColeta !== currentOrcamento?.horaColeta?.substring(0, 5)) {

            const horaSemSegundos = editOrcamento.horaColeta.split(':').slice(0, 2).join(':');
            const selectedTime = dayjs(horaSemSegundos, 'HH:mm');
            const selectedDate = dayjs(editOrcamento.dataColeta || currentOrcamento?.dataColeta);

            if (selectedDate.isSame(now, 'day') && selectedTime.isBefore(now)) {
                setTimeError('Selecione um horário futuro para hoje');
                hasError = true;
            }
        }

        if (!hasError) {
            setDateError('');
            setTimeError('');
        }

        setDisableSaveButton(hasError);
    }, [editOrcamento.dataColeta, editOrcamento.horaColeta, currentOrcamento]);

    const shouldDisableTime = (timeValue, view) => {
        const now = dayjs();
        const selectedDate = dayjs(editOrcamento.dataColeta || currentOrcamento?.dataColeta);

        if (selectedDate.isSame(now, 'day')) {
            const selectedTime = dayjs(timeValue);

            if (view === 'hours') {
                return selectedTime.hour() < now.hour();
            }

            if (view === 'minutes' && selectedTime.hour() === now.hour()) {
                return selectedTime.minute() < now.minute();
            }
        }

        return false;
    };
    const columns = [
        { accessorKey: 'id', header: 'ID', size: 60 },
        {
            accessorKey: 'usuario.nome',
            header: 'Usuário',
            Cell: ({ cell }) => cell.getValue() || '-'
        },
        {
            accessorKey: 'categorias',
            header: 'Categorias',
            Cell: ({ row }) => {
                const categorias = row.original.categorias;
                return (
                    <ul style={{ paddingLeft: 16 }}>
                        {categorias.map((cat) => (
                            <li key={cat.id}>
                                {cat.nome} - R$ {cat.precoPorKg.toFixed(2)} /kg
                            </li>
                        ))}
                    </ul>
                );
            },
        },
        {
            accessorKey: 'cep',
            header: 'Cep',
            Cell: ({ cell }) => cell.getValue() || '-'
        },
        {
            accessorKey: 'endereco',
            header: 'Endereço',
            Cell: ({ cell }) => cell.getValue() || '-'
        },
        {
            accessorKey: 'bairro',
            header: 'Bairro',
            Cell: ({ cell }) => cell.getValue() || '-'
        },
        {
            accessorKey: 'numero',
            header: 'Número',
            Cell: ({ cell }) => cell.getValue() || '-'
        },
        {
            accessorKey: 'dataColeta',
            header: 'Data Coleta',
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString()
        },
        {
            accessorKey: 'horaColeta',
            header: 'Hora Coleta',
            Cell: ({ cell }) => cell.getValue().substring(0, 5),
        },
        {
            accessorKey: 'codStatus',
            header: 'Status',
            Cell: ({ cell }) => {
                const status = cell.getValue()?.trim().toUpperCase();
                let statusText, bgColor, textColor;

                switch (status) {
                    case 'AGENDADA':
                        statusText = 'Agendada';
                        bgColor = '#BBDEFB'; // Azul pastel
                        textColor = '#0D47A1'; // Azul forte

                        break;
                    case 'EM ANDAMENTO':
                        statusText = 'Em andamento';
                        bgColor = '#FFE0B2'; // Laranja pastel
                        textColor = '#BF360C'; // Laranja queimado
                        break;
                    case 'CONCLUIDA':
                        statusText = 'Concluída';
                        bgColor = '#C8E6C9'; // Verde pastel
                        textColor = '#1B5E20'; // Verde forte
                        break;
                    case 'INATIVO':
                        statusText = 'Inativo';
                        bgColor = '#FFCDD2'; // Vermelho pastel
                        textColor = '#B71C1C'; // Vermelho escuro
                        break;
                    default:
                        statusText = 'Agendada';
                        bgColor = '#BBDEFB'; // Azul pastel
                        textColor = '#0D47A1'; // Azul forte
                }

                return (
                    <span
                        style={{
                            backgroundColor: bgColor,
                            color: textColor,
                            padding: '6px 14px',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            display: 'inline-block',
                            minWidth: '110px',
                            textAlign: 'center',
                            boxShadow: 'inset 0 0 2px rgba(0,0,0,0.1)',
                        }}
                    >
                        {statusText}
                    </span>
                );
            },
        },
        {
            accessorKey: 'metodoContato', header: 'Método/Contato', size: 10
        },
        {
            accessorKey: 'aceitaContato',
            header: 'Aceita Contato',
            Cell: ({ cell }) => {
                const aceita = cell.getValue();
                return (
                    <span style={{
                        backgroundColor: aceita ? '#C8E6C9' : '#FFCDD2',
                        color: aceita ? '#1B5E20' : '#c62828',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        display: 'inline-block',
                        minWidth: '60px',
                        textAlign: 'center'
                    }}>
                        {aceita ? 'Sim' : 'Não'}
                    </span>
                );
            }
        },
        {
            header: 'Ações',
            muiTableBodyCellProps: {
                align: 'left',
            },
            Cell: ({ row }) => (
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.5rem' }}>
                    <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditOrcamento(row.original)}>
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
        <div className='OrcamentoManagement'>
            <div className="container-management">
                <Sidebar1 />

                {/* Modal de Edição */}
                {/* Modal de Edição */}
                <Dialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '16px',
                            padding: '24px',
                            backgroundColor: '#fafafa',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontWeight: 600,
                            fontSize: '27px',
                            color: '#2f7c37',
                            textAlign: 'center',
                            paddingBottom: '8px',
                        }}
                    >
                        Editar Orçamento
                    </DialogTitle>

                    <DialogContent sx={{ mt: 2 }}>
                        <form onSubmit={handleUpdateOrcamento}>

                            {/* Campo Data */}
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">

                                <DesktopDatePicker
                                    label="Data da Coleta"
                                    value={editOrcamento.dataColeta ? dayjs(editOrcamento.dataColeta) : null}
                                    onChange={handleDateChange}
                                    shouldDisableDate={shouldDisableDate}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            margin: 'dense',
                                            error: !!dateError,
                                            helperText: dateError,
                                            sx: {
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#ECECEC',
                                                    borderRadius: '8px',
                                                },
                                            },
                                        },
                                    }}
                                />

                                {/* Campo Hora */}
                                <DesktopTimePicker
                                    label="Hora da Coleta"
                                    value={editOrcamento.horaColeta ? dayjs(editOrcamento.horaColeta.substring(0, 5), 'HH:mm') : null}
                                    onChange={handleTimeChange}

                                    shouldDisableTime={shouldDisableTime}

                                    slotProps={{
                                        textField: {
                                            error: !!timeError,
                                            helperText: timeError,
                                            fullWidth: true,
                                            margin: 'dense',
                                            sx: {
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#ECECEC',
                                                    borderRadius: '8px',
                                                },
                                                '& .MuiSelect-icon': {
                                                    color: '#2f7c37',
                                                    right: '8px',
                                                }
                                            },
                                        },
                                    }}
                                    views={['hours', 'minutes']}
                                    format="HH:mm"
                                    ampm={false}
                                />
                            </LocalizationProvider>
                            <TextField
                                select
                                label="Método de Contato"
                                value={editOrcamento.metodoContato || ''}
                                onChange={(e) => setEditOrcamento({ ...editOrcamento, metodoContato: e.target.value })}
                                fullWidth
                                margin="dense"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#ECECEC',
                                        borderRadius: '8px',
                                    },
                                    '& .MuiSelect-icon': {
                                        color: '#2f7c37',
                                        right: '8px',
                                    }
                                }}
                            >
                                <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                                <MenuItem value="Email">Email</MenuItem>
                            </TextField>
                            {/* Campo Status */}
                            <TextField
                                select
                                label="Status"
                                value={editOrcamento.codStatus}
                                onChange={(e) => setEditOrcamento({ ...editOrcamento, codStatus: e.target.value })}
                                fullWidth
                                margin="dense"
                                helperText={`Status atual: ${currentOrcamento?.codStatus || 'Agendada'}`}

                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#ECECEC',
                                        borderRadius: '8px',
                                    },
                                    '& .MuiSelect-icon': {
                                        color: '#2f7c37',
                                        right: '8px',
                                    }
                                }}
                            >
                                <MenuItem value="AGENDADA">Agendada</MenuItem>
                                <MenuItem value="EM ANDAMENTO">Em andamento</MenuItem>
                                <MenuItem value="CONCLUIDA">Concluída</MenuItem>
                                <MenuItem value="INATIVO">Inativo</MenuItem>
                            </TextField>
                            {/* Campo Método de Contato */}

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={editOrcamento.aceitaContato}
                                        onChange={(e) => setEditOrcamento({ ...editOrcamento, aceitaContato: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label="Aceita ser contactado"
                            />
                        </form>
                    </DialogContent>

                    <DialogActions sx={{ justifyContent: 'space-between', padding: '16px 24px 0' }}>
                        <Button
                            onClick={() => setEditDialogOpen(false)}
                            variant="outlined"
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                color: '#2f7c37',
                                borderColor: '#2f7c37',
                                px: 3,
                                '&:hover': {
                                    backgroundColor: '#f1f8f2',
                                    borderColor: '#2f7c37',
                                },
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleUpdateOrcamento}
                            variant="contained"
                            disabled={loadingSubmit || disableSaveButton}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                backgroundColor: disableSaveButton ? '#cccccc' : '#2f7c37',
                                px: 3,
                                '&:hover': {
                                    backgroundColor: disableSaveButton ? '#cccccc' : '#256b2f',
                                },
                            }}
                        >
                            {loadingSubmit ? <CircularProgress size={22} color="inherit" /> : 'Salvar'}
                        </Button>
                    </DialogActions>
                </Dialog>

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
                <h1 className='titleManag'>Gerenciamento de Orçamentos</h1>

                <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '550px' }}>
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
                {isEditing && (
                    <div className="form-container">
                        <form onSubmit={handleUpdateOrcamento}>
                            <h2>Editar Orçamento</h2>

                            <TextField
                                select
                                label="Categoria"
                                value={editOrcamento.categoria?.id || ''}
                                onChange={(e) => {
                                    const selectedCategory = categories.find(c => c.id === e.target.value);
                                    setEditOrcamento({ ...editOrcamento, categoria: selectedCategory });
                                }}
                                fullWidth
                                margin="normal"

                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.nome} (R$ {category.precoPorKg?.toFixed(2)}/kg)
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Data da Coleta"
                                type="date"
                                value={editOrcamento.dataColeta}
                                onChange={(e) => setEditOrcamento({ ...editOrcamento, dataColeta: e.target.value })}
                                fullWidth
                                margin="normal"

                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                label="Hora da Coleta"
                                type="time"
                                value={editOrcamento.horaColeta}
                                onChange={(e) => setEditOrcamento({ ...editOrcamento, horaColeta: e.target.value })}
                                fullWidth
                                margin="normal"

                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                select
                                label="Método de Contato"
                                value={editOrcamento.metodoContato}
                                onChange={(e) => setEditOrcamento({ ...editOrcamento, metodoContato: e.target.value })}
                                fullWidth
                                margin="normal"

                            >
                                <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                                <MenuItem value="Telefone">Telefone</MenuItem>
                                <MenuItem value="Email">Email</MenuItem>
                            </TextField>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={editOrcamento.aceitaContato}
                                        onChange={(e) => setEditOrcamento({ ...editOrcamento, aceitaContato: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label="Aceita ser contactado"
                            />

                            <div className="form-buttons">
                                <button type="submit" className='ADD_button' disabled={loadingSubmit}>
                                    {loadingSubmit ? <CircularProgress size={24} /> : 'Atualizar'}
                                </button>

                                <button type="button" onClick={handleCancelEdit} className='CANCEL_button'>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="table-container">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Carregando dados...</p>
                        </div>
                    ) : (
                        <MaterialReactTable
                            columns={columns}
                            data={filteredOrcamentos}
                            state={{ pagination }}
                            onPaginationChange={setPagination}
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [5, 10, 20],
                            }}
                            enableColumnResizing={false}
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
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
                </Snackbar>
            </div>
        </div>
    );
}

export default OrcamentoManagement;