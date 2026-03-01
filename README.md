# 🎮 Frontend - Gestor de Torneos
**Interfaz web para gestión de torneos deportivos** | Trabajo Práctico DSW - UTN FRRO

> 📖 **¿Primera vez con el proyecto?** Esta guía está diseñada para que puedas configurar y ejecutar el frontend aunque no tengas experiencia previa. Sigue cada paso en orden y funcionará.

---

## 📋 Tabla de Contenidos

- [Pre-requisitos](#-pre-requisitos)
- [Instalación Completa](#-instalación-completa-paso-a-paso)
- [Uso Diario](#-uso-diario)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Troubleshooting](#-problemas-comunes-troubleshooting)
- [Glosario](#-glosario-para-principiantes)

---

## 🔧 Pre-requisitos

**Necesitas instalar estas herramientas ANTES de continuar:**

### 1. Node.js (versión 18 o superior)
- **¿Qué es?** Entorno para ejecutar JavaScript
- **Descargar:** https://nodejs.org/
- **Verificar instalación:**
  ```bash
  node --version
  # Debe mostrar algo como: v20.x.x
  ```

### 2. pnpm (gestor de paquetes)
- **¿Qué es?** Herramienta para instalar dependencias del proyecto
- **Instalar:**
  ```bash
  npm install -g pnpm
  ```
- **Verificar instalación:**
  ```bash
  pnpm --version
  # Debe mostrar algo como: 10.x.x
  ```

### 3. Git (para clonar el repositorio)
- **¿Qué es?** Sistema de control de versiones
- **Descargar:** https://git-scm.com/
- **Verificar instalación:**
  ```bash
  git --version
  # Debe mostrar algo como: git version 2.x.x
  ```

### 4. Editor de Código (recomendado)
- **Visual Studio Code:** https://code.visualstudio.com/
- O cualquier editor de texto que te guste

### 5. Backend funcionando
- **Importante:** El frontend necesita que el backend esté corriendo
- Ver: Backend README para configurarlo

---

## 📥 Instalación Completa (Paso a Paso)

### **PASO 1: Obtener el Código**

#### Opción A: Si tienes acceso al repositorio Git
```bash
# 1. Navegar a la carpeta donde quieres el proyecto
cd C:\Proyectos  # Cambia la ruta según prefieras

# 2. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# 3. Entrar a la carpeta del frontend
cd Frontend_Costamagna_Gil_Lovatti_Martinez
```

#### Opción B: Si tienes el código en un ZIP
```bash
# 1. Descomprime el archivo ZIP
# 2. Abre una terminal en la carpeta del frontend
cd ruta\a\Frontend_Costamagna_Gil_Lovatti_Martinez
```

---

### **PASO 2: Configurar Variables de Entorno**

#### 2.1 - Crear archivo .env
```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

#### 2.2 - Editar el archivo .env
Abre el archivo `.env` con tu editor favorito (Notepad, VSCode, etc.)

**Configuración necesaria:**

```env
# Google Maps API Key (IMPORTANTE para mapas de localidades)
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps
```

#### 2.3 - Obtener Google Maps API Key

**Si quieres que funcionen los mapas de localidades:**

1. Ve a https://console.cloud.google.com/
2. Crea un proyecto (o usa uno existente)
3. Habilita "Maps JavaScript API" y "Places API"
4. Crea una API Key en "Credentials"
5. Copia la key (comienza con "AIza...")
6. Pégala en tu archivo `.env`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...tu_key_aqui
   ```

**Si no configuras esto ahora:** El proyecto funcionará pero los mapas de búsqueda de localidades no funcionarán.

---

### **PASO 3: Instalar Dependencias**

```bash
pnpm install
```

**⏱️ Esto puede tomar 2-5 minutos la primera vez.**

**✅ Éxito:** Verás muchas líneas de texto y al final algo como "Done in XXs"

**❌ Error "pnpm: command not found":**
```bash
# Instalar pnpm primero
npm install -g pnpm
```

---

### **PASO 4: Verificar Configuración del Backend**

**El frontend necesita que el backend esté corriendo en http://localhost:3000**

Abre otra terminal y verifica:
```bash
curl http://localhost:3000/api/deportes
# O abre http://localhost:3000 en tu navegador
```

**❌ Si no responde:** Inicia el backend primero (ver Backend README)

---

### **PASO 5: ¡Iniciar el Frontend! 🚀**

```bash
pnpm run dev
```

**✅ Éxito - Debes ver:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**¡El frontend está funcionando!** 🎉

**Para verlo:** Abre tu navegador y ve a http://localhost:5173

---

## 🔄 Uso Diario

### Iniciar el frontend (cada vez que trabajes)

```bash
# 1. Asegúrate de que el BACKEND está corriendo
#    (debe estar en http://localhost:3000)

# 2. Navega a la carpeta del frontend
cd ruta\a\Frontend_Costamagna_Gil_Lovatti_Martinez

# 3. Inicia el servidor de desarrollo
pnpm run dev
```

### Detener el servidor

**En la terminal donde corre el servidor:**
- **Windows/Linux:** Presiona `Ctrl + C`
- **Mac:** Presiona `Cmd + C`

### Ver la aplicación en otros dispositivos (opcional)

```bash
# Iniciar con acceso desde la red local
pnpm run dev --host
```

Luego podrás acceder desde tu teléfono u otra computadora usando la IP mostrada (ej: http://192.168.1.10:5173)

---

## 📁 Estructura del Proyecto

```
Frontend_Costamagna_Gil_Lovatti_Martinez/
├── src/
│   ├── main.tsx                  # Punto de entrada
│   ├── App.tsx                   # Componente principal
│   ├── components/               # Componentes reutilizables
│   │   ├── ApiMaps/              # Componentes de mapas (Google Maps)
│   │   └── ...
│   ├── pages/                    # Páginas/Vistas
│   │   ├── Home/
│   │   ├── Torneos/
│   │   ├── Equipos/
│   │   └── ...
│   ├── contexts/                 # Context API de React
│   ├── hooks/                    # Custom hooks
│   ├── helpers/                  # Funciones auxiliares
│   ├── providers/                # Providers de contexto
│   └── types.tsx                 # Tipos TypeScript
├── public/                       # Archivos estáticos
├── dist/                         # Build de producción (generado)
├── node_modules/                 # Dependencias (generado)
├── .env                          # TU configuración (NO commitear)
├── .env.example                  # Plantilla de configuración
├── index.html                    # HTML principal
├── package.json                  # Dependencias del proyecto
├── vite.config.ts                # Configuración de Vite
├── tsconfig.json                 # Configuración TypeScript
└── README.md                     # Este archivo
```

---

## 🎨 Características de la Aplicación

### 🏠 Páginas Principales

- **Home/Landing**: Página de bienvenida
- **Torneos**: Ver, crear y gestionar torneos
- **Equipos**: Gestión de equipos deportivos
- **Partidos**: Programación y resultados
- **Usuarios**: Registro y perfil de usuarios
- **Admin**: Panel de administración

### 🔐 Autenticación

- Login/Registro de usuarios
- Roles: Usuario, Administrador
- Sesión persistente (remember me)

### 🗺️ Funcionalidades Especiales

- **Búsqueda de Localidades**: USA Google Maps API para autocompletar direcciones
- **Gestión de Equipos**: Crear equipos e invitar jugadores
- **Sistema de Invitaciones**: Por email
- **Estadísticas**: MVP, máximo anotador, etc.

---

## 🆘 Problemas Comunes (Troubleshooting)

### ❌ "Network error" / "Cannot fetch data"

**Problema:** El frontend no puede conectarse al backend.

**Soluciones:**
1. **Verifica que el backend está corriendo:**
   ```bash
   # En otra terminal
   curl http://localhost:3000/api/deportes
   ```
   
2. **Verifica el puerto del backend** en `src/helpers/` o archivos de configuración

3. **Revisa CORS**: El backend debe permitir peticiones desde `http://localhost:5173`

---

### ❌ "Port 5173 is already in use"

**Problema:** Otro programa está usando el puerto 5173.

**Solución 1:** Vite automáticamente intentará el siguiente puerto (5174, 5175, etc.)

**Solución 2:** Forzar un puerto específico:
```bash
pnpm run dev -- --port 5174
```

---

### ❌ Mapas no funcionan / "Google Maps API error"

**Problema:** Google Maps API no está configurada o la key es inválida.

**Soluciones:**
1. **Verifica que la key está en .env:**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
   ```

2. **Verifica que la key es válida:**
   - Ve a https://console.cloud.google.com/
   - Revisa que las APIs están habilitadas
   - Revisa que no has excedido la cuota gratuita

3. **Reinicia el servidor de desarrollo** después de cambiar .env:
   ```bash
   # Ctrl+C para detener
   pnpm run dev
   ```

**⚠️ Importante:** Las variables `VITE_*` solo se cargan al iniciar el servidor. Debes reiniciar si las cambias.

---

### ❌ "pnpm: command not found"

**Problema:** pnpm no está instalado.

**Solución:**
```bash
npm install -g pnpm
```

---

### ❌ Cambios en el código no se reflejan

**Problema:** Hot Module Replacement no funciona.

**Soluciones:**
1. **Refresca el navegador** (F5 o Ctrl+R)

2. **Reinicia el servidor:**
   ```bash
   # Ctrl+C para detener
   pnpm run dev
   ```

3. **Borra caché:**
   ```bash
   # Windows
   Remove-Item -Recurse -Force node_modules, dist, .vite
   
   # Linux/Mac
   rm -rf node_modules dist .vite
   
   # Reinstala
   pnpm install
   ```

---

### ❌ Errores de compilación TypeScript

**Problema:** Errores al iniciar o compilar.

**Solución:**
1. Borra node_modules y reinstala:
   ```bash
   # Windows
   Remove-Item -Recurse -Force node_modules
   
   # Linux/Mac
   rm -rf node_modules
   
   # Reinstala
   pnpm install
   ```

2. Verifica que Node.js es versión 18 o superior:
   ```bash
   node --version
   ```

---

### ❌ Estilos no se aplican / página se ve mal

**Problema:** CSS/Bootstrap no carga correctamente.

**Soluciones:**
1. **Hard refresh del navegador:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Borra caché del navegador:**
   - Chrome: F12 → Network → Disable cache (mientras devtools está abierto)

3. **Verifica que los archivos CSS existen:**
   - `bootstrap.css`
   - `temas.css` o archivos similares

---

## 📊 Scripts Disponibles

```bash
# Desarrollo (con hot reload)
pnpm run dev

# Compilar para producción
pnpm run build

# Preview del build de producción
pnpm run preview

# Linter (revisar código)
pnpm run lint

# Verificar configuración de variables de entorno
pnpm run check:config

# Auditar seguridad (API keys expuestas)
pnpm run check:security

# Ejecutar todas las verificaciones
pnpm run check:all
```

### 🔍 Scripts de Verificación

**check:config** - Valida que las variables de entorno estén correctamente configuradas:
- ✅ Verifica que `.env` existe
- ✅ Valida formato de Google Maps API Key
- ✅ Comprueba que las variables tienen prefijo `VITE_`
- ✅ Revisa que `.env` está en `.gitignore`

**check:security** - Audita la seguridad del proyecto:
- 🔒 Detecta API keys hardcodeadas en el código
- 🔒 Verifica que `.env` no está trackeado en Git
- 🔒 Compara `.env` con `.env.example` (deben ser diferentes)
- 🔒 Busca credenciales en el historial de Git

**Recomendación:** Ejecuta `pnpm run check:all` antes de hacer commit.

---

## 🚀 Compilar para Producción

### Crear build de producción:

```bash
pnpm run build
```

**Esto genera:**
- Carpeta `dist/` con archivos optimizados
- HTML, CSS y JS minificados
- Assets optimizados

### Probar el build localmente:

```bash
pnpm run preview
```

**Abre:** http://localhost:4173

### Desplegar (Deploy):

El contenido de la carpeta `dist/` se puede desplegar en:
- **Vercel**: https://vercel.com (recomendado para Vite/React)
- **Netlify**: https://netlify.com
- **GitHub Pages**: Para proyectos públicos
- **Cualquier hosting estático**

**Importante:** Configura las variables de entorno en el servicio de hosting.

---

## 📖 Glosario para Principiantes

**Frontend:** La parte visual de la aplicación que ves en el navegador.

**React:** Librería de JavaScript para construir interfaces de usuario.

**Vite:** Herramienta de desarrollo muy rápida para proyectos web modernos.

**TypeScript:** JavaScript con tipos (ayuda a prevenir errores).

**Component:** Pieza reutilizable de interfaz (botón, formulario, etc.)

**Props:** Datos que se pasan a un componente.

**State:** Datos que cambian y hacen que la interfaz se actualice.

**Hook:** Función especial de React (useState, useEffect, etc.)

**API:** Forma en que frontend y backend se comunican.

**Hot Reload:** Los cambios en el código se reflejan sin recargar la página.

**Build:** Proceso de preparar el código para producción (optimizado).

**localhost:** Tu computadora (127.0.0.1).

**Puerto:** Número que identifica un servicio (ej: 5173).

**CORS:** Sistema de seguridad del navegador para peticiones entre dominios.

---

## 🔗 Conexión con el Backend

### URL del Backend

Por defecto, el frontend espera que el backend esté en:
```
http://localhost:3000
```

Si tu backend usa otro puerto, actualiza las peticiones en:
- `src/helpers/` (archivos de API)
- O crea una variable de entorno `VITE_API_URL`

### Ejemplo de configuración con variable:

**En .env:**
```env
VITE_API_URL=http://localhost:3000
```

**En el código:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

---

## 🤝 ¿Necesitas Ayuda?

### Antes de pedir ayuda:

1. ✅ Lee el mensaje de error completo en la terminal
2. ✅ Abre la consola del navegador (F12) y revisa errores
3. ✅ Busca el error en la sección [Troubleshooting](#-problemas-comunes-troubleshooting)
4. ✅ Verifica que seguiste todos los pasos en orden
5. ✅ Confirma que el backend está corriendo

### Al pedir ayuda, incluye:

- ❓ Qué estabas intentando hacer
- ❌ El mensaje de error completo (captura de pantalla)
- 💻 Tu sistema operativo (Windows/Mac/Linux)
- 🌐 Errores de la consola del navegador (F12 → Console)
- 📦 Versión de Node.js (`node --version`)

---

## ✅ Checklist de Instalación Exitosa

Marca cada paso a medida que lo completes:

- [ ] Node.js instalado (`node --version`)
- [ ] pnpm instalado (`pnpm --version`)
- [ ] Backend corriendo en http://localhost:3000
- [ ] Archivo `.env` creado
- [ ] Google Maps API key configurada (opcional)
- [ ] Dependencias instaladas (`pnpm install`)
- [ ] Servidor de desarrollo iniciado (`pnpm run dev`)
- [ ] Frontend accesible en http://localhost:5173
- [ ] Puedes ver la página de inicio
- [ ] Puedes navegar entre páginas

**¡Si todos los pasos están marcados, tu frontend está listo! 🎉**

---

## 🎨 Tecnologías Utilizadas

- **React 19** - Librería de UI
- **TypeScript** - Superset de JavaScript con tipos
- **Vite** - Build tool y servidor de desarrollo
- **React Router** - Navegación entre páginas
- **Bootstrap 5** - Framework CSS
- **React Bootstrap** - Componentes Bootstrap para React
- **Axios** - Cliente HTTP para peticiones API
- **Google Maps API** - Búsqueda de localidades
- **React Hook Form** - Manejo de formularios
- **JWT Decode** - Decodificación de tokens de autenticación

---

## 📝 Notas Importantes

### Variables de Entorno

- **DEBEN empezar con `VITE_`** para ser accesibles en el frontend
- Se leen **solo al iniciar el servidor** (reinicia si las cambias)
- **Nunca pongas secretos sensibles** (todo es visible en el navegador)

### Seguridad

- **NUNCA** commitees el archivo `.env` al repositorio
- Las API keys del frontend **son públicas** (el navegador las ve)
- Para APIs sensibles, usa el backend como proxy

### Desarrollo

- Los cambios se reflejan automáticamente (hot reload)
- Abre las DevTools del navegador (F12) para debuggear
- La consola muestra errores y logs útiles

---

## 🏆 ¡Listo para Desarrollar!

Si llegaste hasta aquí, tienes todo configurado para trabajar en el proyecto.

### Próximos Pasos:

1. 🎨 Explora las páginas y componentes
2. 📝 Lee el código para entender cómo funciona
3. 🛠️ Haz cambios y observa los resultados en tiempo real
4. 📚 Consulta la documentación de React/TypeScript cuando tengas dudas

### Recursos Útiles:

- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/
- **Vite:** https://vitejs.dev/
- **Bootstrap:** https://getbootstrap.com/
- **React Router:** https://reactrouter.com/

---

**Hecho con ❤️ por Costamagna, Gil, Lovatti, Martinez**
