-- SEED Database Schema
-- Sistema de monitoreo inteligente de cultivos de almacigo

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'farmer' CHECK (role IN ('farmer', 'admin', 'technician')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table (greenhouses, fields, etc.)
CREATE TABLE locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location_type VARCHAR(100) NOT NULL CHECK (location_type IN ('greenhouse', 'field', 'nursery', 'laboratory')),
    description TEXT,
    address TEXT,
    coordinates POINT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crop varieties table
CREATE TABLE crop_varieties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    variety_type VARCHAR(100) NOT NULL,
    description TEXT,
    optimal_temperature_min DECIMAL(5,2),
    optimal_temperature_max DECIMAL(5,2),
    optimal_humidity_min DECIMAL(5,2),
    optimal_humidity_max DECIMAL(5,2),
    optimal_ph_min DECIMAL(3,2),
    optimal_ph_max DECIMAL(3,2),
    growth_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crops table
CREATE TABLE crops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    variety_id UUID REFERENCES crop_varieties(id),
    location_id UUID REFERENCES locations(id),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    planting_date DATE NOT NULL,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'harvested', 'failed', 'paused')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sensors table
CREATE TABLE sensors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sensor_type VARCHAR(100) NOT NULL CHECK (sensor_type IN ('temperature', 'humidity', 'ph', 'light', 'soil_moisture', 'multi')),
    location_id UUID REFERENCES locations(id),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    calibration_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sensor data table
CREATE TABLE sensor_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sensor_id UUID REFERENCES sensors(id) ON DELETE CASCADE,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    ph DECIMAL(3,2),
    light_intensity DECIMAL(8,2),
    soil_moisture DECIMAL(5,2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sensor_id UUID REFERENCES sensors(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crop monitoring sessions
CREATE TABLE monitoring_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crop_id UUID REFERENCES crops(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    observations TEXT,
    photos JSONB,
    recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_crops_user_id ON crops(user_id);
CREATE INDEX idx_crops_status ON crops(status);
CREATE INDEX idx_sensors_user_id ON sensors(user_id);
CREATE INDEX idx_sensors_location_id ON sensors(location_id);
CREATE INDEX idx_sensor_data_sensor_id ON sensor_data(sensor_id);
CREATE INDEX idx_sensor_data_timestamp ON sensor_data(timestamp);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_is_read ON alerts(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crops_updated_at BEFORE UPDATE ON crops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sensors_updated_at BEFORE UPDATE ON sensors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample crop varieties
INSERT INTO crop_varieties (name, variety_type, description, optimal_temperature_min, optimal_temperature_max, optimal_humidity_min, optimal_humidity_max, optimal_ph_min, optimal_ph_max, growth_days) VALUES
('Tomate Cherry', 'Solanaceae', 'Variedad de tomate cherry ideal para invernadero', 18.0, 28.0, 50.0, 70.0, 6.0, 6.8, 75),
('Lechuga Romana', 'Asteraceae', 'Lechuga romana para cultivo hidropónico', 15.0, 25.0, 60.0, 80.0, 6.0, 7.0, 45),
('Pimiento Rojo', 'Solanaceae', 'Pimiento rojo para invernadero', 20.0, 30.0, 50.0, 70.0, 6.0, 6.5, 90),
('Albahaca', 'Lamiaceae', 'Hierba aromática para cultivo en maceta', 18.0, 26.0, 40.0, 60.0, 6.0, 7.0, 30);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view own locations" ON locations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own crops" ON crops FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own sensors" ON sensors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view sensor data from own sensors" ON sensor_data FOR ALL USING (
    EXISTS (SELECT 1 FROM sensors WHERE sensors.id = sensor_data.sensor_id AND sensors.user_id = auth.uid())
);
CREATE POLICY "Users can view own alerts" ON alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own monitoring sessions" ON monitoring_sessions FOR ALL USING (auth.uid() = user_id);
