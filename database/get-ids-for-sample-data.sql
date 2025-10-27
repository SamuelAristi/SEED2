-- Script para obtener los IDs necesarios para insertar datos de muestra
-- Ejecuta este script PRIMERO para obtener los IDs que necesitas

-- ============================================
-- PASO 1: Obtener tu User ID
-- ============================================
SELECT 
    id as user_id,
    name,
    email,
    '-- Copia este ID y reemplaza TU_USER_ID_AQUI en insert-sample-data.sql' as instruccion
FROM users
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- PASO 2: Obtener IDs de Sensores
-- ============================================
SELECT 
    id as sensor_id,
    name,
    sensor_type,
    '-- Copia este ID y reemplaza TU_SENSOR_ID_AQUI en insert-sample-data.sql' as instruccion
FROM sensors
ORDER BY created_at DESC;

-- ============================================
-- PASO 3: Obtener IDs de Cultivos
-- ============================================
SELECT 
    id as crop_id,
    name,
    status,
    '-- Copia este ID y reemplaza TU_CROP_ID_AQUI en insert-sample-data.sql' as instruccion
FROM crops
ORDER BY created_at DESC;

-- ============================================
-- PASO 4: Obtener IDs de Ubicaciones
-- ============================================
SELECT 
    id as location_id,
    name,
    location_type,
    '-- Para referencia' as instruccion
FROM locations
ORDER BY created_at DESC;

-- ============================================
-- RESUMEN
-- ============================================
-- Una vez que tengas los IDs, abre insert-sample-data.sql y:
-- 1. Busca "TU_USER_ID_AQUI" y reemplázalo con tu user_id
-- 2. Busca "TU_SENSOR_ID_AQUI" y reemplázalo con tu sensor_id
-- 3. Busca "TU_CROP_ID_AQUI" y reemplázalo con tu crop_id
-- 4. Ejecuta el script insert-sample-data.sql
