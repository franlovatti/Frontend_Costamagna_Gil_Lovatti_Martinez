#!/usr/bin/env node

/**
 * Script para validar la configuración de variables de entorno del Frontend
 * Ejecutar con: node check-config.js
 */

import { readFileSync, existsSync } from 'fs';

console.log('\n🔍 Validando configuración del Frontend...\n');

const issues = [];
const warnings = [];

// Función para parsear variables de entorno desde archivo .env
function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  
  const content = readFileSync(filePath, 'utf-8');
  const env = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

// 1. Verificar que existe .env
console.log('1️⃣ Verificando archivos de configuración...');
if (!existsSync('.env')) {
  issues.push('❌ CRÍTICO: Archivo .env no existe');
  console.log('   ❌ .env no encontrado');
  console.log('   📝 Crea uno copiando: cp .env.example .env');
} else {
  console.log('   ✅ .env existe');
}

if (!existsSync('.env.example')) {
  warnings.push('⚠️  .env.example no existe (debería existir como plantilla)');
} else {
  console.log('   ✅ .env.example existe');
}

// 2. Leer y validar variables de entorno
console.log('\n2️⃣ Validando variables de entorno...');
const env = parseEnvFile('.env');

if (env) {
  // Variables requeridas de Vite (deben comenzar con VITE_)
  const requiredVars = {
    'VITE_GOOGLE_MAPS_API_KEY': {
      required: false,
      description: 'API Key de Google Maps (opcional)',
      validator: (value) => {
        if (!value) return { valid: true, warning: 'No configurada - los mapas no funcionarán' };
        if (!value.startsWith('AIza')) return { valid: false, error: 'Debe comenzar con "AIza"' };
        if (value.length < 30) return { valid: false, error: 'Muy corta (¿es válida?)' };
        return { valid: true };
      }
    },
    'VITE_API_URL': {
      required: false,
      description: 'URL del Backend API (opcional, por defecto http://localhost:3000)',
      validator: (value) => {
        if (!value) return { valid: true, warning: 'No configurada - usará http://localhost:3000' };
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          return { valid: false, error: 'Debe comenzar con http:// o https://' };
        }
        return { valid: true };
      }
    }
  };

  console.log('   📋 Variables de Entorno:\n');

  // Verificar cada variable
  for (const [key, config] of Object.entries(requiredVars)) {
    const value = env[key];
    
    if (!value || value === '') {
      if (config.required) {
        issues.push(`❌ ${key} no está configurada (requerida)`);
        console.log(`   ❌ ${key}`);
        console.log(`      ${config.description}`);
      } else {
        warnings.push(`⚠️  ${key} no está configurada`);
        console.log(`   ⚠️  ${key}`);
        console.log(`      ${config.description}`);
      }
    } else {
      // Validar el valor
      const result = config.validator(value);
      
      if (!result.valid) {
        issues.push(`❌ ${key}: ${result.error}`);
        console.log(`   ❌ ${key}: ${result.error}`);
      } else if (result.warning) {
        console.log(`   ⚠️  ${key}: ${result.warning}`);
      } else {
        // Mostrar valor parcialmente oculto
        const displayValue = value.length > 10 
          ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
          : '****';
        console.log(`   ✅ ${key}: ${displayValue}`);
        console.log(`      ${config.description}`);
      }
    }
    console.log('');
  }

  // Advertir sobre variables que no empiezan con VITE_
  console.log('\n3️⃣ Verificando prefijo VITE_...');
  let hasNonViteVars = false;
  for (const key of Object.keys(env)) {
    if (!key.startsWith('VITE_') && !key.startsWith('#')) {
      warnings.push(`⚠️  ${key} no tiene prefijo VITE_ (no será accesible en el frontend)`);
      hasNonViteVars = true;
      console.log(`   ⚠️  ${key} - No accesible (debe comenzar con VITE_)`);
    }
  }
  if (!hasNonViteVars) {
    console.log('   ✅ Todas las variables tienen prefijo correcto');
  }

} else {
  console.log('   ⚠️  No se pudo leer .env');
}

// 3. Verificar que .env está en .gitignore
console.log('\n4️⃣ Verificando .gitignore...');
if (existsSync('.gitignore')) {
  const gitignore = readFileSync('.gitignore', 'utf-8');
  if (gitignore.includes('.env') && !gitignore.includes('.env.example')) {
    console.log('   ✅ .env está en .gitignore');
  } else if (!gitignore.includes('.env')) {
    issues.push('❌ CRÍTICO: .env no está en .gitignore');
    console.log('   ❌ .env NO está en .gitignore');
  }
} else {
  warnings.push('⚠️  .gitignore no existe');
  console.log('   ⚠️  .gitignore no encontrado');
}

// 4. Consejos sobre Vite y variables de entorno
console.log('\n💡 Recordatorios Importantes:');
console.log('   • Las variables DEBEN comenzar con VITE_ para ser accesibles');
console.log('   • Los cambios en .env requieren REINICIAR el servidor (pnpm run dev)');
console.log('   • Las variables son PÚBLICAS (visibles en el navegador)');
console.log('   • NUNCA pongas secretos sensibles en VITE_ (usa el backend)');

// Resumen final
console.log('\n' + '═'.repeat(60));
if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ ¡Configuración perfecta! Todo está correcto.\n');
  process.exit(0);
} else {
  if (issues.length > 0) {
    console.log('\n❌ Problemas Críticos:');
    issues.forEach(issue => console.log(`   ${issue}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Advertencias:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  console.log('\n📝 Pasos para solucionar:');
  console.log('   1. Copia .env.example a .env: cp .env.example .env');
  console.log('   2. Edita .env y configura tus variables');
  console.log('   3. Obtén Google Maps API Key: https://console.cloud.google.com/');
  console.log('   4. Reinicia el servidor: pnpm run dev\n');
  
  if (issues.length > 0) {
    process.exit(1);
  }
}
