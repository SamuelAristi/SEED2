-- Script para verificar que los datos de muestra se insertaron correctamente

-- 1. Verificar cuántos registros de sensor_data se insertaron
SELECT COUNT(*) as total_sensor_data FROM sensor_data;

-- 2. Verificar el rango de fechas de los datos
SELECT 
    MIN(timestamp) as fecha_mas_antigua,
    MAX(timestamp) as fecha_mas_reciente,
    COUNT(*) as total_registros
FROM sensor_data;

-- 3. Verificar promedios de los últimos 7 días
SELECT 
    ROUND(AVG(temperature)::NUMERIC, 2) as temp_promedio,
    ROUND(AVG(humidity)::NUMERIC, 2) as humedad_promedio,
    ROUND(AVG(soil_moisture)::NUMERIC, 2) as humedad_suelo_promedio,
    ROUND(AVG(ph)::NUMERIC, 2) as ph_promedio,
    ROUND(AVG(light_intensity)::NUMERIC, 2) as luz_promedio,
    COUNT(*) as registros_ultimos_7_dias
FROM sensor_data
WHERE timestamp >= NOW() - INTERVAL '7 days';

-- 4. Verificar alertas insertadas
SELECT 
    severity,
    alert_type,
    COUNT(*) as cantidad
FROM alerts
GROUP BY severity, alert_type;

-- 5. Verificar sesiones de monitoreo
SELECT COUNT(*) as total_sesiones FROM monitoring_sessions;

-- 6. Verificar que el sensor_id usado pertenece al usuario
SELECT 
    s.id,
    s.name,
    s.sensor_type,
    s.user_id,
    u.email
FROM sensors s
JOIN users u ON s.user_id = u.id
WHERE s.id = '2b84e75c-c71f-4f4b-835f-be7bf5ede38a';

-- 7. Verificar los últimos 10 registros de sensor_data
SELECT 
    sd.timestamp,
    sd.temperature,
    sd.humidity,
    sd.soil_moisture,
    sd.ph,
    s.name as sensor_name,
    s.user_id
FROM sensor_data sd
JOIN sensors s ON sd.sensor_id = s.id
ORDER BY sd.timestamp DESC
LIMIT 10;
