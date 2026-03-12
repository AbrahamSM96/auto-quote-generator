# 🚗 Automotive Workshop Quotation System

A modern, professional quotation management system for automotive workshops built with **Next.js 16**, **TypeScript**, **TailwindCSS v4**, and **PostgreSQL**.

## ✨ Features

- ✅ **Create Professional Quotations** - Comprehensive form with client, vehicle, and service details
- ✅ **Dynamic Pricing Sections** - Bodywork, Paint, Parts & Accessories with real-time calculations
- ✅ **PDF Generation** - Professional PDF quotations ready to send to clients
- ✅ **Search & Filter** - Quick search by client, vehicle, or folio number
- ✅ **Modern Dark Mode UI** - Industrial precision aesthetic with JetBrains Mono & Manrope fonts
- ✅ **Form Validation** - Comprehensive validation with Zod
- ✅ **Spanish Language** - Fully localized for Mexican market
- ✅ **Mexican Peso Formatting** - Proper currency formatting

## 🎨 Design

**Aesthetic**: Industrial Precision - combining technical accuracy with modern sophistication

**Typography**:
- **Technical/Numbers**: JetBrains Mono (for prices, folios, data)
- **UI/Body**: Manrope (clean, geometric, professional)

**Color Palette**:
- Primary: Bright Red (#EF4444)
- Background: Almost Black (#0A0A0A)
- Surfaces: Dark Gray (#171717, #262626)
- Accents: Yellow (#FBBF24) for remaining balance

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **PostgreSQL** 14+

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Database

Create a PostgreSQL database:

```bash
createdb auto_quotations
```

Update your `.env` file with your database credentials (already configured):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auto_quotations?schema=public"
```

### 3. Run Database Migrations

```bash
bunx prisma migrate dev --name init
```

This will create the quotations table and generate the Prisma client.

### 4. Start Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
auto-quote-generator/
├── app/
│   ├── page.tsx                      # Homepage (quotation list)
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles & design system
│   ├── quotations/
│   │   ├── new/page.tsx              # Create quotation
│   │   ├── [id]/page.tsx             # View quotation
│   │   ├── [id]/edit/page.tsx        # Edit quotation
│   │   └── actions.ts                # Server Actions (CRUD)
│   └── api/
│       └── quotations/[id]/pdf/      # PDF generation endpoint
│
├── components/
│   ├── quotation/
│   │   ├── QuotationForm.tsx         # Main quotation form
│   │   ├── QuotationList.tsx         # List with search
│   │   └── QuotationView.tsx         # Read-only view
│   └── ui/                           # Reusable UI components
│
├── lib/
│   ├── prisma.ts                     # Prisma client
│   ├── constants.ts                  # Services, UI text, etc.
│   ├── utils.ts                      # Utility functions
│   └── validations.ts                # Zod schemas
│
├── types/                            # TypeScript types
├── config/                           # Workshop configuration
└── prisma/
    └── schema.prisma                 # Database schema
```

## 🔧 Configuration

### Workshop Settings

Edit `config/workshop.ts` to customize your workshop information:

```typescript
export const workshopConfig = {
  name: 'YOUR WORKSHOP NAME',
  subtitle: 'COTIZACIÓN Y PRESUPUESTO',
  manager: 'Manager Name',
  phone: '1234567890',
  email: 'contact@workshop.com',
  address: 'Your Address',
  logo: '/images/workshop-logo.png',
}
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework (App Router) |
| **TypeScript** | Type safety |
| **TailwindCSS v4** | Styling framework |
| **PostgreSQL** | Relational database |
| **Prisma** | ORM for database access |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |
| **@react-pdf/renderer** | PDF generation |
| **Sonner** | Toast notifications |

## 📝 Development Notes

- **Linting**: Uses `oxlint` instead of Prettier
- **Fonts**: JetBrains Mono and Manrope loaded from Google Fonts
- **Design System**: All colors and styles defined in `app/globals.css`
- **Server Actions**: All database operations use Next.js Server Actions

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
