# 🗺️ Mapa de Estructura del Proyecto - Auto Quote Generator

## 📁 Estructura Principal

```
auto-quote-generator/
│
├── 📱 app/                          # Next.js App Router
│   ├── layout.tsx                   # Layout principal de la aplicación
│   ├── page.tsx                     # Página de inicio (lista de cotizaciones)
│   ├── globals.css                  # Estilos globales
│   │
│   ├── api/                         # API Routes
│   │   └── quotations/
│   │       └── [id]/
│   │           └── pdf/
│   │               └── route.ts     # Endpoint para generar PDF
│   │
│   └── quotations/                  # Rutas de cotizaciones
│       ├── actions.ts               # Server Actions
│       ├── new/
│       │   └── page.tsx             # Crear nueva cotización
│       └── [id]/
│           ├── page.tsx             # Ver cotización
│           └── edit/
│               └── page.tsx         # Editar cotización
│
├── 🧩 components/                   # Componentes React
│   ├── quotation/                   # Componentes de cotización
│   │   ├── QuotationForm.tsx        # Formulario de cotización
│   │   ├── QuotationList.tsx        # Lista de cotizaciones
│   │   └── QuotationView.tsx        # Vista de cotización
│   │
│   ├── pdf/                         # Componentes para PDF
│   │   └── QuotationPDF.tsx         # Plantilla de PDF
│   │
│   └── ui/                          # Componentes UI reutilizables
│       ├── Button.tsx               # Botón
│       ├── Card.tsx                 # Tarjeta
│       ├── Input.tsx                # Input de texto
│       ├── Loading.tsx              # Indicador de carga
│       ├── Modal.tsx                # Modal
│       └── Select.tsx               # Select/dropdown
│
├── 🔧 lib/                          # Utilidades y configuraciones
│   ├── prisma.ts                    # Cliente de Prisma
│   ├── utils.ts                     # Funciones de utilidad
│   ├── validations.ts               # Validaciones de datos
│   └── constants.ts                 # Constantes de la aplicación
│
├── 🗄️ prisma/                       # Prisma ORM
│   ├── schema.prisma                # Esquema de la base de datos
│   └── migrations/                  # Migraciones de la base de datos
│       ├── migration_lock.toml
│       └── 20260312032909_init/
│           └── migration.sql
│
├── 📦 generated/                    # Archivos generados por Prisma
│   └── prisma/                      # Cliente de Prisma generado
│       ├── client.js
│       ├── index.js
│       └── runtime/
│
├── 🎯 types/                        # Definiciones de tipos TypeScript
│   ├── index.ts                     # Exportaciones de tipos
│   └── quotation.ts                 # Tipos de cotización
│
├── ⚙️ config/                       # Configuraciones
│   └── workshop.ts                  # Configuración del taller
│
├── 📚 docs/                         # Documentación
│   └── superpowers/
│       └── specs/
│           └── 2026-03-11-automotive-quotation-system-design.md
│
├── 🎨 public/                       # Archivos estáticos
│   └── [assets estáticos]
│
├── 🤖 .agents/                      # Skills de Claude Code
│   └── skills/
│       ├── systematic-debugging/
│       ├── web-design-guidelines/
│       ├── find-skills/
│       ├── prisma-expert/
│       ├── brainstorming/
│       ├── frontend-design/
│       ├── vercel-react-best-practices/
│       ├── neon-postgres/
│       └── interface-design/
│
└── 📄 Archivos de configuración
    ├── package.json                 # Dependencias del proyecto
    ├── tsconfig.json                # Configuración de TypeScript
    ├── next.config.ts               # Configuración de Next.js
    ├── prisma.config.ts             # Configuración de Prisma
    ├── eslint.config.mjs            # Configuración de ESLint
    ├── .oxlintrc.json               # Configuración de Oxlint
    ├── .oxfmtrc.json                # Configuración de Oxfmt
    ├── postcss.config.mjs           # Configuración de PostCSS
    ├── .env                         # Variables de entorno
    ├── .env.example                 # Ejemplo de variables de entorno
    ├── .gitignore                   # Archivos ignorados por Git
    ├── README.md                    # Documentación principal
    └── SKILL.md                     # Documentación de skills
```

## 🎯 Flujo de la Aplicación

### 1. **Páginas Principales**

- `/` - Lista de cotizaciones (QuotationList)
- `/quotations/new` - Crear nueva cotización (QuotationForm)
- `/quotations/[id]` - Ver cotización (QuotationView)
- `/quotations/[id]/edit` - Editar cotización (QuotationForm)

### 2. **API Endpoints**

- `POST /api/quotations/[id]/pdf` - Generar y descargar PDF de cotización

### 3. **Server Actions** (app/quotations/actions.ts)

- `createQuotation()` - Crear cotización
- `updateQuotation()` - Actualizar cotización
- `deleteQuotation()` - Eliminar cotización
- `getQuotations()` - Obtener lista de cotizaciones
- `getQuotation()` - Obtener cotización por ID

## 🗃️ Modelo de Datos (Prisma)

```prisma
model Quotation {
  id                String
  quotationNumber   String
  customerName      String
  vehicleInfo       Json
  items             QuotationItem[]
  subtotal          Float
  iva               Float
  total             Float
  createdAt         DateTime
  updatedAt         DateTime
}

model QuotationItem {
  id            String
  description   String
  quantity      Int
  unitPrice     Float
  total         Float
  quotationId   String
  quotation     Quotation
}
```

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Base de datos**: Neon Postgres (Serverless)
- **ORM**: Prisma
- **Estilos**: Tailwind CSS
- **Generación de PDF**: @react-pdf/renderer
- **Linting**: Oxlint
- **Formato**: Oxfmt
- **Lenguaje**: TypeScript

## 📊 Componentes Clave

### Componentes de Quotation

- **QuotationForm**: Formulario para crear/editar cotizaciones
- **QuotationList**: Tabla de cotizaciones con paginación
- **QuotationView**: Vista detallada de una cotización
- **QuotationPDF**: Plantilla de PDF para descargar

### Componentes UI

- **Button**: Botón reutilizable con variantes
- **Card**: Contenedor de tarjeta
- **Input**: Campo de entrada de texto
- **Select**: Selector desplegable
- **Modal**: Diálogo modal
- **Loading**: Indicador de carga

## 🔄 Flujo de Datos

```
Usuario → Interfaz (Components) → Server Actions → Prisma → Neon Postgres
                                        ↓
                                    Validations
                                        ↓
                                    Response
```

## 📝 Notas Importantes

- El proyecto usa **Bun** como runtime y gestor de paquetes
- La base de datos está en **Neon** (Postgres serverless)
- El cliente de Prisma se genera en `/generated/prisma`
- Los estilos globales están en `app/globals.css`
- Las validaciones están centralizadas en `lib/validations.ts`
- La configuración del taller está en `config/workshop.ts`
