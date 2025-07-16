# 🏥 Medical Management System

A comprehensive full-stack application for managing patient medications and treatment schedules. Built with **NestJS** backend and **Next.js** frontend, featuring real-time treatment tracking and intelligent healthcare insights.

## 🚀 Features

### 📊 **Patient Care Dashboard**
- **Real-time Treatment Tracking**: Monitor patient medication schedules with automatic remaining days calculation
- **Health Score Analytics**: Intelligent scoring system based on treatment compliance and urgency
- **Visual Progress Indicators**: Beautiful progress rings and status badges for quick assessment
- **Smart Filtering**: Filter patients by status (all, active, urgent, stable)
- **Search Functionality**: Find patients quickly with real-time search

### 👥 **Patient Management**
- **Complete CRUD Operations**: Create, read, update, and delete patients
- **Age Calculation**: Automatic age calculation from date of birth
- **Treatment History**: View all medication assignments for each patient
- **Export Capabilities**: Download patient data as CSV files
- **Context Menus**: Quick actions via three-dot dropdown menus

### 💊 **Medication Management**
- **Medication Catalog**: Comprehensive medication database with dosage and frequency
- **Treatment Assignment**: Assign medications to patients with start dates and duration
- **Remaining Days Calculation**: Automatic calculation of treatment progress
- **Status Indicators**: Color-coded urgency levels (urgent, active, stable)

### 🔧 **Advanced Features**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Automatic data refresh and synchronization
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Type Safety**: Full TypeScript implementation for better development experience
- **Database Integrity**: Proper foreign key constraints and cascade deletion

## 🛠️ Technology Stack

### **Backend (NestJS - Port 8080)**
- **Framework**: NestJS v11 with TypeScript
- **Database**: SQLite with TypeORM
- **Validation**: Custom DTOs with comprehensive input validation
- **Architecture**: Modular design with separate modules for each entity
- **Security**: Helmet middleware, CORS configuration
- **Testing**: Unit tests for calculation logic

### **Frontend (Next.js - Port 3000)**
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Shadcn/ui components with custom styling
- **State Management**: React hooks with proper state management
- **Data Fetching**: Built-in fetch API with error handling
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
interview-challenge/
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── main.ts         # App entry point (port 8080)
│   │   ├── app.module.ts   # Root module with TypeORM config
│   │   ├── patient/        # Patient module
│   │   │   ├── patient.entity.ts
│   │   │   ├── patient.service.ts
│   │   │   ├── patient.controller.ts
│   │   │   ├── patient.module.ts
│   │   │   └── dto/
│   │   ├── medication/     # Medication module
│   │   │   ├── medication.entity.ts
│   │   │   ├── medication.service.ts
│   │   │   ├── medication.controller.ts
│   │   │   ├── medication.module.ts
│   │   │   └── dto/
│   │   └── assignment/     # Assignment module
│   │       ├── assignment.entity.ts
│   │       ├── assignment.service.ts
│   │       ├── assignment.controller.ts
│   │       ├── assignment.module.ts
│   │       ├── assignment.service.spec.ts
│   │       └── dto/
│   ├── database.sqlite     # SQLite database file
│   └── package.json
└── frontend/               # Next.js Frontend
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx        # Main dashboard
    │   ├── patients/       # Patient management pages
    │   ├── medications/    # Medication management pages
    │   ├── assignments/    # Assignment management pages
    │   └── analytics/      # Analytics page
    ├── components/
    │   └── ui/            # Reusable UI components
    ├── lib/
    │   ├── api.ts         # API client functions
    │   ├── constants.ts   # Global constants
    │   └── utils.ts       # Utility functions
    └── types/
        └── index.ts       # TypeScript type definitions
```

## 🗄️ Database Schema

### **Entities & Relationships**
```
Patient (1) ↔ (N) Assignment (N) ↔ (1) Medication

Patient:
- id: number (PK, auto-generated)
- name: string
- dateOfBirth: Date
- assignments: Relation<Assignment[]>

Medication:
- id: number (PK, auto-generated)
- name: string
- dosage: string (e.g., "500mg")
- frequency: string (e.g., "twice daily")
- assignments: Relation<Assignment[]>

