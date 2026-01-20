# PSP.EMU - PSP Game Emulator Web Application

## Overview

PSP.EMU is a web-based PSP game emulator that allows users to manage and play PSP games directly in the browser. The application provides a game library interface where users can add games via URL (ISO, CSO, or PBP files) and play them using EmulatorJS. The project follows a full-stack TypeScript architecture with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom gaming theme (dark mode, electric blue/pink accents)
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for page transitions
- **Build Tool**: Vite with React plugin
- **Typography**: Custom fonts - Orbitron (display) and Rajdhani (body) for gaming aesthetic

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Pattern**: RESTful API with typed routes defined in shared/routes.ts
- **Validation**: Zod schemas for request/response validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: shared/schema.ts using Drizzle table definitions
- **Migrations**: Drizzle Kit with migrations output to ./migrations
- **Object Storage**: Google Cloud Storage integration for file uploads via Replit's object storage service

### Key Design Patterns
- **Shared Types**: The `shared/` directory contains schema definitions and route contracts used by both frontend and backend
- **Type-Safe API**: Route definitions include Zod schemas for input validation and response types
- **Storage Abstraction**: DatabaseStorage class implements IStorage interface for data access
- **Presigned URL Uploads**: File uploads use a two-step flow - request presigned URL, then upload directly to storage

### Emulation
- **Emulator**: EmulatorJS CDN-hosted PSP emulator (loaded dynamically)
- **Game Formats**: Supports ISO, CSO, and PBP file formats via URL

## External Dependencies

### Database
- PostgreSQL database (provisioned via Replit, connection string in DATABASE_URL)
- Drizzle ORM for database operations
- connect-pg-simple for session storage

### Cloud Storage
- Google Cloud Storage via @google-cloud/storage
- Replit sidecar endpoint at http://127.0.0.1:1106 for credential management
- Uppy for file upload UI with AWS S3-compatible presigned URLs

### Third-Party Services
- EmulatorJS CDN (https://cdn.emulatorjs.org/stable/) for PSP emulation
- Google Fonts for Orbitron and Rajdhani typefaces
- Archive.org for hosting game ROM files (seeded example)

### Key NPM Dependencies
- @tanstack/react-query: Server state management
- framer-motion: Animation library
- zod: Runtime type validation
- drizzle-orm/drizzle-kit: Database ORM and migrations
- wouter: Client-side routing
- shadcn/ui components: Full suite of Radix-based UI primitives