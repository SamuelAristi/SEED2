import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const SensorsContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
`;

const AddButton = styled.button`
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

const SensorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const SensorCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.xl};
  transition: transform 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const EditButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.info};
  color: ${props => props.theme.colors.white};
  border: none;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    transform: scale(1.05);
  }
`;

const SensorName = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
  padding-right: ${props => props.theme.spacing['2xl']};
`;

const SensorInfo = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const StatusBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.status) {
      case 'active': return props.theme.colors.success;
      case 'inactive': return props.theme.colors.danger;
      case 'maintenance': return props.theme.colors.warning;
      default: return props.theme.colors.gray[300];
    }
  }};
  color: ${props => props.theme.colors.white};
`;

const TypeBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 500;
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.white};
  text-transform: uppercase;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.primary};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 2px solid ${props => props.theme.colors.primary};
`;

const ModalTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.gray[600]};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.danger};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.gray[700]};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.base};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
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
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${props => props.variant === 'secondary' ? `
    background-color: ${props.theme.colors.gray[300]};
    color: ${props.theme.colors.gray[700]};
    
    &:hover {
      background-color: ${props.theme.colors.gray[400]};
    }
  ` : `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.white};
    
    &:hover {
      background-color: ${props.theme.colors.secondary};
      transform: translateY(-1px);
    }
  `}
`;

const Sensors = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sensor_type: 'temperature',
    location_id: '',
    status: 'active'
  });

  useEffect(() => {
    fetchSensors();
    fetchLocations();
  }, []);

  const fetchSensors = async () => {
    try {
      const response = await axios.get('/api/sensors');
      setSensors(response.data.sensors || []);
    } catch (error) {
      console.error('Error fetching sensors:', error);
      setError('Error al cargar los sensores');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('/api/crops/locations');
      setLocations(response.data.locations || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (sensor) => {
    setEditingId(sensor.id);
    setFormData({
      name: sensor.name,
      sensor_type: sensor.sensor_type,
      location_id: sensor.location_id,
      status: sensor.status
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      sensor_type: 'temperature',
      location_id: '',
      status: 'active'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Editar sensor existente
        await axios.put(`/api/sensors/${editingId}`, formData);
        alert('Sensor actualizado exitosamente!');
      } else {
        // Crear nuevo sensor
        await axios.post('/api/sensors', formData);
        alert('Sensor creado exitosamente!');
      }
      await fetchSensors();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving sensor:', error);
      alert('Error al guardar el sensor: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  if (loading) {
    return (
      <SensorsContainer>
        <LoadingSpinner>Cargando sensores...</LoadingSpinner>
      </SensorsContainer>
    );
  }

  if (error) {
    return (
      <SensorsContainer>
        <div style={{ textAlign: 'center', color: '#dc3545' }}>
          {error}
        </div>
      </SensorsContainer>
    );
  }

  return (
    <SensorsContainer>
      <Header>
        <Title>Mis Sensores</Title>
        <AddButton onClick={() => setShowModal(true)}>+ Nuevo Sensor</AddButton>
      </Header>

      {showModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingId ? 'Editar Sensor' : 'Nuevo Sensor'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Nombre del Sensor *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Sensor de Temperatura - Zona A"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="sensor_type">Tipo de Sensor *</Label>
                <Select
                  id="sensor_type"
                  name="sensor_type"
                  value={formData.sensor_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="temperature">Temperatura</option>
                  <option value="humidity">Humedad Ambiental</option>
                  <option value="soil_moisture">Humedad del Suelo</option>
                  <option value="ph">pH del Suelo</option>
                  <option value="light">Luminosidad</option>
                  <option value="soil_temperature">Temperatura del Suelo</option>
                  <option value="co2">CO2</option>
                  <option value="rainfall">Pluviómetro</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="location_id">Ubicación *</Label>
                {locations.length === 0 ? (
                  <div style={{ 
                    padding: '1rem', 
                    background: '#fff3cd', 
                    border: '1px solid #ffc107', 
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}>
                    No tienes ubicaciones creadas. Crea una ubicación desde la sección de Cultivos primero.
                  </div>
                ) : (
                  <Select
                    id="location_id"
                    name="location_id"
                    value={formData.location_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona una ubicación</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} ({location.location_type})
                      </option>
                    ))}
                  </Select>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="status">Estado *</Label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="maintenance">Mantenimiento</option>
                </Select>
              </FormGroup>

              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? 'Guardar Cambios' : 'Crear Sensor'}
                </Button>
              </ButtonGroup>
            </Form>
          </Modal>
        </ModalOverlay>
      )}

      <SensorsGrid>
        {sensors.map((sensor) => (
          <SensorCard key={sensor.id}>
            <EditButton onClick={() => handleEdit(sensor)}>Editar</EditButton>
            <SensorName>{sensor.name}</SensorName>
            <SensorInfo>
              <InfoRow>
                <span>Tipo:</span>
                <TypeBadge>{sensor.sensor_type}</TypeBadge>
              </InfoRow>
              <InfoRow>
                <span>Ubicación:</span>
                <span>{sensor.locations?.name || 'N/A'}</span>
              </InfoRow>
              <InfoRow>
                <span>Estado:</span>
                <StatusBadge status={sensor.status}>
                  {sensor.status}
                </StatusBadge>
              </InfoRow>
              <InfoRow>
                <span>Instalado:</span>
                <span>{new Date(sensor.created_at).toLocaleDateString()}</span>
              </InfoRow>
            </SensorInfo>
          </SensorCard>
        ))}
      </SensorsGrid>

      {sensors.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#6c757d'
        }}>
          <h3>No tienes sensores registrados</h3>
          <p>Comienza agregando tu primer sensor</p>
        </div>
      )}
    </SensorsContainer>
  );
};

export default Sensors;
