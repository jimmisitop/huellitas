const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  // Ignorar archivos generados
  globalIgnores([
    'dist/*',
    '.expo/*',
    'node_modules/*',
    '*.config.js',
    '*.config.ts',
  ]),

  // Configuración base de Expo (incluye TypeScript, React, etc.)
  expoConfig,

  // Reglas personalizadas del proyecto
  {
    rules: {
      // Advertencia para console.log (usa console.warn/error en producción)
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Preferir const sobre let
      'prefer-const': 'error',

      // No usar var
      'no-var': 'error',

      // Evitar variables no usadas (TypeScript se encarga mejor)
      'no-unused-vars': 'off',
    },
  },
]);
