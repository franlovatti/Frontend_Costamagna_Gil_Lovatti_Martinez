# 🔍 Scripts de Verificación del Frontend

Este directorio incluye scripts para validar la configuración y seguridad del proyecto.

## 📋 Scripts Disponibles

### 1. check-config.js
**Valida la configuración de variables de entorno**

```bash
node check-config.js
# o
pnpm run check:config
```

**Qué verifica:**
- ✅ Existencia de archivos `.env` y `.env.example`
- ✅ Variables de entorno requeridas y opcionales
- ✅ Formato válido de Google Maps API Key
- ✅ Prefijo correcto `VITE_` en todas las variables
- ✅ Archivo `.env` está en `.gitignore`

**Salida exitosa:**
```
✅ ¡Configuración perfecta! Todo está correcto.
```

**Ejemplo de salida con problemas:**
```
❌ Problemas Críticos:
   ❌ CRÍTICO: Archivo .env no existe
   
📝 Pasos para solucionar:
   1. Copia .env.example a .env: cp .env.example .env
   2. Edita .env y configura tus variables
   ...
```

---

### 2. check-credentials.js
**Audita la seguridad y exposición de credenciales**

```bash
node check-credentials.js
# o
pnpm run check:security
```

**Qué verifica:**
- 🔒 Archivo `.env` no está en Git (ni trackeado)
- 🔒 No hay API keys hardcodeadas en el código fuente
- 🔒 Variables de entorno usan `import.meta.env` (no `process.env`)
- 🔒 `.env` tiene valores diferentes a `.env.example`
- 🔒 No hay credenciales en el historial de Git

**Patrones que detecta:**
- Google Maps API Keys (`AIza...`)
- API keys genéricas
- Stripe keys (live y test)
- Passwords hardcodeadas
- Secrets y tokens

**Salida exitosa:**
```
✅ ¡Auditoría de seguridad APROBADA! 🎉
   No se encontraron problemas de seguridad.
```

**Ejemplo de salida con problemas:**
```
❌ Problemas de Seguridad CRÍTICOS:
   ❌ CRÍTICO: Archivo .env está trackeado en Git
   ⚠️  src/config.ts: API Key hardcodeada
   
📝 Acciones Recomendadas:
   1. Remueve .env del repositorio: git rm --cached .env
   2. Reemplaza API keys con import.meta.env.VITE_*
   ...
```

---

### 3. Ejecutar todos los checks
```bash
pnpm run check:all
```

Ejecuta ambos scripts en secuencia.

---

## 🎯 Cuándo Ejecutar Estos Scripts

### ✅ **Recomendado (Ejecutar Siempre)**

1. **Antes de hacer commit**
   ```bash
   pnpm run check:all
   git add .
   git commit -m "..."
   ```

2. **Después de clonar el repositorio**
   ```bash
   git clone <repo>
   cd Frontend_...
   pnpm install
   pnpm run check:config  # Verifica qué falta configurar
   ```

3. **Al configurar variables de entorno por primera vez**
   ```bash
   cp .env.example .env
   # Edita .env...
   pnpm run check:config  # Valida que todo está bien
   ```

4. **Antes de desplegar a producción**
   ```bash
   pnpm run check:all
   pnpm run build
   ```

### 🔧 **Opcional (Debugging)**

5. **Si el frontend no se conecta al backend**
   ```bash
   pnpm run check:config  # Verifica VITE_API_URL
   ```

6. **Si Google Maps no funciona**
   ```bash
   pnpm run check:config  # Verifica VITE_GOOGLE_MAPS_API_KEY
   ```

7. **Si sospechas una filtración de credenciales**
   ```bash
   pnpm run check:security
   ```

---

## 🚨 Problemas Comunes y Soluciones

### ❌ "Archivo .env no existe"
**Solución:**
```bash
cp .env.example .env
```

### ❌ ".env está trackeado en Git"
**Solución:**
```bash
# Agregar .env al .gitignore (ya debería estar)
echo ".env" >> .gitignore

# Remover del tracking
git rm --cached .env

# Commit el cambio
git commit -m "Remove .env from tracking"
```

