# 📊 Guía Rápida: Llenar Base de Datos con Datos de Muestra

## 🎯 Objetivo
Este script llenará tu base de datos con **720 registros de sensores** (30 días de datos históricos), **4 alertas** y **2 sesiones de monitoreo** para que tu dashboard se vea realista y profesional.

## 📋 Pasos a Seguir

### 1️⃣ Obtener tus IDs
Ve a **Supabase SQL Editor** y ejecuta:
```sql
-- Ejecuta este archivo completo: get-ids-for-sample-data.sql
```

Verás algo como:
```
user_id: 123e4567-e89b-12d3-a456-426614174000
sensor_id: 987fcdeb-51a2-43e1-b789-123456789abc
crop_id: 456e7890-a12b-34c5-d678-901234567def
```

### 2️⃣ Editar el Script Principal
Abre `insert-sample-data.sql` y busca estas líneas (aparecen 3 veces en el archivo):

```sql
sensor_id_var UUID := 'TU_SENSOR_ID_AQUI'; -- CAMBIA ESTO
user_id_var UUID := 'TU_USER_ID_AQUI'; -- CAMBIA ESTO
crop_id_var UUID := 'TU_CROP_ID_AQUI'; -- CAMBIA ESTO
```

Reemplaza con tus IDs reales:
```sql
sensor_id_var UUID := '987fcdeb-51a2-43e1-b789-123456789abc';
user_id_var UUID := '123e4567-e89b-12d3-a456-426614174000';
crop_id_var UUID := '456e7890-a12b-34c5-d678-901234567def';
```

### 3️⃣ Ejecutar el Script
En **Supabase SQL Editor**:
1. Copia TODO el contenido de `insert-sample-data.sql`
2. Pega en el editor
3. Haz clic en **Run** (Ctrl + Enter)
4. Espera unos segundos...

### 4️⃣ Verificar
Ejecuta estos queries para verificar:
```sql
-- Ver cuántos registros se crearon
SELECT COUNT(*) FROM sensor_data; -- Debería ser ~720

-- Ver últimos datos
SELECT temperature, humidity, timestamp 
FROM sensor_data 
ORDER BY timestamp DESC 
LIMIT 10;

-- Ver alertas activas
SELECT alert_type, message, created_at 
FROM alerts 
WHERE is_resolved = false;
```

### 5️⃣ Recargar Dashboard
Ve a tu aplicación y recarga la página del Dashboard. ¡Ahora deberías ver gráficos llenos de datos!

## 📊 Datos Generados

### Datos de Sensores (720 registros)
- **Temperatura**: 18°C - 28°C (varía según hora del día)
- **Humedad**: 60% - 85% (inversa a temperatura)
- **Humedad del Suelo**: 40% - 70% (disminuye gradualmente)
- **pH**: 5.8 - 6.4 (óptimo para café)
- **Luz**: 0-800 μmol/m²/s (0 en la noche, máximo al mediodía)

### Alertas (4)
1. ⚠️ Temperatura elevada (resuelta)
2. 🔴 Humedad del suelo crítica (activa)
3. ⚠️ pH fuera de rango (activa)
4. ⚠️ Temperatura baja (activa)

### Sesiones de Monitoreo (2)
1. Sesión activa actual (últimos 30 días)
2. Sesión completada anterior

## ⚡ Solución de Problemas

**Error: "violates foreign key constraint"**
- Asegúrate de que los IDs que copiaste existen en tu base de datos
- Verifica que copiaste los IDs completos (formato UUID)

**Error: "column does not exist"**
- Tu esquema de base de datos puede ser diferente
- Verifica que las tablas `sensor_data`, `alerts`, `monitoring_sessions` existen

**No veo datos en el dashboard**
- Recarga la página (F5)
- Verifica que los datos se insertaron: `SELECT COUNT(*) FROM sensor_data;`
- Asegúrate de que usaste el `user_id` correcto

## 🗑️ Limpiar Datos de Muestra

Si quieres eliminar los datos de muestra:
```sql
-- CUIDADO: Esto eliminará TODOS tus datos de sensores
DELETE FROM sensor_data WHERE sensor_id = 'TU_SENSOR_ID_AQUI';
DELETE FROM alerts WHERE sensor_id = 'TU_SENSOR_ID_AQUI';
DELETE FROM monitoring_sessions WHERE crop_id = 'TU_CROP_ID_AQUI';
```
