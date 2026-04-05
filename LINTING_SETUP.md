# 🔧 Guía Completa de Configuración de Linting

Esta guía explica cómo replicar la configuración de linting y formateo de este proyecto en cualquier otro proyecto.

## 📋 Tabla de Contenidos

- [Resumen del Sistema](#resumen-del-sistema)
- [Qué hace cada herramienta](#qué-hace-cada-herramienta)
- [Instalación desde Cero](#instalación-desde-cero)
- [Archivos de Configuración](#archivos-de-configuración)
- [Scripts de Package.json](#scripts-de-packagejson)
- [Integración con VSCode](#integración-con-vscode)
- [Uso Diario](#uso-diario)
- [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🎯 Resumen del Sistema

Este proyecto usa una **arquitectura híbrida** de linting y formateo:

| Herramienta | Propósito | Archivo de Config |
|-------------|-----------|-------------------|
| **Oxlint** | Linter principal (TypeScript/React) | `.oxlintrc.json` |
| **Oxfmt** | Formateador + ordenamiento Tailwind | `.oxfmtrc.json` |
| **ESLint** | Ordenamiento de imports y keys | `eslint.config.mjs` |

### ¿Por qué esta combinación?

- **Oxlint**: Ultra-rápido (escrito en Rust), valida TypeScript con type-checking
- **Oxfmt**: Más rápido que Prettier, **ordena automáticamente las clases de Tailwind**
- **ESLint**: Usado solo para reglas específicas que Oxlint no cubre (imports, ordenamiento)

---

## 🔍 Qué hace cada herramienta

### 1. **Oxlint** - Validación de Código

✅ Valida reglas de TypeScript (type safety)
✅ Detecta promesas sin await
✅ Valida unsafe types
✅ Reglas de React
✅ Detecta código problemático

**Ejemplo:**
```typescript
// ❌ Oxlint detecta esto como error
const data: any = fetchData() // no-explicit-any
await nonPromise // await-thenable

// ✅ Correcto
const data: User = fetchData()
await realPromise
```

### 2. **Oxfmt** - Formateo y Tailwind

✅ Formatea código (estilo, indentación)
✅ **Ordena clases de Tailwind automáticamente**
✅ Elimina clases duplicadas
✅ Funciona con `clsx()`, `cn()`, `cva()`

**Ejemplo:**
```tsx
// ❌ Antes de oxfmt
<div className="mt-4 bg-blue-500 p-2 flex hover:bg-blue-600">

// ✅ Después de oxfmt (ordenado según convención Tailwind)
<div className="flex bg-blue-500 p-2 mt-4 hover:bg-blue-600">
```

**Orden de clases Tailwind:** Layout → Spacing → Typography → Colors → Effects

### 3. **ESLint** - Ordenamiento

✅ Agrupa imports (built-in, externos, internos)
✅ Ordena imports alfabéticamente
✅ Ordena destructuring alfabéticamente
✅ Ordena keys de objetos
✅ Reglas de accesibilidad (jsx-a11y)

**Ejemplo:**
```typescript
// ❌ Desordenado
import { useState, useEffect, useMemo } from 'react'
import { api } from '../api'
import fs from 'fs'

// ✅ Ordenado por ESLint
import fs from 'fs'

import { useEffect, useMemo, useState } from 'react'

import { api } from '../api'
```

---

## 🚀 Instalación desde Cero

### Paso 1: Instalar Dependencias

Copia y ejecuta estos comandos en tu nuevo proyecto:

```bash
# Herramientas principales
bun add -d oxlint@1.56.0 oxfmt@0.41.0 eslint@9.39.2 typescript@5.9.3

# TypeScript ESLint
bun add -d @typescript-eslint/eslint-plugin@8.53.0 \
  @typescript-eslint/parser@8.53.0 \
  typescript-eslint@8.53.0

# Plugins de ESLint
bun add -d eslint-plugin-import@2.32.0 \
  eslint-plugin-react@7.37.5 \
  eslint-plugin-react-hooks@7.0.0 \
  eslint-plugin-jsx-a11y@6.10.2 \
  eslint-plugin-jsdoc@50.6.17 \
  eslint-plugin-sort-destructure-keys@2.0.0 \
  eslint-plugin-oxlint@1.41.0 \
  eslint-plugin-jest@29.12.1

# Configuraciones base
bun add -d @eslint/js@9.39.1 \
  @eslint/compat@1.3.2 \
  eslint-config-prettier@10.1.8

# Next.js (si aplica)
bun add -d @next/eslint-plugin-next@16.1.1 \
  eslint-config-next@16.1.6
```

### Paso 2: Crear Estructura de Carpetas

```bash
mkdir -p rigs/eslint
```

### Paso 3: Copiar Archivos de Configuración

Copia los siguientes archivos (ver sección [Archivos de Configuración](#archivos-de-configuración))

---

## 📁 Archivos de Configuración

### 1. `.oxlintrc.json` (raíz del proyecto)

```json
{
  "rules": {
    "typescript/await-thenable": "error",
    "typescript/no-explicit-any": "error",
    "typescript/no-misused-promises": "error",
    "typescript/no-floating-promises": "error",
    "typescript/no-array-delete": "error",
    "typescript/no-base-to-string": "error",
    "typescript/no-base-duplicate-type-constituents": "error",
    "typescript/no-duplicate-type-constituents": "error",
    "typescript/no-empty-object-type": "error",
    "typescript/no-for-in-array": "error",
    "typescript/no-implied-eval": "error",
    "typescript/no-namespace": "error",
    "typescript/no-redundant-type-constituents": "error",
    "typescript/no-require-imports": "error",
    "typescript/no-unnecessary-type-assertion": "error",
    "typescript/no-unnecessary-type-constraint": "error",
    "typescript/no-unsafe-argument": "error",
    "typescript/no-unsafe-call": "error",
    "typescript/no-unsafe-enum-comparison": "error",
    "typescript/no-unsafe-function-type": "error",
    "typescript/no-unsafe-member-access": "error",
    "typescript/no-unsafe-return": "error",
    "typescript/no-unsafe-unary-minus": "error",
    "typescript/no-unused-vars": "error",
    "typescript/only-throw-error": "error",
    "typescript/prefer-namespace-keyword": "error",
    "typescript/prefer-promise-reject-errors": "error",
    "typescript/require-await": "error",
    "typescript/restrict-plus-operands": "error",
    "typescript/restrict-template-expressions": "error",
    "typescript/unbound-method": "error",
    "typescript/explicit-function-return-type": "error",
    "typescript/explicit-module-boundary-types": "error",
    "typescript/no-shadow": "error",
    "typescript/no-unsafe-assignment": "error"
  },
  "plugins": ["react", "unicorn", "typescript", "oxc"],
  "ignorePatterns": [
    "**/public/**",
    "**/generated/**",
    "**/prisma/migrations/**",
    "node_modules/**",
    ".next/**",
    "dist/**",
    "build/**"
  ]
}
```

### 2. `.oxfmtrc.json` (raíz del proyecto)

```json
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": false,
  "experimentalTailwindcss": {
    "stylesheet": "./app/globals.css",
    "attributes": ["className", "class"],
    "functions": ["clsx", "cn", "cva"],
    "preserveDuplicates": false,
    "preserveWhitespace": false
  },
  "ignorePatterns": [
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.git/**",
    "**/generated/**",
    "**/prisma/migrations/**",
    "**/*.min.js"
  ]
}
```

> **⚠️ IMPORTANTE:** Cambia `"./app/globals.css"` a la ruta de tu archivo CSS de Tailwind.

### 3. `rigs/eslint/package.json`

```json
{
  "name": "eslint-config-mi-proyecto",
  "version": "1.0.0",
  "description": "Custom eslint rules",
  "license": "MIT",
  "type": "module",
  "main": "index.mjs",
  "dependencies": {
    "@eslint/compat": "1.3.2",
    "@eslint/js": "9.39.1",
    "@typescript-eslint/eslint-plugin": "8.53.0",
    "@typescript-eslint/parser": "8.53.0",
    "eslint": "9.39.2",
    "eslint-config-prettier": "10.1.8",
    "eslint-plugin-import": "2.32.0",
    "eslint-plugin-jest": "29.12.1",
    "eslint-plugin-jsdoc": "50.6.17",
    "eslint-plugin-jsx-a11y": "6.10.2",
    "eslint-plugin-oxlint": "1.41.0",
    "eslint-plugin-react": "7.37.5",
    "eslint-plugin-react-hooks": "7.0.0",
    "eslint-plugin-sort-destructure-keys": "2.0.0",
    "typescript-eslint": "8.53.0"
  }
}
```

> **⚠️ IMPORTANTE:** Cambia `"eslint-config-mi-proyecto"` por el nombre de tu proyecto.

### 4. `rigs/eslint/index.mjs`

```javascript
// oxlint-disable typescript/no-unsafe-assignment
import eslint from '@eslint/js'
import { fixupPluginRules } from '@eslint/compat'
import tseslint from 'typescript-eslint'
import jsdoc from 'eslint-plugin-jsdoc'
import importRules from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintSortDestructueKeys from 'eslint-plugin-sort-destructure-keys'
import jest from 'eslint-plugin-jest'
import reactPlugin from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import oxlint from 'eslint-plugin-oxlint'

export default tseslint.config(
  eslint.configs.recommended,
  jsdoc.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.all,
  oxlint.configs['flat/recommended'],
  {
    files: ['*.ts', '*.tsx', '*.mjs', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'sort-destructure-keys': eslintSortDestructueKeys,
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
      import: fixupPluginRules(importRules),
      jsdoc,
      react: reactPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
    },
    settings: {
      'import/internal-regex': '^@/',
      'import/resolver': {
        node: {},
        typescript: {},
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Deshabilitar reglas de TypeScript ESLint en favor de Oxlint
      '@typescript-eslint/ban-ts-ignore': 0,
      '@typescript-eslint/camelcase': 0,
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-use-before-define': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-array-constructor': 0,
      '@typescript-eslint/no-array-delete': 0,
      '@typescript-eslint/no-base-to-string': 0,
      '@typescript-eslint/no-duplicate-type-constituents': 0,
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-for-in-array': 0,
      '@typescript-eslint/no-implied-eval': 0,
      '@typescript-eslint/no-namespace': 0,
      '@typescript-eslint/no-redundant-type-constituents': 0,
      '@typescript-eslint/no-require-imports': 0,
      '@typescript-eslint/no-unnecessary-type-assertion': 0,
      '@typescript-eslint/no-unnecessary-type-constraint': 0,
      '@typescript-eslint/no-unsafe-argument': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/no-unsafe-enum-comparison': 0,
      '@typescript-eslint/no-unsafe-function-type': 0,
      '@typescript-eslint/no-unsafe-member-access': 0,
      '@typescript-eslint/no-unsafe-return': 0,
      '@typescript-eslint/no-unsafe-unary-minus': 0,
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/only-throw-error': 0,
      '@typescript-eslint/prefer-namespace-keyword': 0,
      '@typescript-eslint/prefer-promise-reject-errors': 0,
      '@typescript-eslint/require-await': 0,
      '@typescript-eslint/restrict-plus-operands': 0,
      '@typescript-eslint/restrict-template-expressions': 0,
      '@typescript-eslint/unbound-method': 0,
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-shadow': 0,

      // Reglas generales
      'arrow-body-style': 0,
      'consistent-return': 0,
      'import/no-cycle': 'off',
      'import/extensions': 0,
      'import/prefer-default-export': 0,
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['**/*.stories.*', '**/*.spec.*', '**/__tests__/*'],
          optionalDependencies: false,
        },
      ],

      // 🔄 ORDENAMIENTO DE IMPORTS (alfabético)
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            'builtin',    // Node.js built-ins
            'external',   // node_modules
            'internal',   // @/ imports
            'parent',     // ../
            'sibling',    // ./
            'index',      // ./index
          ],
        },
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/src/*', '**/index'],
          paths: [
            {
              name: 'clsx',
              message: 'Use "clsx/lite" instead of "clsx"',
            },
          ],
        },
      ],

      // React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/forbid-component-props': 'off',
      'react/jsx-no-literals': 'off',
      'react/require-default-props': 'off',
      'react/prefer-read-only-props': 'off',
      'react/jsx-no-bind': 'off',
      'react/jsx-max-depth': 'off',
      'react/forbid-prop-types': 0,
      'react/jsx-closing-tag-location': 0,
      'react/jsx-curly-newline': 0,
      'react/jsx-filename-extension': 0,
      'react/jsx-one-expression-per-line': 0,
      'react/jsx-wrap-multilines': 0,
      'react/no-array-index-key': 1,
      'react/prop-types': 0,
      'react/state-in-constructor': 0,
      'react/static-property-placement': 0,
      'class-methods-use-this': ['error', { exceptMethods: ['render'] }],
      'react/button-has-type': 'error',
      'react/no-multi-comp': 'error',
      'react/no-unused-state': 'error',
      'react/no-unused-prop-types': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react/jsx-fragments': 'error',
      'react/jsx-no-leaked-render': 'off',

      // 🔤 ORDENAMIENTO (destructuring, imports, keys)
      'sort-destructure-keys/sort-destructure-keys': 2,
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: true,
          ignoreCase: true,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
      'sort-keys': [
        'error',
        'asc',
        { caseSensitive: true, minKeys: 2, natural: false },
      ],
      'sort-vars': ['error', { ignoreCase: true }],

      // JSDoc
      'jsdoc/check-tag-names': [
        'error',
        { definedTags: ['defaultValue', 'jest-environment'] },
      ],
      'jsdoc/require-description': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/require-jsdoc': [
        'error',
        {
          contexts: [
            'ArrowFunctionExpression',
            'ClassDeclaration',
            'ClassExpression',
            'FunctionDeclaration',
            'FunctionExpression',
            'MethodDefinition',
          ],
        },
      ],
      'jsdoc/require-param-description': 'error',
      'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
      'jsdoc/require-returns': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',

      // Otras reglas
      'no-param-reassign': [
        'error',
        {
          ignorePropertyModificationsFor: ['acc', 'req', 'draft', 'state'],
          props: true,
        },
      ],
      'no-console': 'error',
      'no-shadow': 0,
      'no-underscore-dangle': 0,
      'no-use-before-define': 0,
    },
  },
  {
    files: ['*.tsx', '**/*.tsx'],
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  {
    files: [
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.stories.*',
      '**/*.page.spec.tsx',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/__mocks__/**',
      '**/__tests__/**',
    ],
    plugins: { jest },
    rules: {
      'react/no-multi-comp': 'off',
      'react/jsx-no-undef': 'off',
      'jsdoc/require-jsdoc': 'off',
      'import/no-extraneous-dependencies': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  eslintConfigPrettier
)
```

> **⚠️ IMPORTANTE:** En la línea con `'import/internal-regex'`, cambia `'^@/'` por tu prefijo de imports internos.

### 5. `eslint.config.mjs` (raíz del proyecto)

```javascript
import nextPlugin from '@next/eslint-plugin-next'
import sharedConfig from 'eslint-config-mi-proyecto'

export default [
  ...sharedConfig,
  {
    files: ['*.ts', '*.tsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-duplicate-head': 'off',
    },
  },
  {
    ignores: [
      '.next',
      'coverage',
      'node_modules/**',
      '**/__generated__/**',
      '**/generated/**',
      'public/**',
    ],
  },
]
```

> **⚠️ IMPORTANTE:** Cambia `'eslint-config-mi-proyecto'` por el nombre que usaste en `rigs/eslint/package.json`.

---

## 📝 Scripts de Package.json

Agrega estas secciones a tu `package.json`:

```json
{
  "workspaces": {
    "packages": [
      "rigs/eslint"
    ]
  },
  "type": "module",
  "scripts": {
    "lint": "oxlint .",
    "lint:fix": "oxlint --fix .",
    "format": "oxfmt --write .",
    "check": "bun run lint:fix && bun run format"
  }
}
```

### Instalación final

```bash
# Instalar workspace de eslint
cd rigs/eslint
bun install
cd ../..

# Instalar proyecto principal
bun install

# Verificar
bun run check
```

---

## 🎨 Integración con VSCode

### 1. Instalar Extensiones

- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)

### 2. Configurar `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.experimental.useFlatConfig": true
}
```

### 3. Agregar `.prettierrc` (para compatibilidad con VSCode)

```json
{
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": false
}
```

---

## 💻 Uso Diario

### Comandos principales

```bash
# Verificar errores de código (no modifica archivos)
bun run lint

# Arreglar errores automáticamente
bun run lint:fix

# Formatear código y ordenar Tailwind
bun run format

# Ejecutar linting + formateo (comando completo)
bun run check
```

### Workflow típico

1. **Escribes código**
2. **Guardas el archivo** → VSCode formatea automáticamente (si tienes la extensión)
3. **Antes de commit:**
   ```bash
   bun run check
   ```
4. **Si hay errores:** Revisa y corrige los que no se arreglaron automáticamente

### Pre-commit hook (opcional)

Instala `husky` y `lint-staged`:

```bash
bun add -d husky lint-staged
npx husky init
```

`.husky/pre-commit`:
```bash
#!/bin/sh
bun run check
```

`package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "oxlint --fix",
      "oxfmt --write"
    ]
  }
}
```

---

## ❓ Preguntas Frecuentes

### ¿Quién ordena las clases de Tailwind?

**Oxfmt** con la configuración `experimentalTailwindcss` en `.oxfmtrc.json`.

### ¿Quién ordena los imports alfabéticamente?

**ESLint** con dos reglas:
- `import/order` → Agrupa por tipo (externos, internos, etc.)
- `sort-imports` → Ordena alfabéticamente dentro de cada grupo

### ¿Por qué usar Oxlint en lugar de solo ESLint?

Oxlint es **100x más rápido** que ESLint porque está escrito en Rust. Además, tiene mejor soporte para type-checking de TypeScript.

### ¿Puedo usar solo Oxfmt sin ESLint?

Sí, pero perderías:
- Ordenamiento automático de imports
- Ordenamiento de destructuring y keys
- Reglas de accesibilidad (jsx-a11y)

### ¿Funciona con otros frameworks además de Next.js?

Sí. Solo necesitas:
1. Quitar `@next/eslint-plugin-next` de las dependencias
2. Modificar `eslint.config.mjs` para remover la configuración de Next.js

### ¿Cómo desactivo reglas específicas?

**Para Oxlint** (`.oxlintrc.json`):
```json
{
  "rules": {
    "typescript/no-explicit-any": "off"
  }
}
```

**Para ESLint** (`rigs/eslint/index.mjs`):
```javascript
rules: {
  'import/order': 'off',
}
```

### ¿Cómo excluyo archivos del linting?

**Oxlint** (`.oxlintrc.json`):
```json
{
  "ignorePatterns": [
    "**/mi-carpeta/**",
    "**/*.generated.ts"
  ]
}
```

**Oxfmt** (`.oxfmtrc.json`):
```json
{
  "ignorePatterns": [
    "**/mi-carpeta/**"
  ]
}
```

### Las clases de Tailwind no se ordenan, ¿qué hago?

1. Verifica que `.oxfmtrc.json` tenga la sección `experimentalTailwindcss`
2. Verifica que `stylesheet` apunte a tu archivo CSS correcto
3. Ejecuta manualmente: `bun run format`
4. Reinicia VSCode

### ¿Puedo cambiar el estilo de formateo?

Sí, modifica `.oxfmtrc.json`:

```json
{
  "printWidth": 100,        // Ancho de línea
  "singleQuote": false,     // Usar comillas dobles
  "trailingComma": "all",   // Comas finales siempre
  "semi": true              // Punto y coma obligatorio
}
```

---

## 📦 Estructura Final del Proyecto

```
mi-proyecto/
├── .oxlintrc.json              # Config Oxlint
├── .oxfmtrc.json               # Config Oxfmt (Tailwind)
├── eslint.config.mjs           # Config ESLint principal
├── .prettierrc                 # Config Prettier (para VSCode)
├── package.json                # Scripts + workspaces
├── .vscode/
│   └── settings.json           # Config VSCode
├── rigs/
│   └── eslint/
│       ├── package.json        # Deps del workspace
│       └── index.mjs           # Reglas compartidas
└── ... tu código
```

---

## 🔗 Enlaces Útiles

- [Oxlint Docs](https://oxc.rs/docs/guide/usage/linter.html)
- [Oxfmt Docs](https://oxc.rs/docs/guide/usage/formatter.html)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

---

## 📄 Licencia

Esta configuración es de código abierto y puede ser usada libremente en cualquier proyecto.

---

## 🤝 Contribuciones

Si encuentras mejoras o errores, siéntete libre de crear un issue o pull request.

---

**¿Preguntas?** Revisa la sección de [Preguntas Frecuentes](#preguntas-frecuentes) o abre un issue.
