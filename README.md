# 🥬 ApnaCart - Next.js Vegetable Delivery Service

A modern, full-stack vegetable delivery service built with **Next.js 14**, **Prisma ORM**, and **SQLite (local) / PostgreSQL (production)**. Features a customer-facing cart system and an admin panel for managing vegetables.

## ✨ Features

### 🛒 Customer Experience
- **Cart Selection**: Choose between Small Cart (4.5kg) and Family Cart (7kg)
- **Dynamic Vegetable Display**: Real-time vegetable inventory from database
- **Smart Weight Management**: Add/remove vegetables until cart weight is met
- **WhatsApp Integration**: Generate pre-filled WhatsApp messages for orders
- **Responsive Design**: Mobile-first UI with Tailwind CSS

### 🔧 Admin Panel
- **Vegetable Management**: Add, view, and delete vegetables
- **Database Integration**: Persistent storage with Prisma + SQLite
- **Simple Interface**: Clean form with name and weight unit fields
- **Real-time Updates**: Instant UI updates after database changes

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (local) with Prisma ORM, PostgreSQL on RDS (production)
- **API**: Next.js API Routes
- **State Management**: React hooks + SWR for data fetching

## 📁 Project Structure

```
ApnaCart/
├── app/                          # Next.js 14 App Router
│   ├── api/                     # API Routes
│   │   └── vegetables/          # Vegetable CRUD endpoints
│   ├── admin/                   # Admin panel page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # React components
│   ├── AdminHeader.tsx          # Admin navigation
│   ├── AddVegetableForm.tsx     # Add vegetable form
│   ├── CartSelection.tsx        # Cart type selection
│   ├── VegetableCard.tsx        # Individual vegetable display
│   └── VegetablesList.tsx       # Admin vegetable list
├── prisma/                      # Database configuration
│   └── schema.prisma            # Prisma schema
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
└── tsconfig.json                # TypeScript configuration
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Local development (SQLite): create/update schema & run app
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

```prisma
model Vegetable {
  id          Int      @id @default(autoincrement())
  name        String
  weightUnit  String   // "250g" or "500g"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔌 API Endpoints

### Vegetables API
- `GET /api/vegetables` - Fetch all vegetables
- `POST /api/vegetables` - Add new vegetable
- `DELETE /api/vegetables/[id]` - Delete vegetable by ID

### Request/Response Examples

#### Add Vegetable
```bash
POST /api/vegetables
Content-Type: application/json

{
  "name": "Fresh Tomatoes",
  "weightUnit": "250g"
}
```

#### Get Vegetables
```bash
GET /api/vegetables

Response:
{
  "success": true,
  "vegetables": [
    {
      "id": 1,
      "name": "Fresh Tomatoes",
      "weightUnit": "250g",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## 🎯 Usage Guide

### For Customers
1. **Select Cart Type**: Choose Small (4.5kg) or Family (7kg) cart
2. **Add Vegetables**: Click + button to add vegetables to cart
3. **Monitor Weight**: Watch the progress bar fill up
4. **Place Order**: Once weight requirement is met, click "Confirm Order via WhatsApp"

### For Admins
1. **Access Admin Panel**: Navigate to `/admin`
2. **Add Vegetables**: Fill out the form with name and weight unit
3. **Manage Inventory**: View, refresh, and delete vegetables as needed
4. **Real-time Updates**: Changes appear instantly in both admin and customer views

## 🔒 Security Features

- **Input Validation**: Server-side validation for all API endpoints
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **Type Safety**: Full TypeScript coverage for type safety

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tailwind CSS**: Utility-first CSS framework
- **Flexible Grid**: Responsive grid layouts
- **Touch-Friendly**: Optimized button sizes and interactions

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### AWS Amplify + RDS (Production)

- Set `DATABASE_URL` in Amplify environment variables (Amplify Console → App settings → Environment variables).
- `DATABASE_URL` should point to your RDS PostgreSQL instance, for example:
  `postgresql://admin:yourpassword@yourdb-endpoint.rds.amazonaws.com:5432/apnacart`
- Build runs `npx prisma generate` and `npm run build`. Deployment runs `npm run migrate:deploy` to apply migrations on RDS.
- Amplify build settings are configured in `amplify.yml`.

### Other Platforms
- **Netlify**: Build command: `npm run build`
- **Railway**: Automatic deployment from GitHub
- **DigitalOcean App Platform**: Supports Next.js out of the box

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Generate Prisma client and build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run migrate:deploy # Apply migrations in production (RDS)
npm run db:studio    # Open Prisma Studio
```

## 🏗️ Environment Configuration

### Local Development

Create `.env.local` with SQLite:

```
DATABASE_URL="file:./prisma/dev.db"
```

The app will use SQLite locally via Prisma.

### Production (AWS Amplify + RDS)

- Do not commit `.env` with secrets. Set `DATABASE_URL` in Amplify Console.
- Example value:

```
DATABASE_URL="postgresql://3c08c8b05f6cad3891ac7b00d3db8556e8d9901ab2b32b7bca5ff0d92db5726e:sk_I5Ymsz0k9ord9BxvKeK0u@db.prisma.io:5432/postgres?sslmode=require"
```

Next.js reads `DATABASE_URL` at build/runtime on the server automatically.

## 🧭 Migration Workflow

- Local dev (SQLite):
  - Edit `prisma/schema.prisma`
  - Create a migration and update local DB: `npx prisma migrate dev`

  datasource db {
  provider = "postgresql"
  url      = "postgres://3c08c8b05f6cad3891ac7b00d3db8556e8d9901ab2b32b7bca5ff0d92db5726e:sk_I5Ymsz0k9ord9BxvKeK0u@db.prisma.io:5432/postgres?sslmode=require"
"
}


- Production (RDS via Amplify):
  - Commit and push
  - Amplify runs `npm run migrate:deploy` to apply pending migrations on RDS

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure SQLite file exists: `prisma/dev.db`
   - Run `npm run db:generate` and `npm run db:push`

2. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **TypeScript Errors**
   - Run `npm run db:generate` to update Prisma types
   - Check `tsconfig.json` path mappings

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- **Issues**: Create a GitHub issue
- **Documentation**: Check the code comments
- **Community**: Join our discussions

---

**Built with ❤️ using Next.js, Prisma, and Tailwind CSS**
