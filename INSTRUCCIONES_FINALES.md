# 🚀 Instrucciones Finales - Proyecto SEED

## ✅ Estado Actual

### Servidores en Ejecución
- ✅ **Backend:** http://localhost:5001 (corriendo)
- ✅ **Frontend:** http://localhost:3000 (corriendo)

## ⚠️ ACCIÓN CRÍTICA REQUERIDA

### Para que el registro funcione, DEBES ejecutar el script SQL en Supabase:

#### 1. Ve a Supabase
   - URL: https://supabase.com
   - Inicia sesión
   - Selecciona tu proyecto

#### 2. Ejecuta el Script SQL
   - Ve a **SQL Editor** en el menú lateral
   - Crea una **New Query**
   - Copia y pega este script:

```sql
-- Desactivar RLS en todas las tablas
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE crops DISABLE ROW LEVEL SECURITY;
ALTER TABLE sensors DISABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_sessions DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can view own locations" ON locations;
DROP POLICY IF EXISTS "Users can view own crops" ON crops;
DROP POLICY IF EXISTS "Users can view own sensors" ON sensors;
DROP POLICY IF EXISTS "Users can view sensor data from own sensors" ON sensor_data;
DROP POLICY IF EXISTS "Users can view own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can view own monitoring sessions" ON monitoring_sessions;
```

   - Haz clic en **RUN** (o presiona Ctrl+Enter)

#### 3. Prueba el Registro
   - Abre tu navegador en: http://localhost:3000
   - Ve a la página de registro
   - Completa el formulario:
     - Nombre: Tu nombre
     - Email: tu@email.com
     - Tipo de usuario: Agricultor/Técnico/Admin
     - Contraseña: mínimo 6 caracteres
   - Haz clic en "Crear Cuenta"

## 🎯 Resultado Esperado

Si todo funciona:
- ✅ El usuario se crea en Supabase
- ✅ Recibes un token JWT
- ✅ Eres redirigido al Dashboard
- ✅ Puedes ver tu nombre y datos de usuario

## 🐛 Si Aparece el Error "Failed to create user"

Significa que **NO ejecutaste el script SQL** en Supabase. El RLS está bloqueando los inserts.

### Verifica:
1. ¿Ejecutaste el script SQL completo en Supabase?
2. ¿El script se ejecutó sin errores?
3. ¿Puedes ver que RLS está desactivado en Table Editor?

## 📊 Verificar que Todo Funciona

### Backend Health Check
Abre PowerShell y ejecuta:
```powershell
curl http://localhost:5001/api/health
```

Deberías ver: `"status":"OK"`

### Ver Logs del Backend
Si el registro falla, mira la consola donde corre el backend. Ahí verás el error específico.

### Ver Errores del Frontend
Abre la consola del navegador (F12) y ve a la pestaña "Console" para ver errores.

## 🔄 Reiniciar los Servidores

Si necesitas reiniciar todo:

### Detener servidores actuales
1. Encuentra las ventanas de PowerShell donde corren
2. Presiona `Ctrl + C` en cada una

### Reiniciar desde la raíz del proyecto
```powershell
npm run dev
```

O individualmente:

Backend:
```powershell
cd backend
npm run dev
```

Frontend:
```powershell
cd frontend
npm start
```

## 📝 Cambios Realizados

Ver el archivo `CAMBIOS_REALIZADOS.md` para detalles completos.

### Resumen:
1. ✅ Creado archivo `.env` con configuración correcta
2. ✅ Corregido puerto del backend a 5001
3. ✅ Eliminadas carpetas duplicadas (server y client)
4. ✅ Creado script SQL para desactivar RLS
5. ✅ Backend y Frontend iniciados correctamente

## 🎓 Próximos Pasos Después del Registro

Una vez que el registro funcione:
1. Agregar funcionalidad de sensores
2. Implementar dashboard con datos simulados
3. Crear vistas para cultivos
4. Agregar gráficas y reportes

## 💡 Notas Importantes

- **Puerto Backend:** 5001 (cambiado desde 5000)
- **Puerto Frontend:** 3000
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** JWT personalizado (no Supabase Auth)
- **RLS:** Desactivado (el backend controla los permisos)

---

## 🆘 Si Necesitas Ayuda

Proporciona:
1. Mensaje de error completo
2. Captura de pantalla si es posible
3. Logs de la consola del backend
4. ¿Ejecutaste el script SQL?
