# TaskFlow — Task & Project Management System

TaskFlow is a full-stack task and project management web application designed to help users organize projects, manage tasks, track progress, and manage their account settings from a centralized dashboard.

## Live Demo

**Production:** https://taskflow-dsp8.vercel.app/

## Overview

TaskFlow provides an authenticated workspace where users can create and manage projects and tasks while keeping their data stored in a PostgreSQL database.

The application includes authentication, project management, task management, dashboard statistics, notifications, profile settings, password management, and session management.

## Features

### Authentication & Account Management

* User registration
* User login and logout
* Forgot password and password reset flow
* Protected dashboard routes
* Profile management
* Change password
* Session management
* Revoke other active sessions

### Dashboard

* Overview of projects and tasks
* Project and task statistics
* Recent activity
* Current user information
* Notification access
* Progress tracking

### Project Management

* Create projects
* Edit projects
* Delete projects
* View project details
* Project status management
* Project progress tracking
* Project search and filtering
* Project-related task management

### Task Management

* Create tasks
* Edit tasks
* Delete tasks
* Task descriptions
* Task priorities
* Task status management
* Due dates
* Task search and filtering
* Persistent task data

### Notifications & Preferences

* Notification center
* Task notification preferences
* Project notification preferences
* Email notification preference
* User-configurable notification settings

### Data Persistence

All application data is stored in PostgreSQL through Prisma ORM.

Changes made in the application persist after refreshing the page and are available from the deployed production environment.

## Technology Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Next.js App Router

### Backend

* Next.js API Routes
* TypeScript
* Prisma ORM
* PostgreSQL

### Authentication

* Custom session-based authentication
* Secure session cookies
* Protected application routes

### Deployment

* Vercel
* PostgreSQL
* Prisma database migrations

## Database

TaskFlow uses PostgreSQL as its relational database and Prisma ORM for database access and migrations.

The main entities include:

* Users
* Projects
* Tasks
* Sessions

Project and task statuses are stored using structured database enums, while user preferences and session information are stored alongside account data.

## Project Structure

```text
taskflow-app/
│
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── forgot-password/
│   ├── login/
│   ├── register/
│   └── reset-password/
│
├── components/
│   ├── auth/
│   ├── projects/
│   ├── tasks/
│   └── setting/
│
├── lib/
│   ├── auth/
│   ├── prisma/
│   └── ...
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│
├── .env
├── package.json
├── prisma.config.ts
└── next.config.ts
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/muhammadsalmankhan1010-tech/taskflow.git
```

### 2. Navigate to the project

```bash
cd taskflow
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a local environment file and configure the required PostgreSQL database connection.

Example:

```env
DATABASE_URL="your-postgresql-connection-string"
```

Do not commit real database credentials or other sensitive environment variables to GitHub.

### 5. Apply database migrations

```bash
npx prisma migrate deploy
```

For local development, Prisma migrations can also be created using:

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

TaskFlow runs Prisma migrations automatically before the Next.js production build:

```bash
npm run build
```

The build process runs:

```text
prisma migrate deploy
        ↓
next build
```

This allows production database migrations to be applied during deployment.

## Production Deployment

The application is deployed using Vercel.

Production deployment flow:

```text
GitHub
   ↓
Vercel
   ↓
Prisma Migration
   ↓
Next.js Production Build
   ↓
Live TaskFlow Application
```

## Security

* Authentication-protected dashboard
* Session-based access control
* User-specific project and task data
* Protected API operations
* Environment variables for sensitive database configuration
* Database credentials excluded from source control

## Project Purpose

TaskFlow was developed as a full-stack software engineering project to demonstrate practical implementation of:

* Modern web application development
* Frontend development
* Backend API development
* Database design
* Authentication and authorization
* CRUD operations
* Session management
* API integration
* Responsive user interfaces
* Database migrations
* Cloud deployment

## Author

**Muhammad Salman**

Software Engineering
SZABIST University

## Links

**Live Application:**
https://taskflow-dsp8.vercel.app/

**GitHub Repository:**
https://github.com/muhammadsalmankhan1010-tech/taskflow
