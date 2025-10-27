-- Script para desactivar Row Level Security (RLS) temporalmente
-- Esto permite que el backend con autenticación JWT pueda insertar usuarios
-- IMPORTANTE: Ejecuta este script en tu consola SQL de Supabase

-- Desactivar RLS en todas las tablas
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE crops DISABLE ROW LEVEL SECURITY;
ALTER TABLE sensors DISABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_sessions DISABLE ROW LEVEL SECURITY;

-- Eliminar las políticas existentes que usan auth.uid() (autenticación de Supabase)
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can view own locations" ON locations;
DROP POLICY IF EXISTS "Users can view own crops" ON crops;
DROP POLICY IF EXISTS "Users can view own sensors" ON sensors;
DROP POLICY IF EXISTS "Users can view sensor data from own sensors" ON sensor_data;
DROP POLICY IF EXISTS "Users can view own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can view own monitoring sessions" ON monitoring_sessions;

-- Nota: Con RLS desactivado, tu backend tiene control total sobre la base de datos
-- Tu backend se encarga de la autenticación con JWT
