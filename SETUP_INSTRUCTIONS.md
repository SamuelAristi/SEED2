# 🌱 SEED - Instrucciones de Configuración

## ✅ Estado del Proyecto

El proyecto ha sido reorganizado y todas las dependencias han sido instaladas exitosamente.

### Estructura Final del Proyecto

```
seed-automatizando-campo/
├── backend/                 # Servidor Express.js
│   ├── config/             # Configuración de base de datos
│   ├── routes/             # Rutas de la API
│   ├── package.json        # Dependencias del backend ✅
│   └── index.js           # Punto de entrada del servidor
├── frontend/               # Aplicación React
│   ├── src/               # Código fuente React
│   ├── public/           # Archivos estáticos
│   └── package.json      # Dependencias del frontend ✅
├── database/              # Scripts de base de datos
│   └── schema.sql        # Esquema de PostgreSQL
├── scripts/              # Scripts de automatización
└── package.json          # Configuración principal ✅
```

## 🚀 Pasos para Iniciar el Proyecto

### 1. Configurar Variables de Entorno

Crear el archivo `backend/.env` con el siguiente contenido:

```env
# Supabase Configuration
SUPABASE_URL=https://raehwuosfeaofhvlvybq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZWh3dW9zZmVhb2Zodmx2eWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDk3MDMsImV4cCI6MjA3NTE4NTcwM30.XmlhpppCuUA9yzRSRu1afo3l5gogsCkxhIag1sRRdOk

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=seed-super-secret-jwt-key-for-development-only

# CORS Origins
CORS_ORIGINS=http://localhost:3000
```

### 2. Configurar la Base de Datos

1. Ir a tu proyecto de Supabase: https://raehwuosfeaofhvlvybq.supabase.co
2. Navegar al **SQL Editor**
3. Copiar y pegar el contenido completo del archivo `database/schema.sql`
4. Ejecutar el script SQL
5. Verificar que las tablas se crearon correctamente

### 3. Iniciar los Servidores

#### Opción A: Iniciar ambos servidores (Recomendado)
```bash
npm run dev
```

#### Opción B: Iniciar servidores por separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 4. Verificar que Todo Funciona

- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:3000
- **Health Check**: http://localhost:5000/api/health

## 📊 Dependencias Instaladas

### Backend (Express.js)
- ✅ Express.js - Framework web
- ✅ Supabase - Cliente de base de datos
- ✅ JWT - Autenticación
- ✅ Bcrypt - Encriptación
- ✅ CORS - Configuración de CORS
- ✅ Helmet - Seguridad
- ✅ Morgan - Logging
- ✅ Compression - Compresión de respuestas

### Frontend (React)
- ✅ React 18 - Framework de UI
- ✅ React Router - Navegación
- ✅ Styled Components - CSS-in-JS
- ✅ Axios - Cliente HTTP
- ✅ React Query - Gestión de estado
- ✅ React Hot Toast - Notificaciones
- ✅ React Icons - Iconos
- ✅ Recharts - Gráficos

## 🎨 Características Implementadas

### ✅ Sistema de Autenticación
- Registro e inicio de sesión
- Tokens JWT seguros
- Roles de usuario (agricultor, técnico, administrador)

### ✅ Dashboard Inteligente
- Métricas en tiempo real
- Estadísticas de cultivos y sensores
- Alertas automáticas
- Gráficos de tendencias

### ✅ Gestión de Cultivos
- CRUD completo de cultivos
- Seguimiento del ciclo de vida
- Estados: activo, cosechado, fallido, pausado

### ✅ Sistema de Sensores
- Configuración de sensores IoT
- Tipos: temperatura, humedad, pH, luz, humedad del suelo
- Datos históricos y análisis

### ✅ Reportes y Análisis
- Reportes de rendimiento
- Análisis de datos de sensores
- Filtros por período y cultivo

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia ambos servidores
npm run backend          # Solo backend
npm run frontend         # Solo frontend

# Producción
npm run build           # Construir frontend
npm start              # Iniciar servidor de producción

# Utilidades
npm run setup          # Setup completo
npm test              # Ejecutar tests
npm run lint          # Linter
```

## 🎯 Próximos Pasos

1. **Configurar la base de datos** ejecutando el script SQL
2. **Crear el archivo .env** en el backend
3. **Iniciar el desarrollo** con `npm run dev`
4. **Registrar un usuario** en la aplicación
5. **Probar las funcionalidades** del dashboard

## 🆘 Solución de Problemas

### Error de Conexión a la Base de Datos
- Verificar que el script SQL se ejecutó correctamente
- Revisar las credenciales de Supabase en el archivo .env

### Error de CORS
- Verificar que el frontend está corriendo en el puerto 3000
- Revisar la configuración de CORS en el backend

### Error de Dependencias
- Ejecutar `npm run install-all` para reinstalar todas las dependencias

---

**🌱 ¡El proyecto está listo para el desarrollo!**
