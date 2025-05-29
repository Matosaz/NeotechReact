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
import Sidebar1 from '../Sidebar/SidebarManagement';
import './Dashboard.css';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const API_BASE_URL = "https://intellij-neotech.onrender.com/api/v1/users";

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

  // Dados mockados para demonstração (substitua com seus dados reais)
  const userGrowthData = [
    { name: 'Jan', users: 120 },
    { name: 'Fev', users: 210 },
    { name: 'Mar', users: 350 },
    { name: 'Abr', users: 480 },
    { name: 'Mai', users: 600 },
    { name: 'Jun', users: 780 },
  ];
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

  const userLocationData = processLocationData();


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
                <span>+12% em relação ao mês anterior</span>
              </div>
              
              <div className="metric-card success">
                <h3>Usuários Ativos</h3>
                <p>{usuariosAtivos}</p>
                <span>{taxaAtivacao}% de taxa de ativação</span>
              </div>
              
              <div className="metric-card warning">
                <h3>Novos (últimos 30 dias)</h3>
                <p>84</p>
                <span>+8% em relação ao mês anterior</span>
              </div>
              
              <div className="metric-card info">
                <h3>Engajamento</h3>
                <p>68%</p>
                <span>Média de 4.2 logins/semana</span>
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
                          fontWeight:"600",
                          fontSize:"14px",
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
                  <div className="activity-item">
                    <div className="activity-icon success">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div className="activity-details">
                      <p>25 novos usuários cadastrados</p>
                      <span>Hoje, 10:45 AM</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon warning">
                      <i className="fas fa-user-clock"></i>
                    </div>
                    <div className="activity-details">
                      <p>12 usuários inativos há 30 dias</p>
                      <span>Ontem, 3:30 PM</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon primary">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="activity-details">
                      <p>Pico de acessos - 1,240 logins</p>
                      <span>15 Mai, 9:15 AM</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon info">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="activity-details">
                      <p>Maior crescimento: Região Nordeste (+18%)</p>
                      <span>14 Mai, 5:20 PM</span>
                    </div>
                  </div>
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