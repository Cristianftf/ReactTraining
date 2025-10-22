import { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiShield, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { statsApi } from '../services/api';
import './dashboard.css';


interface Stats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentSignups: number;
}

interface ChartData {
  name: string;
  usuarios: number;
  admins: number;
}

// Toast notification helper (simple implementation)
const addToast = (type: 'error' | 'success', message: string) => {
  console.error(`[${type.toUpperCase()}]`, message);
};

export function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    recentSignups: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  const fetchStats = async () => {
    try {
        const data = await statsApi.getOverview();
        setStats(data);
      } catch (error: any) {
        console.error('Error al cargar estadísticas:', error);
        if (error?.status === 401) {
          addToast('error', 'Sesión expirada. Redirigiendo al login...');
          logout();
          return;
        }
        addToast('error', error.message || 'No se pudieron cargar las estadísticas');
      } finally {
        setLoading(false);
      }
  };

  const fetchChartData = async () => {
    try {
      const data = await statsApi.getChartData();
      setChartData(data);
    } catch (error: any) {
      console.error('Error al cargar datos del gráfico:', error);
      setChartData([]);
    }
  };

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsers,
      icon: FiUsers,
      color: 'primary',
      change: stats.totalUsers > 0 ? '+12%' : '—', // Evita mostrar cambio si no hay datos
    },
    {
      title: 'Administradores',
      value: stats.adminUsers,
      icon: FiShield,
      color: 'accent',
      change: stats.adminUsers > 0 ? `+${stats.adminUsers}` : '—',
    },
    {
      title: 'Usuarios Regulares',
      value: stats.regularUsers,
      icon: FiUserCheck,
      color: 'info',
      change: stats.regularUsers > 0 ? '+10%' : '—',
    },
    {
      title: 'Nuevos (30 días)',
      value: stats.recentSignups,
      icon: FiTrendingUp,
      color: 'success',
      change: stats.recentSignups > 0 ? `+${stats.recentSignups}` : '—',
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-header">
        <div className="welcome-content">
          <h1 className="dashboard-title">
            Hola, {user?.name || 'Usuario'} 👋
          </h1>
          <p className="dashboard-subtitle">
            Aquí está un resumen de tu sistema de gestión de usuarios
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`stat-card stat-${stat.color}`}>
              <div className="stat-header">
                <div className="stat-icon-wrapper">
                  <Icon size={24} />
                </div>
                <span className="stat-change">{stat.change}</span>
              </div>
              <div className="stat-content">
                <h3 className="stat-title">{stat.title}</h3>
                <p className="stat-value">
                  {loading ? (
                    <span className="stat-skeleton"></span>
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <div className="chart-header">
          <div>
            <h2 className="chart-title">Crecimiento de Usuarios</h2>
            <p className="chart-subtitle">Estadísticas de los últimos 6 meses</p>
          </div>
        </div>

        <div className="chart-container">
          {loading ? (
            <div className="chart-loading">
              <div className="loading-spinner"></div>
              <p>Cargando gráfico...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="colorAdmins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  style={{ fontSize: '0.875rem', fontWeight: 500 }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '0.875rem', fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ fontWeight: 600, color: '#0f172a' }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
                <Bar
                  dataKey="usuarios"
                  fill="url(#colorUsuarios)"
                  radius={[8, 8, 0, 0]}
                  name="Usuarios"
                />
                <Bar
                  dataKey="admins"
                  fill="url(#colorAdmins)"
                  radius={[8, 8, 0, 0]}
                  name="Administradores"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">Acciones Rápidas</h2>
        <div className="actions-grid">
          <a href="/users" className="action-card">
            <FiUsers size={24} />
            <span>Ver Usuarios</span>
          </a>
          <a href="/users" className="action-card">
            <FiUserCheck size={24} />
            <span>Agregar Usuario</span>
          </a>
          <a href="#" className="action-card">
            <FiShield size={24} />
            <span>Configuración</span>
          </a>
        </div>
      </div>
    </div>
  );
}