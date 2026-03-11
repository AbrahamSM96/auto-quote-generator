# Automotive Workshop Quotation System - Design Specification

**Date:** March 11, 2026
**Version:** 1.0
**Status:** Draft

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Technical Stack](#technical-stack)
4. [Database Schema](#database-schema)
5. [Application Structure](#application-structure)
6. [Page Designs & Routes](#page-designs--routes)
7. [Component Architecture](#component-architecture)
8. [Data Flow & Server Actions](#data-flow--server-actions)
9. [Styling & UI Design](#styling--ui-design)
10. [Error Handling & Validation](#error-handling--validation)
11. [PDF Generation](#pdf-generation)
12. [Workshop Configuration](#workshop-configuration)
13. [Future Enhancements](#future-enhancements)

---

## Executive Summary

This document outlines the design for a modern automotive workshop quotation system built with Next.js. The initial version focuses on core quotation functionality (create, view, edit, delete, PDF generation) without authentication, allowing for rapid deployment and testing. Authentication and multi-user features will be added in a future phase.

### Key Features (MVP)

- ✅ Create professional quotations with comprehensive vehicle and service details
- ✅ Dynamic pricing sections (bodywork, paint, parts & accessories)
- ✅ Auto-calculate totals and remaining balance
- ✅ Generate professional PDF quotations
- ✅ View and edit existing quotations
- ✅ Search quotations by client, vehicle, or folio number
- ✅ Modern dark mode UI with Spanish language support
- ✅ Mexican Peso (MXN) currency formatting

### Deferred to Future Phases

- ⏳ Authentication (Google, Facebook via NextAuth)
- ⏳ Role-based access control (Admin/User)
- ⏳ User management
- ⏳ Workshop settings administration panel
- ⏳ Multi-tenant support

---

## System Overview

### Architecture

The application follows a modern Next.js App Router architecture with Server Components as the default and Client Components only where interactivity is required.

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │ Server         │  │ Client           │  │ API Routes  │ │
│  │ Components     │  │ Components       │  │             │ │
│  │                │  │                  │  │             │ │
│  │ - List page    │  │ - Quotation form │  │ - PDF gen   │ │
│  │ - View page    │  │ - Dynamic rows   │  │             │ │
│  │                │  │ - Search UI      │  │             │ │
│  └───────┬────────┘  └────────┬─────────┘  └──────┬──────┘ │
│          │                    │                    │         │
│          └────────────────────┼────────────────────┘         │
│                               │                              │
│                    ┌──────────▼──────────┐                  │
│                    │  Server Actions     │                  │
│                    │                     │                  │
│                    │ - createQuotation() │                  │
│                    │ - updateQuotation() │                  │
│                    │ - deleteQuotation() │                  │
│                    │ - getQuotations()   │                  │
│                    └──────────┬──────────┘                  │
│                               │                              │
├───────────────────────────────┼──────────────────────────────┤
│                    ┌──────────▼──────────┐                  │
│                    │   Prisma ORM        │                  │
│                    └──────────┬──────────┘                  │
│                               │                              │
│                    ┌──────────▼──────────┐                  │
│                    │   PostgreSQL        │                  │
│                    │                     │                  │
│                    │ - quotations        │                  │
│                    └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User creates quotation:** Form submission → Server Action → PostgreSQL → Redirect to list
2. **User views quotations:** Server Component → Direct Prisma query → SSR HTML → Client
3. **User generates PDF:** API Route → Fetch quotation → @react-pdf/renderer → Download
4. **User searches:** Client-side filtering of pre-loaded data (fast, no server roundtrip)

---

## Technical Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **TailwindCSS** | 4.x | Styling framework |
| **PostgreSQL** | Latest | Relational database |
| **Prisma** | Latest | ORM for database access |

### Additional Libraries

- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@react-pdf/renderer** - PDF generation
- **Sonner** - Toast notifications
- **date-fns** - Date manipulation (optional)

### Development Tools

- **ESLint** - Code linting
- **oxlint** - Fast linter and code formatter (Rust-based)
- **TypeScript** - Static type checking

---

## Database Schema

### Single Table Architecture

The quotation system uses a single-table design with JSON fields for dynamic arrays. This approach simplifies queries and matches the document-oriented nature of quotations.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Quotation {
  id        String   @id @default(cuid())
  folio     Int      @unique @default(autoincrement())

  // Client information
  clientName     String
  clientPhone    String
  clientEmail    String
  clientAddress  String

  // Vehicle information
  vehicleBrand      String
  vehicleModel      String
  vehicleYear       String
  vehicleColor      String
  vehiclePlates     String
  vehiclePaintCode  String

  // Services (array of selected service keys)
  services          Json   // ["collision", "fullPaint", "bumperRepair", ...]
  customService     String?  // Custom service description if "other" selected

  // Service details
  estimatedTime     String  // "2 a 3 Días Hábiles", "1 Semana", etc.
  piecesToWork      Int     @default(1)

  // Work items (stored as JSON arrays)
  bodyworkItems  Json   // [{id, description, cost}, ...]
  paintItems     Json   // [{id, part, quantity, unitPrice, total}, ...]
  partItems      Json   // [{id, description, cost}, ...]

  // Pricing
  totalAmount       Decimal @db.Decimal(10, 2)
  downPayment       Decimal @db.Decimal(10, 2) @default(0)
  remainingBalance  Decimal @db.Decimal(10, 2)

  // Timestamps
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Indexes for search performance
  @@index([folio])
  @@index([clientName])
  @@index([vehicleBrand])
  @@index([createdAt])
}
```

### TypeScript Types

```typescript
// types/quotation.ts

export type BodyworkItem = {
  id: string;
  description: string;
  cost: number;
}

export type PaintItem = {
  id: string;
  part: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PartItem = {
  id: string;
  description: string;
  cost: number;
}

export type QuotationFormData = {
  // Client
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;

  // Vehicle
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  vehiclePlates: string;
  vehiclePaintCode: string;

  // Services
  services: string[];
  customService?: string;
  estimatedTime: string;
  piecesToWork: number;

  // Items
  bodyworkItems: BodyworkItem[];
  paintItems: PaintItem[];
  partItems: PartItem[];

  // Totals
  totalAmount: number;
  downPayment: number;
  remainingBalance: number;
}
```

---

## Application Structure

### Directory Organization

```
auto-quote-generator/
├── app/
│   ├── layout.tsx                 # Root layout (Spanish locale, fonts, dark mode)
│   ├── page.tsx                   # Homepage - quotation list (Server Component)
│   ├── globals.css                # Global styles, TailwindCSS, dark mode theme
│   │
│   ├── quotations/
│   │   ├── new/
│   │   │   └── page.tsx           # Create quotation form (Client Component)
│   │   ├── [id]/
│   │   │   ├── page.tsx           # View quotation (Server Component)
│   │   │   └── edit/
│   │   │       └── page.tsx       # Edit quotation form (Client Component)
│   │   └── actions.ts             # Server Actions for CRUD operations
│   │
│   └── api/
│       └── quotations/
│           └── [id]/
│               └── pdf/
│                   └── route.ts   # PDF generation API endpoint
│
├── components/
│   ├── quotation/
│   │   ├── QuotationForm.tsx      # Main form orchestrator
│   │   ├── QuotationHeader.tsx    # Header with logo, folio, date/time
│   │   ├── WorkshopSection.tsx    # Workshop profile (read-only)
│   │   ├── ClientSection.tsx      # Client information fields
│   │   ├── VehicleSection.tsx     # Vehicle information fields
│   │   ├── ServiceSection.tsx     # Service selection checkboxes
│   │   ├── BodyworkSection.tsx    # Dynamic bodywork rows
│   │   ├── PaintSection.tsx       # Dynamic paint rows
│   │   ├── PartsSection.tsx       # Dynamic parts & accessories rows
│   │   ├── TotalSection.tsx       # Total, down payment, balance
│   │   └── QuotationList.tsx      # List view with search
│   │
│   ├── pdf/
│   │   ├── QuotationPDF.tsx       # Main PDF document
│   │   ├── PDFHeader.tsx          # PDF header section
│   │   ├── PDFClientSection.tsx   # Client info in PDF
│   │   ├── PDFVehicleSection.tsx  # Vehicle info in PDF
│   │   ├── PDFItemsTable.tsx      # Items breakdown table
│   │   └── PDFFooter.tsx          # Total summary footer
│   │
│   └── ui/
│       ├── Button.tsx             # Reusable button component
│       ├── Input.tsx              # Form input with label and error
│       ├── Select.tsx             # Dropdown/select component
│       ├── Card.tsx               # Card container
│       ├── Loading.tsx            # Loading spinner
│       └── Modal.tsx              # Modal/dialog component
│
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── constants.ts               # Service types, workshop config
│   ├── utils.ts                   # Utility functions (currency, date formatting)
│   ├── validations.ts             # Zod schemas for validation
│   └── pdf-utils.ts               # PDF generation helpers
│
├── types/
│   ├── quotation.ts               # Quotation-related types
│   └── index.ts                   # Type exports
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Seed data (optional)
│
├── public/
│   └── images/
│       └── workshop-logo.png      # Workshop logo
│
├── config/
│   └── workshop.ts                # Workshop configuration
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Page Designs & Routes

### Route Structure

| Route | Type | Purpose |
|-------|------|---------|
| `/` | Server Component | Quotation list with search |
| `/quotations/new` | Client Component | Create new quotation |
| `/quotations/[id]` | Server Component | View quotation details |
| `/quotations/[id]/edit` | Client Component | Edit existing quotation |
| `/api/quotations/[id]/pdf` | API Route | Generate and download PDF |

### 1. Homepage - Quotation List (`/`)

**Component:** Server Component (fast, SEO-friendly)

**Features:**
- Table/grid view of all quotations
- Client-side search (filters by folio, client name, vehicle)
- Sortable columns
- Action buttons: View, Edit, Delete, Generate PDF
- "Nueva Cotización" button
- Empty state when no quotations exist

**Data Loading:**
```typescript
export default async function HomePage() {
  const quotations = await getQuotations()

  return (
    <div>
      <header>
        <h1>Sistema de Cotización</h1>
        <Link href="/quotations/new">
          <Button>+ Nueva Cotización</Button>
        </Link>
      </header>

      <QuotationList quotations={quotations} />
    </div>
  )
}
```

### 2. New Quotation Page (`/quotations/new`)

**Component:** Client Component (requires form interactivity)

**Sections (top to bottom):**
1. Header: Logo, title, folio (auto-generated on save), date/time
2. Workshop Profile (pre-filled, read-only)
3. Client Information (4 fields)
4. Vehicle Information (6 fields)
5. Service Selection (checkbox grid)
6. Bodywork Section (dynamic rows)
7. Paint Section (dynamic rows)
8. Parts & Accessories Section (dynamic rows)
9. Total Summary (auto-calculated)
10. Action Buttons (Save, Generate PDF)

**Real-time Calculations:**
- Paint item total = quantity × unitPrice
- Section totals = sum of all items in section
- Grand total = bodywork + paint + parts totals
- Remaining balance = total - down payment

### 3. View Quotation Page (`/quotations/[id]`)

**Component:** Server Component

**Features:**
- Read-only view of all quotation data
- Action buttons: Edit, Delete, Generate PDF, Back to List
- Confirmation dialog for delete action

### 4. Edit Quotation Page (`/quotations/[id]/edit`)

**Component:** Client Component

**Features:**
- Identical to New Quotation form
- Pre-populated with existing data
- Folio is read-only (cannot change)
- Update button instead of Save
- Cancel button returns to view page

---

## Component Architecture

### Component Hierarchy

```
QuotationForm (Client Component)
├── QuotationHeader
│   └── Logo, Title, Folio, Date/Time
├── WorkshopSection
│   └── Read-only workshop info from config
├── ClientSection
│   └── 4 input fields (name, phone, email, address)
├── VehicleSection
│   └── 6 input fields (brand, model, year, color, plates, paint code)
├── ServiceSection
│   └── Grid of service checkbox buttons
├── BodyworkSection
│   ├── Dynamic rows (description + cost)
│   └── Add button
├── PaintSection
│   ├── Dynamic rows (part + qty + unit price + total)
│   └── Add button
├── PartsSection
│   ├── Dynamic rows (description + cost)
│   └── Add button
└── TotalSection
    └── Total, Down Payment (input), Remaining Balance
```

### Key Component Patterns

**Dynamic Row Management:**
```typescript
// Uses useFieldArray from React Hook Form
export function BodyworkSection({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bodyworkItems'
  })

  const addItem = () => append({
    id: crypto.randomUUID(),
    description: '',
    cost: 0
  })

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Input {...register(`bodyworkItems.${index}.description`)} />
          <Input {...register(`bodyworkItems.${index}.cost`)} type="number" />
          <Button onClick={() => remove(index)}>×</Button>
        </div>
      ))}
      <Button onClick={addItem}>+ LABOR HOJALATERÍA</Button>
    </div>
  )
}
```

**Real-time Total Calculation:**
```typescript
const bodyworkItems = useWatch({ control, name: 'bodyworkItems' })
const paintItems = useWatch({ control, name: 'paintItems' })
const partItems = useWatch({ control, name: 'partItems' })
const downPayment = useWatch({ control, name: 'downPayment' })

useEffect(() => {
  const bodyworkTotal = bodyworkItems.reduce((sum, item) => sum + Number(item.cost || 0), 0)
  const paintTotal = paintItems.reduce((sum, item) => sum + Number(item.total || 0), 0)
  const partsTotal = partItems.reduce((sum, item) => sum + Number(item.cost || 0), 0)

  const total = bodyworkTotal + paintTotal + partsTotal
  const remaining = total - Number(downPayment || 0)

  setValue('totalAmount', total)
  setValue('remainingBalance', remaining)
}, [bodyworkItems, paintItems, partItems, downPayment])
```

---

## Data Flow & Server Actions

### Server Actions (CRUD Operations)

**File:** `app/quotations/actions.ts`

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { quotationSchema } from '@/lib/validations'

export async function createQuotation(data: QuotationFormData) {
  try {
    const validated = quotationSchema.parse(data)

    const quotation = await prisma.quotation.create({
      data: validated
    })

    revalidatePath('/')
    return { success: true, id: quotation.id, folio: quotation.folio }
  } catch (error) {
    return { success: false, error: 'Error al crear cotización' }
  }
}

export async function updateQuotation(id: string, data: QuotationFormData) {
  try {
    await prisma.quotation.update({
      where: { id },
      data
    })

    revalidatePath('/')
    revalidatePath(`/quotations/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al actualizar cotización' }
  }
}

export async function deleteQuotation(id: string) {
  try {
    await prisma.quotation.delete({ where: { id } })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar cotización' }
  }
}

export async function getQuotation(id: string) {
  return await prisma.quotation.findUnique({ where: { id } })
}

export async function getQuotations() {
  return await prisma.quotation.findMany({
    orderBy: { createdAt: 'desc' }
  })
}
```

### Form Submission Flow

```
1. User fills form and clicks "Guardar"
2. React Hook Form validates data with Zod schema
3. If valid: call Server Action (createQuotation or updateQuotation)
4. Server Action:
   - Validates again on server
   - Saves to PostgreSQL via Prisma
   - Revalidates cached pages
   - Returns success/error
5. Client receives response:
   - Success: Show toast, redirect to homepage
   - Error: Show error toast with message
```

---

## Styling & UI Design

### Design System - Modern Dark Mode

**Color Palette:**

```typescript
// tailwind.config.ts
colors: {
  primary: {
    DEFAULT: '#EF4444',  // Bright red
    hover: '#DC2626',
    light: '#FCA5A5',
  },
  dark: {
    bg: '#0A0A0A',       // Main background
    surface: '#171717',  // Cards
    elevated: '#262626', // Elevated elements
    border: '#404040',   // Borders
  },
  text: {
    primary: '#FAFAFA',
    secondary: '#A3A3A3',
    muted: '#737373',
  },
  accent: {
    yellow: '#FBBF24',   // Remaining balance
    green: '#10B981',
    blue: '#3B82F6',
  }
}
```

**Typography:**
- Font: Inter (Google Fonts)
- Weights: 400, 500, 600, 700, 800

**Key UI Patterns:**

1. **Glassmorphism Cards**
   ```tsx
   className="bg-dark-surface/80 backdrop-blur-xl border border-dark-border/50 rounded-2xl"
   ```

2. **Section Headers with Numbered Badges**
   ```tsx
   <div className="bg-gradient-to-r from-dark-elevated to-dark-surface px-6 py-4">
     <div className="w-8 h-8 rounded-lg bg-primary font-bold">1</div>
     <h3>HOJALATERÍA</h3>
   </div>
   ```

3. **Modern Input Fields**
   ```tsx
   className="bg-dark-elevated border border-dark-border rounded-xl px-4 py-3.5
              text-text-primary focus:border-primary focus:ring-primary/50"
   ```

4. **Glow Effects on Primary Actions**
   ```tsx
   className="bg-gradient-to-r from-primary to-red-600 shadow-glow
              hover:shadow-glow transition-all"
   ```

**Responsive Design:**
- Mobile-first approach
- Grid layouts that stack on mobile
- Breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`

---

## Error Handling & Validation

### Form Validation (Zod Schema)

```typescript
// lib/validations.ts
export const quotationSchema = z.object({
  clientName: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  clientPhone: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos'),
  clientEmail: z.string().email('Email inválido'),
  clientAddress: z.string().min(5, 'Dirección requerida'),

  vehicleBrand: z.string().min(2, 'Marca requerida'),
  vehicleModel: z.string().min(2, 'Modelo requerido'),
  vehicleYear: z.string().min(4, 'Año requerido'),
  vehicleColor: z.string().min(2, 'Color requerido'),
  vehiclePlates: z.string().min(5, 'Placas requeridas'),
  vehiclePaintCode: z.string().optional(),

  services: z.array(z.string()).min(1, 'Selecciona al menos un servicio'),
  customService: z.string().optional(),
  estimatedTime: z.string().min(1, 'Tiempo estimado requerido'),
  piecesToWork: z.number().min(1).int(),

  bodyworkItems: z.array(z.object({
    id: z.string(),
    description: z.string().min(3),
    cost: z.number().min(0)
  })).default([]),

  paintItems: z.array(z.object({
    id: z.string(),
    part: z.string().min(2),
    quantity: z.number().min(1).int(),
    unitPrice: z.number().min(0),
    total: z.number()
  })).default([]),

  partItems: z.array(z.object({
    id: z.string(),
    description: z.string().min(3),
    cost: z.number().min(0)
  })).default([]),

  totalAmount: z.number().min(0),
  downPayment: z.number().min(0),
  remainingBalance: z.number()
})
```

### Error Display Patterns

1. **Inline Field Errors** - Red border + error message below field
2. **Toast Notifications** - Success/error toasts using Sonner library
3. **Loading States** - Spinner overlays during async operations
4. **Empty States** - Friendly message when no quotations exist
5. **Confirmation Dialogs** - Modal for destructive actions (delete)

---

## PDF Generation

### Architecture

```
User clicks "Generar PDF"
  ↓
GET /api/quotations/[id]/pdf
  ↓
Fetch quotation from database
  ↓
Render <QuotationPDF quotation={data} /> with @react-pdf/renderer
  ↓
Convert to PDF buffer
  ↓
Return as downloadable file (Cotizacion-003.pdf)
```

### PDF Structure

```tsx
<Document>
  <Page size="A4">
    <PDFHeader />           {/* Logo, workshop info, folio, date */}
    <PDFClientSection />    {/* Client details */}
    <PDFVehicleSection />   {/* Vehicle details */}
    <PDFServicesSection />  {/* Selected services as badges */}
    <PDFItemsTable />       {/* Bodywork, Paint, Parts breakdown */}
    <PDFFooter />           {/* Total, Down Payment, Balance */}
  </Page>
</Document>
```

**Styling:** Uses `StyleSheet.create()` from @react-pdf/renderer (React Native-style syntax)

**Filename Format:** `Cotizacion-{folio}.pdf` (e.g., `Cotizacion-003.pdf`)

---

## Workshop Configuration

### Configuration File

**File:** `config/workshop.ts`

```typescript
export const workshopConfig = {
  name: 'PREMIUM LAMINADO Y PINTURA',
  subtitle: 'COTIZACIÓN Y PRESUPUESTO',
  manager: 'Roberto Salgado Méndez',
  phone: '3328479652',
  email: 'contacto@premium.com.mx',
  address: 'Calle y Número',
  logo: '/images/workshop-logo.png',

  // Locale settings
  locale: 'es-MX',
  currency: 'MXN',
  timezone: 'America/Mexico_City',
}
```

### Environment Variables

```bash
# .env.example
DATABASE_URL="postgresql://user:password@localhost:5432/quotations"
NODE_ENV="development"

# Optional: Future authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
```

---

## Future Enhancements

### Phase 2: Authentication & Multi-User

**Features:**
- NextAuth integration
- Google OAuth login
- Facebook OAuth login
- User sessions
- Protected routes

**Database Changes:**
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  quotations    Quotation[]
  createdAt     DateTime  @default(now())
}

enum Role {
  ADMIN
  USER
}

// Add to Quotation model:
model Quotation {
  // ...existing fields
  userId     String
  user       User   @relation(fields: [userId], references: [id])
}
```

### Phase 3: Admin Panel

**Features:**
- User management (view, edit, delete users)
- Workshop settings UI (edit logo, name, contact info)
- View all quotations (not just own)
- Analytics dashboard (quotations by month, revenue, etc.)
- Export quotations to Excel/CSV

### Phase 4: Advanced Features

**Potential additions:**
- Email quotations to clients
- WhatsApp integration
- Quotation templates
- Multi-currency support
- Invoice generation (post-work completion)
- Before/after photo uploads
- Digital signatures
- Payment tracking
- Inventory management for parts

---

## Testing Strategy

### Unit Tests
- Form validation functions
- Currency/date formatting utilities
- Total calculation logic

### Integration Tests
- Server Actions (CRUD operations)
- PDF generation
- Form submission flow

### E2E Tests
- Create quotation flow
- Edit quotation flow
- Delete quotation flow
- PDF download flow

**Testing Libraries:** Vitest for unit/integration, Playwright for E2E

---

## Success Criteria

The MVP will be considered successful when:

1. ✅ Users can create quotations with all required sections
2. ✅ Totals calculate correctly in real-time
3. ✅ PDF generation produces professional, accurate documents
4. ✅ Quotation list loads quickly and search works
5. ✅ Edit functionality preserves all data correctly
6. ✅ UI is responsive on desktop, tablet, and mobile
7. ✅ Application loads in under 2 seconds on average
8. ✅ No critical bugs in core workflows

---

## Implementation Timeline Estimate

**Note:** Timeline is approximate and assumes single developer.

- **Week 1:** Setup, database schema, core infrastructure
- **Week 2:** Quotation form components and validation
- **Week 3:** List view, view/edit pages, Server Actions
- **Week 4:** PDF generation, styling polish, testing
- **Week 5:** Bug fixes, performance optimization, deployment

**Total:** ~5 weeks for MVP

---

## Appendix

### Spanish UI Text Constants

```typescript
export const UI_TEXT = {
  buttons: {
    save: 'Guardar Cotización',
    update: 'Actualizar Cotización',
    generatePDF: 'Generar Cotización Profesional',
    addBodywork: '+ LABOR HOJALATERÍA',
    addPaint: '+ PIEZA PINTURA',
    addPart: '+ AGREGAR REPUESTO',
    newQuotation: '+ Nueva Cotización',
    edit: 'Editar',
    delete: 'Eliminar',
    view: 'Ver',
    cancel: 'Cancelar',
    confirm: 'Confirmar'
  },
  sections: {
    workshop: 'Perfil del Taller',
    client: 'Datos del Cliente',
    vehicle: 'Datos del Vehículo',
    services: 'Tipo de Servicio y Daño',
    bodywork: 'Hojalatería',
    paint: 'Pintura',
    parts: 'Repuestos y Accesorios'
  },
  labels: {
    folio: 'FOLIO',
    total: 'TOTAL PRESUPUESTO',
    downPayment: 'ANTICIPO',
    balance: 'SALDO PENDIENTE'
  }
}

export const SERVICES = [
  { key: 'collision', label: 'Golpe / Colisión' },
  { key: 'fullPaint', label: 'Baño de Pintura' },
  { key: 'panelPaint', label: 'Repintado (Piezas)' },
  { key: 'pdr', label: 'Varillaje (Granizo)' },
  { key: 'bumperRepair', label: 'Reparación Fascias' },
  { key: 'polishing', label: 'Pulido / Detailing' },
  { key: 'headlightRestoration', label: 'Restauración Faros' },
  { key: 'frameRepair', label: 'Banco / Chasis' },
  { key: 'glassReplacement', label: 'Cambio de Cristal' },
  { key: 'other', label: 'OTRO SERVICIO...' }
]

export const ESTIMATED_TIMES = [
  '1 Día Hábil',
  '2 a 3 Días Hábiles',
  '1 Semana',
  '2 Semanas',
  'Más de 2 Semanas'
]
```

### Utility Functions

```typescript
// lib/utils.ts

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date).toUpperCase()
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export function padFolio(folio: number): string {
  return folio.toString().padStart(3, '0')
}
```

---

**End of Design Specification**
