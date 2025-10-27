import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.md};
  border-bottom: 3px solid ${props => props.theme.colors.primary};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.gray[900]};
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: 700;
  margin: 0;
`;

const MenuButton = styled.button`
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.md};
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
    transform: scale(1.05);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: ${props => props.theme.spacing.lg};
  min-width: 250px;
  z-index: 1000;
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const MenuTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 2px solid ${props => props.theme.colors.primary};
`;

const FilterItem = styled.label`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  cursor: pointer;
  color: ${props => props.theme.colors.gray[700]};
  font-size: ${props => props.theme.fontSizes.sm};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  input {
    margin-right: ${props => props.theme.spacing.sm};
    cursor: pointer;
  }
`;

const RiegoButton = styled.button`
  background: ${props => props.active ? '#2ecc71' : '#e74c3c'};
  color: ${props => props.theme.colors.white};
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.base};
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  position: relative;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 700;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 2px solid ${props => props.theme.colors.primary};
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.gray[50]};
  margin-bottom: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const HeatmapCell = styled.div`
  aspect-ratio: 1;
  background: ${props => {
    const intensity = props.value || 0;
    // Mapa de calor típico: azul (bajo) -> verde -> amarillo -> rojo (alto)
    if (intensity < 0.25) return '#3498db'; // Azul
    if (intensity < 0.5) return '#2ecc71';  // Verde
    if (intensity < 0.75) return '#f1c40f'; // Amarillo
    return '#e74c3c'; // Rojo
  }};
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const HeatmapLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.gray[50]};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const LegendGradient = styled.div`
  flex: 1;
  height: 20px;
  background: linear-gradient(90deg, #3498db 0%, #2ecc71 33%, #f1c40f 66%, #e74c3c 100%);
  border-radius: ${props => props.theme.borderRadius.sm};
  margin: 0 ${props => props.theme.spacing.md};
`;

const LegendText = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const MetricCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-left: 4px solid ${props => {
    if (props.variant === 'humidity') return '#3498db';
    if (props.variant === 'temperature') return '#e74c3c';
    if (props.variant === 'status') return '#2ecc71';
    return props.theme.colors.primary;
  }};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const MetricLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const MetricValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const MetricStatus = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 600;
  color: ${props => props.theme.colors.secondary};
`;

const ChartSection = styled(Section)``;

const AlertsSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const AlertItem = styled.li`
  color: ${props => props.theme.colors.gray[800]};
  font-size: ${props => props.theme.fontSizes.base};
  margin-bottom: ${props => props.theme.spacing.md};
  list-style: none;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.gray[50]};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => props.theme.colors.primary};
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.gray[100]};
    transform: translateX(5px);
  }
`;

const FooterMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.xl};
`;

const FooterMetricCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  text-align: center;
  border-top: 4px solid ${props => {
    if (props.variant === 'humidity') return '#3498db';
    if (props.variant === 'temperature') return '#e74c3c';
    if (props.variant === 'alerts') return '#e74c3c';
    if (props.variant === 'status') return '#2ecc71';
    if (props.variant === 'sensors') return props.theme.colors.primary;
    return props.theme.colors.secondary;
  }};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const FooterMetricLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FooterMetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.gray[900]};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.primary};
`;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [riegoActivo, setRiegoActivo] = useState(true);
  const [filtros, setFiltros] = useState({
    mostrarHumedad: true,
    mostrarTemperatura: true,
    mostrarAlertas: true,
    mostrarGrafica: true,
  });

  // Generar datos simulados para el mapa de calor
  const generateHeatmapData = () => {
    return Array(64).fill(0).map(() => Math.random());
  };

  // Generar datos para la gráfica
  const generateChartData = () => {
    return [
      { name: '1', zona1: 100, zona2: 80, zona3: 60 },
      { name: '2', zona1: 60, zona2: 80, zona3: 40 },
      { name: '3', zona1: 30, zona2: 60, zona3: 50 },
    ];
  };

  const toggleFiltro = (filtro) => {
    setFiltros({
      ...filtros,
      [filtro]: !filtros[filtro]
    });
  };

  const toggleRiego = () => {
    setRiegoActivo(!riegoActivo);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewResponse, chartsResponse, alertsResponse] = await Promise.all([
          axios.get('/api/dashboard/overview'),
          axios.get('/api/dashboard/charts/sensor-data?days=7'),
          axios.get('/api/dashboard/alerts')
        ]);

        setDashboardData({
          overview: overviewResponse.data,
          charts: chartsResponse.data,
          alerts: alertsResponse.data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.menu-container')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>Cargando dashboard...</LoadingSpinner>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', color: '#dc3545' }}>
          {error}
        </div>
      </DashboardContainer>
    );
  }

  const { overview } = dashboardData;
  const heatmapData = generateHeatmapData();
  const chartData = generateChartData();

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard de Monitoreo</Title>
        <HeaderActions>
          <RiegoButton active={riegoActivo} onClick={toggleRiego}>
            {riegoActivo ? '💧 Desactivar Riego' : '🚫 Activar Riego'}
          </RiegoButton>
          <div className="menu-container">
            <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
              ☰
            </MenuButton>
            {menuOpen && (
              <DropdownMenu>
                <MenuTitle>Filtros de Vista</MenuTitle>
                <FilterItem>
                  <input 
                    type="checkbox" 
                    checked={filtros.mostrarHumedad}
                    onChange={() => toggleFiltro('mostrarHumedad')}
                  />
                  Mostrar Humedad
                </FilterItem>
                <FilterItem>
                  <input 
                    type="checkbox" 
                    checked={filtros.mostrarTemperatura}
                    onChange={() => toggleFiltro('mostrarTemperatura')}
                  />
                  Mostrar Temperatura
                </FilterItem>
                <FilterItem>
                  <input 
                    type="checkbox" 
                    checked={filtros.mostrarAlertas}
                    onChange={() => toggleFiltro('mostrarAlertas')}
                  />
                  Mostrar Alertas
                </FilterItem>
                <FilterItem>
                  <input 
                    type="checkbox" 
                    checked={filtros.mostrarGrafica}
                    onChange={() => toggleFiltro('mostrarGrafica')}
                  />
                  Mostrar Gráfica
                </FilterItem>
              </DropdownMenu>
            )}
          </div>
        </HeaderActions>
      </Header>

      <MetricsRow>
        {filtros.mostrarHumedad && (
          <MetricCard variant="humidity">
            <MetricLabel>Humedad Promedio</MetricLabel>
            <MetricValue>72%</MetricValue>
          </MetricCard>
        )}
        
        {filtros.mostrarTemperatura && (
          <MetricCard variant="temperature">
            <MetricLabel>Temperatura</MetricLabel>
            <MetricValue>21°C</MetricValue>
          </MetricCard>
        )}
        
        <MetricCard variant="status">
          <MetricLabel>Estado del Riego</MetricLabel>
          <MetricStatus>{riegoActivo ? 'Activo' : 'Inactivo'}</MetricStatus>
        </MetricCard>
      </MetricsRow>

      <MainGrid>
        <Section>
          <SectionTitle>Vista General del Cultivo</SectionTitle>
          <HeatmapGrid>
            {heatmapData.map((value, index) => (
              <HeatmapCell key={index} value={value} />
            ))}
          </HeatmapGrid>
          <HeatmapLegend>
            <LegendText>Bajo</LegendText>
            <LegendGradient />
            <LegendText>Alto</LegendText>
          </HeatmapLegend>
        </Section>

        {filtros.mostrarGrafica && (
          <ChartSection>
            <SectionTitle>Humedad del Suelo por Zonas</SectionTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#7c247c" />
                <YAxis domain={[0, 100]} stroke="#7c247c" />
                <Tooltip 
                  contentStyle={{
                    background: 'linear-gradient(135deg, #7c247c, #489a47)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="zona1" stroke="#7c247c" strokeWidth={4} name="Zona 1" />
                <Line type="monotone" dataKey="zona2" stroke="#489a47" strokeWidth={4} name="Zona 2" />
                <Line type="monotone" dataKey="zona3" stroke="#FF9800" strokeWidth={4} name="Zona 3" />
              </LineChart>
            </ResponsiveContainer>
          </ChartSection>
        )}
      </MainGrid>

      {filtros.mostrarAlertas && (
        <AlertsSection>
          <SectionTitle>Alertas Destacadas</SectionTitle>
          <ul style={{ paddingLeft: '0', margin: 0 }}>
            <AlertItem>Riego necesario en Zona 2</AlertItem>
            <AlertItem>Posible riesgo de hongos</AlertItem>
          </ul>
        </AlertsSection>
      )}

      <FooterMetrics>
        <FooterMetricCard variant="alerts">
          <FooterMetricLabel>Alertas Activas</FooterMetricLabel>
          <FooterMetricValue>2</FooterMetricValue>
        </FooterMetricCard>
        
        <FooterMetricCard variant="status">
          <FooterMetricLabel>Sistema de Riego</FooterMetricLabel>
          <MetricStatus>{riegoActivo ? 'Activado' : 'Desactivado'}</MetricStatus>
        </FooterMetricCard>
        
        <FooterMetricCard variant="sensors">
          <FooterMetricLabel>Sensores Activos</FooterMetricLabel>
          <FooterMetricValue>{overview.overview.totalSensors}</FooterMetricValue>
        </FooterMetricCard>
      </FooterMetrics>
    </DashboardContainer>
  );
};

export default Dashboard;
