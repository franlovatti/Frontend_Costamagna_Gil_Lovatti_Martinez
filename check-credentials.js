#!/usr/bin/env node

/**
 * Script para detectar API keys y credenciales expuestas en el Frontend
 * Ejecutar: node check-credentials.js
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { join, extname } from 'path';

console.log('🔍 Auditando seguridad del Frontend...\n');

const issues = [];
const warnings = [];

// 1. Verificar que .env no está trackeado
console.log('1️⃣ Verificando .gitignore...');
try {
  const gitignore = readFileSync('.gitignore', 'utf-8');
  if (!gitignore.includes('.env')) {
    issues.push('❌ CRÍTICO: .env no está en .gitignore');
    console.log('   ❌ .env NO está en .gitignore');
  } else {
    console.log('   ✅ .env está en .gitignore');
  }

  if (gitignore.includes('.env.local')) {
    console.log('   ✅ .env.local también protegido');
  }
} catch (error) {
  issues.push('⚠️  No se encontró archivo .gitignore');
  console.log('   ⚠️  .gitignore no encontrado');
}

// 2. Verificar que .env no está trackeado en Git
console.log('\n2️⃣ Verificando archivos trackeados en Git...');
try {
  const trackedFiles = execSync('git ls-files', { encoding: 'utf-8' });
  if (trackedFiles.includes('.env\n') || trackedFiles.includes('.env ')) {
    issues.push('❌ CRÍTICO: Archivo .env está trackeado en Git');
    console.log('   ❌ .env está trackeado (¡PELIGRO!)');
    console.log('   📝 Para removerlo: git rm --cached .env');
  } else {
    console.log('   ✅ .env no está trackeado');
  }

  if (trackedFiles.includes('.env.local')) {
    issues.push('❌ CRÍTICO: .env.local está trackeado');
    console.log('   ❌ .env.local está trackeado');
  }
} catch (error) {
  console.log('   ⚠️  No se pudo verificar (¿no es un repositorio Git?)');
}

// 3. Buscar API keys hardcodeadas en el código
console.log('\n3️⃣ Buscando API keys hardcodeadas...');

const patterns = [
  {
    pattern: /AIza[0-9A-Za-z_-]{35}/g,
    name: 'Google Maps API Key',
    severity: 'high',
  },
  {
    pattern:
      /(?:api[_-]?key|apikey)\s*[:=]\s*["'](?!import\.meta\.env|process\.env|VITE_)[A-Za-z0-9_-]{20,}["']/gi,
    name: 'API Key hardcodeada',
    severity: 'high',
  },
  {
    pattern: /sk_live_[0-9a-zA-Z]{24,}/g,
    name: 'Stripe Live Key',
    severity: 'critical',
  },
  {
    pattern: /pk_live_[0-9a-zA-Z]{24,}/g,
    name: 'Stripe Publishable Key',
    severity: 'medium',
  },
  {
    pattern: /(?:password|passwd|pwd)\s*[:=]\s*["'][^"']{3,}["']/gi,
    name: 'contrasenia hardcodeada',
    severity: 'critical',
  },
  {
    pattern:
      /(?:secret|token)\s*[:=]\s*["'](?!import\.meta\.env)[^"']{10,}["']/gi,
    name: 'Secret/Token hardcodeado',
    severity: 'high',
  },
];

// Archivos a revisar
const filesToCheck = [
  'index.html',
  'vite.config.ts',
  'vite.config.js',
  '.env.example',
  'README.md',
];

// Función para buscar en directorio
function searchInDirectory(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];

  function traverse(currentPath) {
    try {
      const items = readdirSync(currentPath);

      for (const item of items) {
        const fullPath = join(currentPath, item);

        // Saltar node_modules y dist
        if (
          item === 'node_modules' ||
          item === 'dist' ||
          item === 'build' ||
          item === '.git'
        ) {
          continue;
        }

        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (extensions.includes(extname(fullPath))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Ignorar errores de acceso
    }
  }

  traverse(dir);
  return files;
}

// Buscar en src/
const sourceFiles = searchInDirectory('./src');
const allFiles = [...filesToCheck.filter((f) => existsSync(f)), ...sourceFiles];

let foundIssues = false;

for (const file of allFiles) {
  try {
    const content = readFileSync(file, 'utf-8');

    for (const { pattern, name, severity } of patterns) {
      pattern.lastIndex = 0; // Reset regex
      const matches = [...content.matchAll(pattern)];

      if (matches.length > 0) {
        foundIssues = true;

        // Verificar si es en index.html y usa import.meta.env
        if (
          file.includes('index.html') &&
          content.includes('import.meta.env.VITE_')
        ) {
          continue; // Está bien, usa variables de entorno
        }

        const message = `${file}: ${name} encontrada (${matches.length} coincidencias)`;

        if (severity === 'critical') {
          issues.push(`❌ CRÍTICO: ${message}`);
          console.log(`   ❌ ${file}`);
          console.log(`      🚨 ${name} (CRÍTICO)`);
        } else if (severity === 'high') {
          issues.push(`⚠️  ${message}`);
          console.log(`   ⚠️  ${file}`);
          console.log(`      ⚠️  ${name}`);
        } else {
          warnings.push(`⚠️  ${message}`);
          console.log(`   ⚠️  ${file}`);
          console.log(`      ℹ️  ${name}`);
        }

        // Mostrar primera coincidencia (parcial)
        const firstMatch = matches[0][0];
        const preview =
          firstMatch.length > 50
            ? firstMatch.substring(0, 47) + '...'
            : firstMatch;
        console.log(`      Encontrado: ${preview}\n`);
      }
    }
  } catch (error) {
    // Ignorar errores de lectura
  }
}

if (!foundIssues) {
  console.log('   ✅ No se encontraron API keys hardcodeadas');
}

// 4. Verificar uso correcto de import.meta.env
console.log('\n4️⃣ Verificando uso de variables de entorno...');

let correctUsage = true;

for (const file of sourceFiles) {
  try {
    const content = readFileSync(file, 'utf-8');

    // Buscar process.env en lugar de import.meta.env
    if (content.includes('process.env.VITE_')) {
      warnings.push(`⚠️  ${file} usa process.env en lugar de import.meta.env`);
      console.log(`   ⚠️  ${file}`);
      console.log(`      Usa import.meta.env.VITE_* en lugar de process.env`);
      correctUsage = false;
    }
  } catch (error) {
    // Ignorar
  }
}

if (correctUsage) {
  console.log('   ✅ Uso correcto de variables de entorno (import.meta.env)');
}

// 5. Comparar .env y .env.example
console.log('\n5️⃣ Comparando .env y .env.example...');

if (existsSync('.env') && existsSync('.env.example')) {
  const env = readFileSync('.env', 'utf-8');
  const envExample = readFileSync('.env.example', 'utf-8');

  // Extraer API key de cada archivo
  const apiKeyMatch = env.match(/VITE_GOOGLE_MAPS_API_KEY\s*=\s*(.+)/);
  const apiKeyExampleMatch = envExample.match(
    /VITE_GOOGLE_MAPS_API_KEY\s*=\s*(.+)/,
  );

  if (apiKeyMatch && apiKeyExampleMatch) {
    const apiKey = apiKeyMatch[1].trim();
    const apiKeyExample = apiKeyExampleMatch[1].trim();

    if (apiKey === apiKeyExample) {
      issues.push('❌ CRÍTICO: .env usa la misma API key que .env.example');
      console.log('   ❌ API key es igual al ejemplo');
      console.log(
        '   📝 Genera tu propia API key en: https://console.cloud.google.com/',
      );
    } else {
      console.log('   ✅ .env tiene API key diferente al ejemplo');
    }
  } else {
    console.log('   ⚠️  No se pudo comparar las API keys');
  }
} else {
  console.log('   ⚠️  No se puede comparar (falta .env o .env.example)');
}

// 6. Verificar historial de Git
console.log('\n6️⃣ Buscando credenciales en historial de Git...');

try {
  const gitLog = execSync(
    'git log --all --full-history --source --find-renames --diff-filter=D -- .env',
    {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    },
  );

  if (gitLog.trim()) {
    warnings.push(
      '⚠️  .env fue trackeado anteriormente en el historial de Git',
    );
    console.log('   ⚠️  .env aparece en el historial (fue commiteado antes)');
    console.log(
      '   📝 Considera limpiar el historial si contenía credenciales reales',
    );
  } else {
    console.log('   ✅ .env nunca fue commiteado');
  }
} catch (error) {
  console.log('   ✅ .env nunca fue commiteado');
}

// Información de seguridad
console.log('\n💡 Buenas Prácticas de Seguridad:');
console.log('   • Las variables VITE_ son PÚBLICAS (visibles en el navegador)');
console.log('   • NUNCA pongas secretos del servidor en VITE_*');
console.log('   • Las API keys públicas son OK, pero configura restricciones');
console.log('   • Para Google Maps: Restringe por dominio/HTTP referrer');
console.log('   • Usa el backend como proxy para APIs sensibles');

// Resumen final
console.log('\n' + '═'.repeat(60));

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ ¡Auditoría de seguridad APROBADA! 🎉');
  console.log('   No se encontraron problemas de seguridad.\n');
  process.exit(0);
} else {
  if (issues.length > 0) {
    console.log('\n❌ Problemas de Seguridad CRÍTICOS:');
    issues.forEach((issue) => console.log(`   ${issue}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Advertencias de Seguridad:');
    warnings.forEach((warning) => console.log(`   ${warning}`));
  }

  console.log('\n📝 Acciones Recomendadas:');
  console.log('   1. Agrega .env al .gitignore si no está');
  console.log('   2. Remueve .env del repositorio: git rm --cached .env');
  console.log(
    '   3. Reemplaza API keys hardcodeadas con import.meta.env.VITE_*',
  );
  console.log('   4. Genera tu propia Google Maps API key');
  console.log('   5. Configura restricciones en Google Cloud Console\n');

  if (issues.length > 0) {
    process.exit(1);
  }
}
