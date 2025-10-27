import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ReportsContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const FiltersSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.gray[700]};
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.base};
  background-color: ${props => props.theme.colors.white};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(124, 36, 124, 0.1);
  }
`;

const GenerateButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.gray[800]};
    transform: translateY(-1px);
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const ReportCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.xl};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const ReportTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ReportDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ReportButton = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.white};
  border: none;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background-color: ${props => props.theme.colors.gray[700]};
    transform: translateY(-1px);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.primary};
`;

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    period: '7',
    crop: 'all',
    sensor: 'all'
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    // Aquí implementarías la lógica para generar reportes
    setTimeout(() => {
      setLoading(false);
      alert('Reporte generado exitosamente');
    }, 2000);
  };

  const reportTypes = [
    {
      id: 1,
      title: 'Reporte de Rendimiento',
      description: 'Análisis del rendimiento de cultivos por período seleccionado',
      type: 'performance'
    },
    {
      id: 2,
      title: 'Reporte de Sensores',
      description: 'Datos históricos y análisis de sensores ambientales',
      type: 'sensors'
    },
    {
      id: 3,
      title: 'Reporte de Alertas',
      description: 'Resumen de alertas y notificaciones del sistema',
      type: 'alerts'
    },
    {
      id: 4,
      title: 'Reporte de Cultivos',
      description: 'Estado y progreso de todos los cultivos activos',
      type: 'crops'
    }
  ];

  return (
    <ReportsContainer>
      <Header>
        <Title>Reportes y Análisis</Title>
        <Subtitle>Genera reportes detallados de tu sistema de cultivos</Subtitle>
      </Header>

      <FiltersSection>
        <h3 style={{ marginBottom: '1rem', color: '#7c247c' }}>Filtros de Reporte</h3>
        <FilterRow>
          <FilterGroup>
            <Label htmlFor="period">Período</Label>
            <Select
              id="period"
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="365">Último año</option>
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <Label htmlFor="crop">Cultivo</Label>
            <Select
              id="crop"
              name="crop"
              value={filters.crop}
              onChange={handleFilterChange}
            >
              <option value="all">Todos los cultivos</option>
              <option value="tomato">Tomate</option>
              <option value="lettuce">Lechuga</option>
              <option value="pepper">Pimiento</option>
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <Label htmlFor="sensor">Sensor</Label>
            <Select
              id="sensor"
              name="sensor"
              value={filters.sensor}
              onChange={handleFilterChange}
            >
              <option value="all">Todos los sensores</option>
              <option value="temperature">Temperatura</option>
              <option value="humidity">Humedad</option>
              <option value="ph">pH</option>
            </Select>
          </FilterGroup>
        </FilterRow>
        
        <GenerateButton onClick={handleGenerateReport} disabled={loading}>
          {loading ? 'Generando...' : 'Generar Reporte'}
        </GenerateButton>
      </FiltersSection>

      <ReportsGrid>
        {reportTypes.map((report) => (
          <ReportCard key={report.id}>
            <ReportTitle>{report.title}</ReportTitle>
            <ReportDescription>{report.description}</ReportDescription>
            <ReportButton onClick={() => alert(`Generando ${report.title}...`)}>
              Generar Reporte
            </ReportButton>
          </ReportCard>
        ))}
      </ReportsGrid>
    </ReportsContainer>
  );
};

export default Reports;
