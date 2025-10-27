import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const LocationsContainer = styled.div`
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

const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const LocationCard = styled.div`
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

const LocationName = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
  padding-right: ${props => props.theme.spacing['2xl']};
`;

const LocationInfo = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const TypeBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 500;
  background-color: ${props => {
    switch (props.type) {
      case 'greenhouse': return props.theme.colors.success;
      case 'field': return props.theme.colors.info;
      case 'nursery': return props.theme.colors.warning;
      case 'laboratory': return props.theme.colors.secondary;
      default: return props.theme.colors.gray[300];
    }
  }};
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

const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.base};
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
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

const Description = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[600]};
  font-style: italic;
  margin-top: ${props => props.theme.spacing.sm};
`;

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location_type: 'greenhouse',
    description: '',
    address: ''
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('/api/crops/locations');
      setLocations(response.data.locations || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Error al cargar las ubicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (location) => {
    setEditingId(location.id);
    setFormData({
      name: location.name,
      location_type: location.location_type,
      description: location.description || '',
      address: location.address || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      location_type: 'greenhouse',
      description: '',
      address: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Editar ubicación existente
        await axios.put(`/api/crops/locations/${editingId}`, formData);
        alert('Ubicación actualizada exitosamente!');
      } else {
        // Crear nueva ubicación
        await axios.post('/api/crops/locations', formData);
        alert('Ubicación creada exitosamente!');
      }
      await fetchLocations();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Error al guardar la ubicación: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      greenhouse: 'Invernadero',
      field: 'Campo Abierto',
      nursery: 'Vivero',
      laboratory: 'Laboratorio'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <LocationsContainer>
        <LoadingSpinner>Cargando ubicaciones...</LoadingSpinner>
      </LocationsContainer>
    );
  }

  if (error) {
    return (
      <LocationsContainer>
        <div style={{ textAlign: 'center', color: '#dc3545' }}>
          {error}
        </div>
      </LocationsContainer>
    );
  }

  return (
    <LocationsContainer>
      <Header>
        <Title>Mis Ubicaciones</Title>
        <AddButton onClick={() => setShowModal(true)}>+ Nueva Ubicación</AddButton>
      </Header>

      {showModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingId ? 'Editar Ubicación' : 'Nueva Ubicación'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Nombre de la Ubicación *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Invernadero Principal"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="location_type">Tipo de Ubicación *</Label>
                <Select
                  id="location_type"
                  name="location_type"
                  value={formData.location_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="greenhouse">Invernadero</option>
                  <option value="field">Campo Abierto</option>
                  <option value="nursery">Vivero</option>
                  <option value="laboratory">Laboratorio</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Ej: Zona A - Finca El Cafetal"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">Descripción</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe las características de esta ubicación..."
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? 'Guardar Cambios' : 'Crear Ubicación'}
                </Button>
              </ButtonGroup>
            </Form>
          </Modal>
        </ModalOverlay>
      )}

      <LocationsGrid>
        {locations.map((location) => (
          <LocationCard key={location.id}>
            <EditButton onClick={() => handleEdit(location)}>Editar</EditButton>
            <LocationName>{location.name}</LocationName>
            <LocationInfo>
              <InfoRow>
                <span>Tipo:</span>
                <TypeBadge type={location.location_type}>
                  {getTypeLabel(location.location_type)}
                </TypeBadge>
              </InfoRow>
              {location.address && (
                <InfoRow>
                  <span>Dirección:</span>
                  <span>{location.address}</span>
                </InfoRow>
              )}
              <InfoRow>
                <span>Creada:</span>
                <span>{new Date(location.created_at).toLocaleDateString()}</span>
              </InfoRow>
            </LocationInfo>
            {location.description && (
              <Description>{location.description}</Description>
            )}
          </LocationCard>
        ))}
      </LocationsGrid>

      {locations.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#6c757d'
        }}>
          <h3>No tienes ubicaciones registradas</h3>
          <p>Comienza agregando tu primera ubicación</p>
        </div>
      )}
    </LocationsContainer>
  );
};

export default Locations;