Assignment:
- id: number (PK, auto-generated)
- patientId: number (FK to Patient)
- medicationId: number (FK to Medication)
- startDate: Date
- days: number (treatment duration)
- patient: Patient relation
- medication: Medication relation
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd interview-challenge
```

### **2. Backend Setup**
```bash
cd backend
npm install
npm run start:dev
```
The backend will be available at `http://localhost:8080`

### **3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`

### **4. Database**
The SQLite database is automatically created at `backend/database.sqlite` on first run.

## 📡 API Endpoints

### **Patient Endpoints (`/patients`)**
- `GET /patients` - List all patients with assignments
- `GET /patients/:id` - Get specific patient
- `POST /patients` - Create patient
- `PATCH /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient (with cascade deletion)

### **Medication Endpoints (`/medications`)**
- `GET /medications` - List all medications
- `GET /medications/:id` - Get specific medication
- `POST /medications` - Create medication
- `PATCH /medications/:id` - Update medication
- `DELETE /medications/:id` - Delete medication (with cascade deletion)

### **Assignment Endpoints (`/assignments`)**
- `GET /assignments` - List all assignments
- `GET /assignments/:id` - Get specific assignment
- `POST /assignments` - Create assignment
- `PATCH /assignments/:id` - Update assignment
- `DELETE /assignments/:id` - Delete assignment
- `GET /assignments/remaining-days` - All assignments with calculated remaining days
- `GET /assignments/:id/remaining-days` - Specific assignment with remaining days

## 🎯 Key Features Explained

### **Remaining Days Calculation**
```typescript
calculateRemainingDays(startDate: Date, totalDays: number): number {
  const today = new Date();
  const start = new Date(startDate);
  
  // Reset time to avoid timezone issues
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  
  const elapsedDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = totalDays - elapsedDays;
  
  return Math.max(0, remainingDays);
}
```

### **Health Score Algorithm**
- **Score Range**: 20-95 points
- **Factors**: Urgent treatments (≤3 days), active treatments, compliance rate
- **Trends**: Up, down, or stable based on treatment urgency

### **Status Classification**
- **Urgent**: Treatments with ≤3 days remaining (red indicators)
- **Active**: Treatments with >3 days remaining (green indicators)
- **Stable**: No active treatments (blue indicators)

## 🧪 Testing

### **Backend Tests**
```bash
cd backend
npm test                    # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage
```

### **Frontend Tests**
```bash
cd frontend
npm test                   # Run tests (if configured)
```

## 🔧 Development Commands

### **Backend**
```bash
cd backend
npm run start:dev          # Development server (auto-reload)
npm run build              # Build for production
npm run start:prod         # Production server
npm run format             # Format code with Prettier
npm run lint               # Run ESLint
```

### **Frontend**
```bash
cd frontend
npm run dev                # Development server
npm run build              # Build for production
npm start                  # Production server
npm run lint               # Run ESLint
```

## 🎨 UI Components

### **Custom Components**
- **ProgressRing**: Circular progress indicators
- **HealthScore**: Health scoring with trend indicators
- **PatientAvatar**: Dynamic avatars with initials
- **PatientDropdownMenu**: Context menus for patient actions

### **Status Indicators**
- **Color-coded badges**: Red (urgent), Orange (warning), Green (stable)
- **Progress bars**: Visual treatment progress
- **Icons**: Intuitive iconography for different actions

## 🔒 Security Features

- **Input Validation**: Comprehensive validation on all endpoints
- **SQL Injection Protection**: TypeORM parameterized queries
- **CORS Configuration**: Properly configured for development
- **Security Headers**: Helmet middleware for security headers
- **Error Handling**: Proper error responses without sensitive data exposure

## 🚀 Deployment

### **Backend Deployment**
1. Build the application: `npm run build`
2. Set environment variables for production
3. Deploy to your preferred hosting service

### **Frontend Deployment**
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting service
3. Update API URL constants for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Check the documentation in each module
- Review the API endpoints documentation
- Check the console for error messages
- Ensure both backend and frontend are running

## 🎉 Acknowledgments

- Built with NestJS and Next.js
- Styled with Tailwind CSS
- Icons from Heroicons
- UI components inspired by modern design systems

---

**Happy coding! 🚀**

