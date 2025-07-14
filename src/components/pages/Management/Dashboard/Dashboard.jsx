import React, { useState, useEffect } from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { User, CalendarCheck, Truck , CheckCircle, XCircle } from 'lucide-react';
import Sidebar1 from '../Sidebar/SidebarManagement';
import './Dashboard.css';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = "https://intellij-neotech.onrender.com/api/v1/users";
  const ORCAMENTOS_API_URL = "https://intellij-neotech.onrender.com/api/v1/orcamentos";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, orcamentosResponse] = await Promise.all([
          fetch(API_BASE_URL),
          fetch(ORCAMENTOS_API_URL)
        ]);
        
        const usersData = await usersResponse.json();
        const orcamentosData = await orcamentosResponse.json();
        
        setUsers(usersData);
        setOrcamentos(orcamentosData);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  const calculateNewUsersLast30Days = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return users.filter(user => {
      const userDate = new Date(user.dataCriacao);
      return userDate > thirtyDaysAgo;
    }).length;
  };
  const calculateNewUsersGrowth = () => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthNewUsers = users.filter(user => {
      const userDate = new Date(user.dataCriacao);
      return userDate >= currentMonthStart;
    }).length;

    const prevMonthNewUsers = users.filter(user => {
      const userDate = new Date(user.dataCriacao);
      return userDate >= prevMonthStart && userDate <= prevMonthEnd;
    }).length;

    if (prevMonthNewUsers === 0) return '+0%';

    const growth = ((currentMonthNewUsers - prevMonthNewUsers) / prevMonthNewUsers) * 100;
    return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };
  const processUserGrowth = () => {
    if (!users.length) return [];

    // Agrupa usuários por mês de criação
    const usersByMonth = users.reduce((acc, user) => {
      const date = new Date(user.dataCriacao); // Assumindo que existe dataCriacao na API
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear]++;
      return acc;
    }, {});

    // Adicione esta função para calcular a variação em relação ao mês anterior

    // Converte para formato de dados do gráfico
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const result = Object.entries(usersByMonth).map(([monthYear, count]) => {
      const [year, month] = monthYear.split('-');
      return {
        name: `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`,
        users: count
      };
    });

    // Ordena por data
    return result.sort((a, b) => {
      const [aMonth, aYear] = a.name.split('/');
      const [bMonth, bYear] = b.name.split('/');
      return (
        parseInt(aYear) - parseInt(bYear) ||
        monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth)
      );
    });
  };

  const calculateGrowthRate = (data) => {
    if (data.length < 2) return '0%';

    const lastMonth = data[data.length - 1].users;
    const prevMonth = data[data.length - 2].users;
    const growth = ((lastMonth - prevMonth) / prevMonth) * 100;

    return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };
  // Dados mockados para demonstração (substitua com seus dados reais)

  const processLocationData = () => {
    const stateCounts = users.reduce((acc, user) => {
      // Se não houver estado, agrupar como "Não selecionado"
      const state = user.estado && user.estado.trim() !== '' ? user.estado.toUpperCase() : 'Não selecionado';

      if (!acc[state]) {
        acc[state] = 0;
      }
      acc[state]++;
      return acc;
    }, {});

    // Ordena por quantidade e limita aos top 5 (excluindo "Não selecionado" do limite)
    const entries = Object.entries(stateCounts);
    const filtered = entries.filter(([state]) => state !== 'Não selecionado');
    const sortedStates = filtered
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Conta quantos são "outros", ignorando os top 5 e "Não selecionado"
    const otherStatesCount = filtered.length > 5
      ? filtered.slice(5).reduce((sum, [, count]) => sum + count, 0)
      : 0;

    const result = sortedStates.map(([state, count]) => ({
      name: state,
      value: count
    }));

    if (otherStatesCount > 0) {
      result.push({ name: 'Outros', value: otherStatesCount });
    }

    // Adiciona "Não selecionado" no fim, se houver
    if (stateCounts['Não selecionado']) {
      result.push({ name: 'Não selecionado', value: stateCounts['Não selecionado'] });
    }

    return result;
  };

  const userStatusData = [
    { name: 'Ativos', value: users.filter(user => user.codStatus === 'ATIVO').length },
    { name: 'Inativos', value: users.filter(user => user.codStatus !== 'ATIVO').length },
  ];
  const getRecentActivities = () => {
    if (!users.length && !orcamentos.length) return [];

    const activities = [];

    // Adiciona novos usuários
    if (users.length) {
      const sortedUsers = [...users].sort((a, b) =>
        new Date(b.dataCriacao) - new Date(a.dataCriacao)
      );
      
      const recentSignups = sortedUsers.slice(0, 3).map(user => ({
        icon: 'success',
        iconComponent: User,
        text: `Novo usuário: ${user.nome}`,
        date: new Date(user.dataCriacao),
        type: 'user'
      }));
      
      activities.push(...recentSignups);
    }

    // Adiciona orçamentos recentes
    if (orcamentos.length) {
      const sortedOrcamentos = [...orcamentos].sort((a, b) =>
        new Date(b.dataColeta) - new Date(a.dataColeta)
      );
      
      const recentOrcamentos = sortedOrcamentos.slice(0, 4).map(orcamento => {
        const statusIcon = orcamento.codStatus === 'AGENDADA' ? CalendarCheck :
                          orcamento.codStatus === 'EM ANDAMENTO' ? Truck  :
                          orcamento.codStatus === 'CONCLUIDA' ? CheckCircle : XCircle;
        
        const statusText = orcamento.codStatus === 'AGENDADA' ? 'Agendado' :
                          orcamento.codStatus === 'EM ANDAMENTO' ? 'Em andamento' :
                          orcamento.codStatus === 'CONCLUIDA' ? 'Concluído' : 'Inativo';
        
        return {
          icon: orcamento.codStatus === 'CONCLUIDA' ? 'success' : 
                orcamento.codStatus === 'EM ANDAMENTO' ? 'warning' : 'info',
          iconComponent: statusIcon,
          text: `Orçamento ${statusText}: ${orcamento.usuario?.nome || 'Usuário'} - ${orcamento.categorias?.map(c => c.nome).join(', ') || 'Categoria'}`,
          date: new Date(orcamento.dataColeta),
          type: 'orcamento'
        };
      });
      
      activities.push(...recentOrcamentos);
    }

    // Ordena todas as atividades por data e pega as 4 mais recentes
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4)
      .map(activity => ({
        ...activity,
        date: activity.date.toLocaleString('pt-BR', { 
          day: 'numeric', 
          month: 'short', 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }));
  };

  const calculateEngagement = () => {
    // Supondo que temos dados de login
    const activeUsers = users.filter(user => user.codStatus === 'ATIVO').length;
    const totalUsers = users.length;

    const engagementRate = totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(0) : 0;

    // Calcula média de logins (adaptar conforme seus dados)
    const totalLogins = users.reduce((sum, user) => sum + (user.loginCount || 0), 0);
    const avgLogins = totalUsers > 0 ? (totalLogins / totalUsers / 4).toFixed(1) : 0; // Dividido por 4 para simular semanas

    return {
      rate: engagementRate,
      avgLogins: avgLogins
    };
  };

  const userLocationData = processLocationData();
  const userGrowthData = processUserGrowth();


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const totalUsuarios = users.length;
  const usuariosAtivos = userStatusData[0].value;
  const taxaAtivacao = totalUsuarios > 0 ? ((usuariosAtivos / totalUsuarios) * 100).toFixed(1) : 0;

  return (
    <div className="dashboard-container">
      <Sidebar1 />

      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Dashboard de Usuários</h1>

        </header>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando dados...</p>
          </div>
        ) : (
          <>
            <div className="metrics-grid">
              <div className="metric-card primary">
                <h3>Total de Usuários</h3>
                <p>{totalUsuarios}</p>
                <span>{calculateGrowthRate(userGrowthData)} em relação ao mês anterior</span>
              </div>

              <div className="metric-card success">
                <h3>Usuários Ativos</h3>
                <p>{usuariosAtivos}</p>
                <span>{taxaAtivacao}% de taxa de ativação</span>
              </div>
              <div className="metric-card warning">
                <h3>Novos (últimos 30 dias)</h3>
                <p>{calculateNewUsersLast30Days(users)}</p>
                <span>{calculateNewUsersGrowth(users)} em relação ao mês anterior</span>
              </div>
              <div className="metric-card info">
                <h3>Engajamento</h3>
                <p>{calculateEngagement().rate}%</p>
                <span>Média de {calculateEngagement().avgLogins} logins/semana</span>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Crescimento de Usuários</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#4c906b"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Total de Usuários"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h3>Distribuição por Estado</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userLocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {userLocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fafafa',
                          fontWeight: "600",
                          fontSize: "14px",
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h3>Status dos Usuários</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="value"
                        fill="#36b9cc"
                        radius={[15, 15, 0, 0]}
                        name="Quantidade"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h3>Atividade Recente</h3>
                <div className="activity-list">
                  {getRecentActivities().map((activity, index) => {
                    const IconComponent = activity.iconComponent;
                    return (
                      <div className="activity-item" key={index}>
                        <div className={`activity-icon ${activity.icon}`}>
                          <IconComponent size={24} />
                        </div>
                        <div className="activity-details">
                          <p>{activity.text}</p>
                          <span>{activity.date}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;