### ❌ ".env usa la misma API key que .env.example"
**Solución:**
1. Ve a https://console.cloud.google.com/
2. Crea un proyecto o selecciona uno existente
3. Habilita "Maps JavaScript API" y "Places API"
4. Ve a "Credentials" → "Create Credentials" → "API Key"
5. Copia la key generada (comienza con `AIza...`)
6. Edita `.env` y reemplaza:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...tu_key_real_aqui
   ```
7. Ejecuta `pnpm run check:security` para verificar

### ❌ "API Key hardcodeada encontrada en..."
**Problema:** El código tiene una API key directamente en lugar de usar variables de entorno.

**Solución:**
```typescript
// ❌ MAL - API key hardcodeada
const apiKey = "AIzaSyXXXXXXXXXXXXX";

// ✅ BIEN - Usar variable de entorno
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
```

### ⚠️ "usa process.env en lugar de import.meta.env"
**Problema:** Vite usa `import.meta.env`, no `process.env`

**Solución:**
```typescript
// ❌ MAL - No funciona en Vite
const apiUrl = process.env.VITE_API_URL;

// ✅ BIEN - Sintaxis correcta de Vite
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 💡 Mejores Prácticas para Variables de Entorno en Frontend

### ✅ **SÍ hacer:**

1. **Usar prefijo VITE_**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIza...
   VITE_API_URL=http://localhost:3000
   ```

2. **Excluir .env del control de versiones**
   ```gitignore
   # .gitignore
   .env
   .env.local
   .env.*.local
   ```

3. **Proporcionar .env.example con placeholders**
   ```env
   # .env.example
   VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key_aqui
   ```

4. **Acceder con import.meta.env**
   ```typescript
   const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
   ```

5. **Reiniciar el servidor después de cambiar .env**
   ```bash
   # Ctrl+C para detener
   pnpm run dev
   ```

### ❌ **NO hacer:**

1. **Hardcodear credenciales**
   ```typescript
   // ❌ MAL
   const apiKey = "AIzaSyXXXXXXXXX";
   ```

2. **Commitear .env al repositorio**
   ```bash
   # ❌ MAL
   git add .env
   git commit -m "Add config"
   ```

3. **Usar variables sin prefijo VITE_**
   ```env
   # ❌ MAL - No será accesible
   GOOGLE_MAPS_API_KEY=AIza...
   ```

4. **Poner secretos sensibles del servidor en VITE_**
   ```env
   # ❌ MAL - Las variables VITE_ son PÚBLICAS
   VITE_DATABASE_PASSWORD=secret123
   VITE_JWT_SECRET=supersecret
   ```

5. **Usar process.env en Vite**
   ```typescript
   // ❌ MAL - No funciona
   const key = process.env.VITE_API_KEY;
   ```

---

## 🔐 Nota Importante sobre Seguridad

**Las variables `VITE_*` son PÚBLICAS:**

- Se **incluyen en el bundle JavaScript** del navegador
- Cualquier usuario puede verlas en DevTools
- **NO pongas secrets sensibles** (passwords de DB, JWT secrets, etc.)
- Las API keys del frontend son OK, pero **configura restricciones**

### Configurar Restricciones de Google Maps API

1. Ve a https://console.cloud.google.com/apis/credentials
2. Selecciona tu API Key
3. En "Application restrictions":
   - **Desarrollo:** Selecciona "HTTP referrers" → Agrega `http://localhost:5173/*`
   - **Producción:** Agrega tu dominio → `https://tudominio.com/*`
4. En "API restrictions":
   - Selecciona "Restrict key"
   - Habilita solo: "Maps JavaScript API" y "Places API"

Esto evita que alguien robe tu key y la use en otros sitios.

---

## 📚 Recursos Adicionales

- **Vite Environment Variables:** https://vitejs.dev/guide/env-and-mode.html
- **Google Maps API Security:** https://developers.google.com/maps/api-security-best-practices
- **Frontend Security Best Practices:** https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html

---

**¿Problemas?** Ejecuta `pnpm run check:all` y sigue las recomendaciones que aparecen.
