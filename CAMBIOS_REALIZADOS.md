# 📋 Cambios Realizados en el Proyecto SEED

## ✅ Problemas Resueltos

### 1. ✅ Conflicto de Puertos
**Problema:** El backend estaba configurado para el puerto 5000, pero el frontend esperaba el puerto 5001.

**Solución:**
- Actualizado `backend/index.js` para usar puerto **5001** por defecto
- Creado archivo `backend/.env` con `PORT=5001`

### 2. ✅ Archivo .env Faltante
**Problema:** No existía archivo de configuración `.env` en el backend.

**Solución:**
- Creado `backend/.env` con toda la configuración necesaria:
  - Credenciales de Supabase
  - Puerto del servidor: 5001
  - JWT Secret
  - Configuración de CORS

### 3. ⚠️ Row Level Security (RLS) de Supabase
**Problema:** Las políticas de RLS están bloqueando los inserts porque usan `auth.uid()` de Supabase, pero tu backend usa JWT personalizado.

**Solución preparada:**
- Creado script SQL en `database/disable-rls.sql`
- Creadas instrucciones detalladas en `SUPABASE_SETUP.md`

**🚨 ACCIÓN REQUERIDA:** Debes ejecutar el script SQL en la consola de Supabase para desactivar RLS. Ver `SUPABASE_SETUP.md` para instrucciones paso a paso.

### 4. ✅ Carpetas Duplicadas
**Problema:** Existían carpetas duplicadas (`server/` y `client/`) que generaban confusión.

**Solución:**
- Eliminadas carpetas `server/` y `client/`
- Las carpetas activas son:
  - `backend/` - Servidor Express + API
  - `frontend/` - Aplicación React

## 🚀 Estado Actual del Proyecto

### Backend ✅
- **Puerto:** 5001
- **Estado:** Funcionando correctamente
- **URL:** http://localhost:5001
- **Health Check:** http://localhost:5001/api/health
- **API Base:** http://localhost:5001/api

### Frontend (esperando verificación)
- **Puerto:** 3000
- **Proxy configurado:** http://localhost:5001
- **Archivo:** `frontend/package.json`

## 📝 Próximos Pasos para Probar el Registro

### Paso 1: Ejecutar el Script SQL
1. Abre el archivo `SUPABASE_SETUP.md`
2. Sigue las instrucciones para ejecutar el script SQL en Supabase
3. Esto desactivará RLS y permitirá que tu backend inserte usuarios

### Paso 2: Iniciar el Frontend
```bash
cd frontend
npm install  # Si no lo has hecho
npm start
```

### Paso 3: Probar el Registro
1. Abre http://localhost:3000 en tu navegador
2. Ve a la página de registro
3. Completa el formulario:
   - Nombre completo
   - Correo electrónico
   - Tipo de usuario
   - Contraseña (mínimo 6 caracteres)
4. Haz clic en "Crear Cuenta"

### Paso 4: Verificar
Si todo funciona correctamente:
- ✅ Deberías ser redirigido al Dashboard
- ✅ El usuario se habrá guardado en Supabase
- ✅ Recibirás un token JWT

## 🔍 Cómo Verificar si el Backend está Funcionando

Abre PowerShell y ejecuta:
```powershell
curl http://localhost:5001/api/health
```

Deberías ver:
```json
{
  "status": "OK",
  "message": "SEED API is running",
  "timestamp": "...",
  "version": "1.0.0"
}
```

## 📁 Estructura del Proyecto Limpia

```
Seed/
├── backend/              # ✅ Servidor principal (activo)
│   ├── config/
│   ├── routes/
│   ├── .env            # ✅ Nuevo: Configuración
│   ├── index.js
│   └── package.json
├── frontend/             # ✅ Cliente principal (activo)
│   ├── src/
│   ├── public/
│   └── package.json
├── database/
│   ├── schema.sql
│   └── disable-rls.sql  # ✅ Nuevo: Script para Supabase
├── SUPABASE_SETUP.md    # ✅ Nuevo: Instrucciones de configuración
└── CAMBIOS_REALIZADOS.md # ✅ Este archivo

❌ server/ - Eliminada (duplicado)
❌ client/ - Eliminada (duplicado)
```

## 🛠️ Comandos Útiles

### Iniciar todo el proyecto
```bash
npm run dev
```

### Solo Backend
```bash
cd backend
npm run dev
```

### Solo Frontend
```bash
cd frontend
npm start
```

## ⚠️ Importante
El backend está corriendo en segundo plano. Si necesitas detenerlo:
1. Presiona `Ctrl + C` en la terminal donde se ejecutó
2. O busca el proceso Node.js y detenlo

## 🐛 Si el Registro Sigue Fallando

Verifica:
1. ✅ Backend corriendo en puerto 5001
2. ⚠️ **Script SQL ejecutado en Supabase** (esto es CRÍTICO)
3. ✅ Frontend conectando a http://localhost:5001
4. ✅ Consola del navegador para ver errores específicos
5. ✅ Consola del backend para ver logs del servidor
