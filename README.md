# Non-Conformity Management System

> [!IMPORTANT]
> This application in an early moment of development

A comprehensive web application for tracking and managing non-conformities in software development projects. Built with Next.js, TypeScript, and PostgreSQL.

## 🚀 Features

- **Project Management**: Create and manage projects with sprint-based development
- **Non-Conformity Tracking**: Track issues, bugs, and quality concerns with detailed status management
- **User Roles**: Support for Admin, Developer, and Tester roles
- **Media Management**: Upload and attach files to non-conformities and comments
- **Real-time Updates**: Live status tracking and state change history
- **Authentication**: Secure user authentication with session management
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **React Hook Form** - Form management with Zod validation
- **TanStack Table** - Data tables with sorting and filtering
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend & Database

- **Prisma** - Database ORM and migrations
- **PostgreSQL** - Primary database
- **Better Auth** - Authentication solution
- **AWS S3 / Vercel Blob** - File storage

### Development Tools

- **ESLint** - Code linting
- **Bun** - Package manager and runtime

## 📋 Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- AWS S3 bucket or Vercel Blob storage (for file uploads)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd my-app
```

### 2. Install dependencies

```bash
bun install
# or
npm install
```

### 3. Environment setup

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# Authentication
AUTH_SECRET="your-secret-key"
AUTH_URL="http://localhost:3000"

# File Storage (choose one)
# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="your-region"
AWS_S3_BUCKET="your-bucket-name"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your-blob-token"
```

### 4. Database setup

```bash
# Generate Prisma client
bunx prisma generate

# Run database migrations
bunx prisma migrate dev

# Seed the database (optional)
bun run db:seed
```

### 5. Start the development server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

The application uses the following main entities:

- **Users**: Authentication and role management (Admin, Developer, Tester)
- **Projects**: Development projects with descriptions
- **Sprints**: Time-boxed development periods
- **Non-Conformities**: Issues, bugs, and quality concerns with:
    - Status tracking (NEW, ASSIGNED, IN_PROGRESS, PENDING_QA, CLOSED, REOPENED)
    - Priority levels (CRITICAL, HIGH, MEDIUM, LOW)
    - Type categorization
    - Assignment and creation tracking
- **Comments**: Discussion threads on non-conformities
- **Media**: File attachments for non-conformities and comments
- **State Changes**: Audit trail for status transitions

## 🔧 Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun run db:seed` - Seed database with initial data

## 🔐 Authentication

The application uses Better Auth for secure authentication with:

- Email/password authentication
- Session management
- Role-based access control
- Protected API routes

## 📁 File Storage

Files are stored using either:

- **AWS S3** - Scalable cloud storage
- **Vercel Blob** - Simple file storage for Vercel deployments

## 🎨 UI Components

Built with modern design principles using:

- **shadcn/ui** - Accessible, customizable components
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Consistent iconography
- **React Hook Form** - Form validation and management

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the database schema for data relationships

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
