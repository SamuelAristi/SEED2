# 🔧 Configuración de Supabase para SEED

## Problema identificado
El Row Level Security (RLS) de Supabase está bloqueando los inserts porque las políticas están configuradas para usar `auth.uid()` (autenticación de Supabase), pero tu backend usa JWT personalizado.

## Solución: Desactivar RLS

### Paso 1: Acceder a Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto SEED

### Paso 2: Abrir el SQL Editor
1. En el menú lateral, haz clic en **SQL Editor**
2. Haz clic en **New query** (Nueva consulta)

### Paso 3: Ejecutar el siguiente script SQL

```sql
-- Script para desactivar Row Level Security (RLS)
-- Esto permite que el backend con autenticación JWT pueda insertar usuarios

-- Desactivar RLS en todas las tablas
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE crops DISABLE ROW LEVEL SECURITY;
ALTER TABLE sensors DISABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_sessions DISABLE ROW LEVEL SECURITY;

-- Eliminar las políticas existentes
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can view own locations" ON locations;
DROP POLICY IF EXISTS "Users can view own crops" ON crops;
DROP POLICY IF EXISTS "Users can view own sensors" ON sensors;
DROP POLICY IF EXISTS "Users can view sensor data from own sensors" ON sensor_data;
DROP POLICY IF EXISTS "Users can view own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can view own monitoring sessions" ON monitoring_sessions;
```

### Paso 4: Ejecutar la consulta
1. Pega el script SQL completo en el editor
2. Haz clic en **Run** (Ejecutar) o presiona `Ctrl + Enter`
3. Deberías ver mensajes de éxito

### Paso 5: Verificar
1. Ve a **Table Editor** en el menú lateral
2. Selecciona la tabla `users`
3. Verifica que RLS esté desactivado (debería aparecer un indicador)

## ✅ Una vez completado
Después de ejecutar este script, tu backend podrá:
- Registrar nuevos usuarios
- Insertar y consultar datos sin restricciones de RLS
- Tu autenticación JWT seguirá funcionando correctamente

## 📝 Nota importante
Con RLS desactivado, tu backend tiene control total sobre la base de datos. Esto es apropiado porque tu backend maneja la autenticación con JWT y controla quién puede acceder a qué datos.
