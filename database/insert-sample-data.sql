-- Script para insertar datos de muestra realistas para el sistema SEED
-- Este script genera datos históricos de sensores, alertas y sesiones de monitoreo
-- IMPORTANTE: Reemplaza 'TU_USER_ID_AQUI', 'TU_SENSOR_ID_AQUI', 'TU_CROP_ID_AQUI' con tus IDs reales

-- ============================================
-- PASO 1: Obtén tus IDs reales
-- ============================================
-- Ejecuta primero estos queries para obtener tus IDs:
-- SELECT id, name FROM users;
-- SELECT id, name FROM sensors;
-- SELECT id, name FROM crops;
-- SELECT id, name FROM locations;

-- ============================================
-- PASO 2: Datos de sensores (últimos 30 días)
-- ============================================
-- Este bloque genera 720 registros (24 registros por día durante 30 días)
-- Valores realistas para cultivo de café:
-- - Temperatura: 18°C - 28°C (óptimo para café arábica)
-- - Humedad ambiental: 60% - 85%
-- - Humedad del suelo: 40% - 70%
-- - pH: 5.5 - 6.5 (ligeramente ácido, ideal para café)
-- - Luz: 200 - 800 μmol/m²/s

-- IDs configurados para tu base de datos
DO $$
DECLARE
    sensor_id_var UUID := '2b84e75c-c71f-4f4b-835f-be7bf5ede38a'; -- Humedad Zona A
    i INTEGER;
    temp DECIMAL;
    hum DECIMAL;
    soil_moist DECIMAL;
    ph_val DECIMAL;
    light_val DECIMAL;
    record_time TIMESTAMP;
BEGIN
    -- Generar datos para los últimos 30 días (cada hora)
    FOR i IN 0..719 LOOP
        -- Calcular timestamp (retrocediendo desde ahora)
        record_time := NOW() - (i * INTERVAL '1 hour');
        
        -- Generar valores realistas con variación diurna
        -- Temperatura más alta durante el día (12pm-4pm), más baja en la noche (2am-6am)
        temp := 23 + 
                3 * SIN(2 * PI() * EXTRACT(HOUR FROM record_time) / 24) + 
                (RANDOM() * 2 - 1);
        
        -- Humedad inversa a temperatura (más alta en la noche)
        hum := 70 - 
               10 * SIN(2 * PI() * EXTRACT(HOUR FROM record_time) / 24) + 
               (RANDOM() * 5);
        
        -- Humedad del suelo disminuye gradualmente y se "riega" cada 2-3 días
        soil_moist := 55 + 
                      10 * SIN(2 * PI() * i / 48) + 
                      (RANDOM() * 5);
        
        -- pH relativamente estable con pequeñas variaciones
        ph_val := 6.0 + (RANDOM() * 0.4 - 0.2);
        
        -- Luz: 0 durante la noche, máximo al mediodía
        IF EXTRACT(HOUR FROM record_time) >= 6 AND EXTRACT(HOUR FROM record_time) <= 18 THEN
            light_val := 400 + 
                        300 * SIN(PI() * (EXTRACT(HOUR FROM record_time) - 6) / 12) + 
                        (RANDOM() * 100);
        ELSE
            light_val := RANDOM() * 20; -- Luz residual nocturna
        END IF;
        
        -- Insertar registro
        INSERT INTO sensor_data (
            sensor_id,
            temperature,
            humidity,
            soil_moisture,
            ph,
            light_intensity,
            timestamp
        ) VALUES (
            sensor_id_var,
            ROUND(temp::NUMERIC, 2),
            ROUND(hum::NUMERIC, 2),
            ROUND(soil_moist::NUMERIC, 2),
            ROUND(ph_val::NUMERIC, 2),
            ROUND(light_val::NUMERIC, 2),
            record_time
        );
    END LOOP;
    
    RAISE NOTICE 'Se insertaron 720 registros de datos de sensores (30 días)';
END $$;

-- ============================================
-- PASO 3: Alertas de muestra
-- ============================================
-- Generar algunas alertas realistas

-- IDs configurados para tu base de datos
DO $$
DECLARE
    user_id_var UUID := '7aae6553-bc2a-4ded-9487-a611f84c2f99';
    sensor_id_var UUID := '2b84e75c-c71f-4f4b-835f-be7bf5ede38a';
    crop_id_var UUID := 'f63f8da8-178b-4057-9659-b6ab1e7f44ca';
