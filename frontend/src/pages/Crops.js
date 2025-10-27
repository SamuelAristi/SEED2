import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const CropsContainer = styled.div`
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

const CropsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const CropCard = styled.div`
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

const CropName = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
  padding-right: ${props => props.theme.spacing['2xl']};
`;

const CropInfo = styled.div`
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
      case 'harvested': return props.theme.colors.info;
      case 'failed': return props.theme.colors.danger;
      case 'paused': return props.theme.colors.warning;
      default: return props.theme.colors.gray[300];
    }
  }};
  color: ${props => props.theme.colors.white};
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
  z-index: ${props => props.zIndex || 1000};
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

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [varieties, setVarieties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    variety_id: '',
    location_id: '',
    planting_date: '',
    expected_harvest_date: '',
    notes: ''
  });
  const [locationFormData, setLocationFormData] = useState({
    name: '',
    location_type: 'greenhouse',
    description: '',
    address: ''
  });

  useEffect(() => {
    fetchCrops();
    fetchVarieties();
    fetchLocations();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await axios.get('/api/crops');
      setCrops(response.data.crops || []);
    } catch (error) {
      console.error('Error fetching crops:', error);
      setError('Error al cargar los cultivos');
    } finally {
      setLoading(false);
    }
  };

  const fetchVarieties = async () => {
    try {
      const response = await axios.get('/api/crops/varieties');
      setVarieties(response.data.varieties || []);
    } catch (error) {
      console.error('Error fetching varieties:', error);
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

  const handleInputChangeLocation = (e) => {
    setLocationFormData({
      ...locationFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (crop) => {
    setEditingId(crop.id);
    setFormData({
      name: crop.name,
      variety_id: crop.variety_id,
      location_id: crop.location_id,
      planting_date: crop.planting_date ? crop.planting_date.split('T')[0] : '',
      expected_harvest_date: crop.expected_harvest_date ? crop.expected_harvest_date.split('T')[0] : '',
      notes: crop.notes || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      variety_id: '',
      location_id: '',
      planting_date: '',
      expected_harvest_date: '',
      notes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Editar cultivo existente
        await axios.put(`/api/crops/${editingId}`, formData);
        alert('Cultivo actualizado exitosamente!');
      } else {
        // Crear nuevo cultivo
        await axios.post('/api/crops', formData);
        alert('Cultivo creado exitosamente!');
      }
      await fetchCrops();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving crop:', error);
      alert('Error al guardar el cultivo: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/crops/locations', locationFormData);
      setLocations([...locations, response.data.location]);
      setShowLocationModal(false);
      setLocationFormData({
        name: '',
        location_type: 'greenhouse',
        description: '',
        address: ''
      });
      alert('Ubicación creada exitosamente!');
    } catch (error) {
      console.error('Error creating location:', error);
      alert('Error al crear la ubicación: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  if (loading) {
    return (
      <CropsContainer>
        <LoadingSpinner>Cargando cultivos...</LoadingSpinner>
      </CropsContainer>
    );
  }

  if (error) {
    return (
      <CropsContainer>
        <div style={{ textAlign: 'center', color: '#dc3545' }}>
          {error}
        </div>
      </CropsContainer>
    );
  }

  return (
    <CropsContainer>
      <Header>
        <Title>Mis Cultivos</Title>
        <AddButton onClick={() => setShowModal(true)}>+ Nuevo Cultivo</AddButton>
      </Header>

      {showModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingId ? 'Editar Cultivo' : 'Nuevo Cultivo de Café'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Nombre del Cultivo *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Cultivo de Café Zona A"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="variety_id">Variedad *</Label>
                <Select
                  id="variety_id"
                  name="variety_id"
                  value={formData.variety_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona una variedad</option>
                  {varieties.map((variety) => (
                    <option key={variety.id} value={variety.id}>
                      {variety.name} ({variety.variety_type})
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="location_id">
                  Ubicación *
                  <Button 
                    type="button" 
                    onClick={() => setShowLocationModal(true)}
                    style={{ 
                      marginLeft: '1rem', 
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.75rem'
                    }}
                  >
                    + Nueva Ubicación
                  </Button>
                </Label>
                {locations.length === 0 ? (
                  <div style={{ 
                    padding: '1rem', 
                    background: '#fff3cd', 
                    border: '1px solid #ffc107', 
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}>
                    No tienes ubicaciones creadas. Haz clic en "+ Nueva Ubicación" para crear una.
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
                <Label htmlFor="planting_date">Fecha de Siembra *</Label>
                <Input
                  type="date"
                  id="planting_date"
                  name="planting_date"
                  value={formData.planting_date}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="expected_harvest_date">Fecha Esperada de Cosecha</Label>
                <Input
                  type="date"
                  id="expected_harvest_date"
                  name="expected_harvest_date"
                  value={formData.expected_harvest_date}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="notes">Notas</Label>
                <TextArea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Agrega cualquier observación o detalle importante..."
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? 'Guardar Cambios' : 'Crear Cultivo'}
                </Button>
              </ButtonGroup>
            </Form>
          </Modal>
        </ModalOverlay>
      )}

      {showLocationModal && (
        <ModalOverlay zIndex={1001} onClick={() => setShowLocationModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Nueva Ubicación</ModalTitle>
              <CloseButton onClick={() => setShowLocationModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleLocationSubmit}>
              <FormGroup>
                <Label htmlFor="location_name">Nombre de la Ubicación *</Label>
                <Input
                  type="text"
                  id="location_name"
                  name="name"
                  value={locationFormData.name}
                  onChange={handleInputChangeLocation}
                  placeholder="Ej: Invernadero Principal"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="location_type">Tipo de Ubicación *</Label>
                <Select
                  id="location_type"
                  name="location_type"
                  value={locationFormData.location_type}
                  onChange={handleInputChangeLocation}
                  required
                >
                  <option value="greenhouse">Invernadero</option>
                  <option value="field">Campo Abierto</option>
                  <option value="nursery">Vivero</option>
                  <option value="laboratory">Laboratorio</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="location_address">Dirección</Label>
                <Input
                  type="text"
                  id="location_address"
                  name="address"
                  value={locationFormData.address}
                  onChange={handleInputChangeLocation}
                  placeholder="Ej: Zona A - Finca El Cafetal"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="location_description">Descripción</Label>
                <TextArea
                  id="location_description"
                  name="description"
                  value={locationFormData.description}
                  onChange={handleInputChangeLocation}
                  placeholder="Describe las características de esta ubicación..."
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={() => setShowLocationModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Crear Ubicación
                </Button>
              </ButtonGroup>
            </Form>
          </Modal>
        </ModalOverlay>
      )}

      <CropsGrid>
        {crops.map((crop) => (
          <CropCard key={crop.id}>
            <EditButton onClick={() => handleEdit(crop)}>Editar</EditButton>
            <CropName>{crop.name}</CropName>
            <CropInfo>
              <InfoRow>
                <span>Variedad:</span>
                <span>{crop.crop_varieties?.name || 'N/A'}</span>
              </InfoRow>
              <InfoRow>
                <span>Ubicación:</span>
                <span>{crop.locations?.name || 'N/A'}</span>
              </InfoRow>
              <InfoRow>
                <span>Fecha de Siembra:</span>
                <span>{new Date(crop.planting_date).toLocaleDateString()}</span>
              </InfoRow>
              <InfoRow>
                <span>Estado:</span>
                <StatusBadge status={crop.status}>
                  {crop.status}
                </StatusBadge>
              </InfoRow>
            </CropInfo>
            {crop.notes && (
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#6c757d',
                fontStyle: 'italic'
              }}>
                {crop.notes}
              </div>
            )}
          </CropCard>
        ))}
      </CropsGrid>

      {crops.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#6c757d'
        }}>
          <h3>No tienes cultivos registrados</h3>
          <p>Comienza agregando tu primer cultivo</p>
        </div>
      )}
    </CropsContainer>
  );
};

export default Crops;