BEGIN
    -- Alerta de temperatura alta (hace 2 días, RESUELTA)
    INSERT INTO alerts (
        user_id,
        sensor_id,
        crop_id,
        alert_type,
        severity,
        message,
        resolved_at,
        created_at
    ) VALUES (
        user_id_var,
        sensor_id_var,
        crop_id_var,
        'temperature',
        'medium',
        'Temperatura elevada detectada: 29.5°C. Considera mejorar la ventilación.',
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '2 days'
    );
    
    -- Alerta de humedad baja del suelo (hace 1 día, SIN RESOLVER)
    INSERT INTO alerts (
        user_id,
        sensor_id,
        crop_id,
        alert_type,
        severity,
        message,
        created_at
    ) VALUES (
        user_id_var,
        sensor_id_var,
        crop_id_var,
        'soil_moisture',
        'critical',
        'Humedad del suelo crítica: 35%. Se requiere riego inmediato.',
        NOW() - INTERVAL '1 day'
    );
    
    -- Alerta de pH fuera de rango (hace 5 horas, SIN RESOLVER)
    INSERT INTO alerts (
        user_id,
        sensor_id,
        crop_id,
        alert_type,
        severity,
        message,
        created_at
    ) VALUES (
        user_id_var,
        sensor_id_var,
        crop_id_var,
        'ph',
        'medium',
        'pH del suelo fuera del rango óptimo: 7.2. Considera ajustar para café (6.0-6.5).',
        NOW() - INTERVAL '5 hours'
    );
    
    -- Alerta de temperatura baja (hace 12 horas, SIN RESOLVER)
    INSERT INTO alerts (
        user_id,
        sensor_id,
        crop_id,
        alert_type,
        severity,
        message,
        created_at
    ) VALUES (
        user_id_var,
        sensor_id_var,
        crop_id_var,
        'temperature',
        'medium',
        'Temperatura baja detectada: 16.8°C. Monitorea las condiciones nocturnas.',
        NOW() - INTERVAL '12 hours'
    );
    
    RAISE NOTICE 'Se insertaron 4 alertas de muestra';
END $$;

-- ============================================
-- PASO 4: Sesiones de monitoreo
-- ============================================
-- Crear algunas sesiones de monitoreo

DO $$
DECLARE
    user_id_var UUID := '7aae6553-bc2a-4ded-9487-a611f84c2f99';
    crop_id_var UUID := 'f63f8da8-178b-4057-9659-b6ab1e7f44ca';
BEGIN
    -- Sesión de monitoreo hace 5 días
    INSERT INTO monitoring_sessions (
        user_id,
        crop_id,
        session_date,
        observations,
        recommendations
    ) VALUES (
        user_id_var,
        crop_id_var,
        (NOW() - INTERVAL '5 days')::DATE,
        'Cultivo en buen estado general. Hojas verdes y saludables. Se observa crecimiento uniforme en todas las plantas. Temperatura promedio: 23°C, Humedad: 70%.',
        'Mantener el riego actual. Revisar pH del suelo en 3 días. Considerar aplicación de fertilizante orgánico la próxima semana.'
    );
    
    -- Sesión de monitoreo hace 12 días
    INSERT INTO monitoring_sessions (
        user_id,
        crop_id,
        session_date,
        observations,
        recommendations
    ) VALUES (
        user_id_var,
        crop_id_var,
        (NOW() - INTERVAL '12 days')::DATE,
        'Inicio de floración observado en el 60% de las plantas. Condiciones ambientales óptimas. Sin signos de plagas o enfermedades.',
        'Aumentar frecuencia de monitoreo a días alternos durante la floración. Asegurar buena ventilación para prevenir hongos.'
    );
    
    -- Sesión de monitoreo hace 20 días
    INSERT INTO monitoring_sessions (
        user_id,
        crop_id,
        session_date,
        observations,
        recommendations
    ) VALUES (
        user_id_var,
        crop_id_var,
        (NOW() - INTERVAL '20 days')::DATE,
        'Plantas en etapa vegetativa con buen desarrollo de follaje. Altura promedio: 45cm. Color verde intenso en hojas.',
        'Continuar con el programa de riego establecido. Monitorear aparición de yemas florales. Preparar sistema de tutorado.'
    );
    
    RAISE NOTICE 'Se insertaron 3 sesiones de monitoreo';
END $$;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecuta estos queries para verificar los datos insertados:

-- Ver últimos 10 registros de sensores
-- SELECT temperature, humidity, soil_moisture, ph, light_intensity, timestamp 
-- FROM sensor_data 
-- ORDER BY timestamp DESC 
-- LIMIT 10;

-- Ver alertas activas
-- SELECT alert_type, severity, message, created_at 
-- FROM alerts 
-- WHERE is_resolved = false 
-- ORDER BY created_at DESC;

-- Ver sesiones de monitoreo
-- SELECT session_name, status, start_date, end_date 
-- FROM monitoring_sessions 
-- ORDER BY start_date DESC;

-- Contar registros insertados
-- SELECT 
--     (SELECT COUNT(*) FROM sensor_data) as total_sensor_data,
--     (SELECT COUNT(*) FROM alerts) as total_alerts,
--     (SELECT COUNT(*) FROM monitoring_sessions) as total_sessions;
