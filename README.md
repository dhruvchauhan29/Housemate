# HouseMate

A comprehensive Angular v19 home services platform connecting customers with verified service experts.

## 📌 Project Overview

**Program:** HASHEDIN UNIVERSITY (HUS)  
**Track:** SDE 26.1.1 – Angular  
**Assignment:** Final Angular Assignment  
**Milestone:** 1

## 🚀 Features Implemented (Milestone 1)

### Landing Page (Unauthenticated)
- ✅ Header with HouseMate logo
- ✅ Customer and Expert login buttons
- ✅ Hero section with title and service categories
- ✅ CTAs: "Book Service" and "Become an Expert"
- ✅ "Why Choose HouseMate" section with 4 feature cards:
  - Verified Experts
  - Fast Service
  - Quality Assurance
  - Expert Support
- ✅ Footer section
- ✅ Responsive design

### Authentication System
#### Customer Features
- ✅ Customer registration with validation
- ✅ Customer login with email/password
- ✅ Customer dashboard with profile information
- ✅ Session management with local storage

#### Expert Features
- ✅ Multi-step expert registration (3 steps):
  - Step 1: Personal Details
  - Step 2: Professional Information (Service Category, Experience)
  - Step 3: ID Proof Upload (JPG/PNG, max 5MB)
- ✅ Expert login with email/password
- ✅ Expert dashboard with:
  - Profile summary
  - Status section (Account Status, Verification, Bookings, Jobs)
  - Quick actions menu

### Technical Implementation
- ✅ Angular v19 with TypeScript
- ✅ Reactive Forms with validation
- ✅ Role-based routing (CUSTOMER/EXPERT)
- ✅ Route guards (AuthGuard, RoleGuard)
- ✅ Mock API with JSON Server
- ✅ HttpClient for API communication
- ✅ SCSS styling
- ✅ Responsive layout (desktop + mobile)
- ✅ Session/local storage management
- ✅ Logout functionality

## 🛠️ Technologies Used

- **Angular:** v19.2.0
- **TypeScript:** v5.7.2
- **Angular Material:** v19.2.19
- **JSON Server:** v1.0.0-beta.5
- **RxJS:** v7.8.0
- **SCSS:** For styling

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhruvchauhan29/Housemate.git
   cd Housemate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the JSON Server (Mock API)**
   ```bash
   npm run api
   ```
   This will start the mock API server on `http://localhost:3000`

4. **Start the Angular development server** (in a new terminal)
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`

## 🎮 Demo Credentials

### Customer Login
- **Email:** john@example.com
- **Password:** password

### Expert Login
- **Email:** jane@example.com
- **Password:** password

## 📁 Project Structure

```
Housemate/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── landing-page/
│   │   │   ├── customer-login/
│   │   │   ├── customer-registration/
│   │   │   ├── customer-dashboard/
│   │   │   ├── expert-login/
│   │   │   ├── expert-registration/
│   │   │   └── expert-dashboard/
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── styles.scss
│   └── index.html
├── db.json (Mock API database)
├── package.json
└── README.md
```

## 🔐 Authentication Flow

### Customer Registration Flow
1. User navigates to `/customer/register`
2. Fills in required fields (Name, Age, Address, Mobile, Email, Password)
3. On successful registration, redirects to Customer Dashboard

### Expert Registration Flow
1. User navigates to `/expert/register`
2. **Step 1:** Personal details (Name, Age, Address, Mobile, Email, Password)
3. **Step 2:** Professional info (Service Category, Experience)
4. **Step 3:** ID Proof upload (JPG/PNG only, max 5MB)
5. On successful registration, redirects to Expert Dashboard

### Login Flow
1. User logs in with email and password
2. Backend validates credentials
3. On success:
   - Store mock JWT token in local storage
   - Store user details in local storage
   - Redirect to appropriate dashboard based on role

### Logout Flow
1. User clicks logout button
2. Clear local storage (token and user data)
3. Redirect to landing page

## 🛡️ Route Guards

### AuthGuard
Protects authenticated routes. Redirects to landing page if user is not authenticated.

### RoleGuard
Ensures users can only access routes for their specific role (CUSTOMER or EXPERT).

## 🎨 Styling

The application uses a custom SCSS design system with:
- Consistent color palette (primary: #1e3a5f)
- Responsive grid layouts
- Card-based UI components
- Form styling with validation states
- Button variants (primary, secondary, link)

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🚫 Out of Scope (Future Milestones)

- Booking flow
- Payment integration
- OTP verification logic
- Coupons system
- Rating and review system
- Advanced search and filters

## 🔍 Available Scripts

- `npm start` - Start Angular development server
- `npm run build` - Build the project for production
- `npm run api` - Start JSON Server (Mock API)
- `npm test` - Run unit tests

## 📸 Screenshots

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/95f2c26f-2527-440c-8913-cc6478581d21)

### Customer Login
![Customer Login](https://github.com/user-attachments/assets/56170a16-3019-436b-954d-102264efa1a6)

### Customer Registration
![Customer Registration](https://github.com/user-attachments/assets/4282e013-0264-4ef2-9d1c-d0433744fe77)

### Expert Registration (Multi-step)
![Expert Registration](https://github.com/user-attachments/assets/3165a1a0-0903-473a-99f6-34878df45351)

### Customer Dashboard
![Customer Dashboard](https://github.com/user-attachments/assets/5b2bac8b-9876-4d27-b142-177a0b68f00c)

### Expert Dashboard
![Expert Dashboard](https://github.com/user-attachments/assets/6f993199-6d5d-4d48-85cd-dd7789a977b0)

## 🐛 Known Issues

None at this time.

## 📝 Development Notes

- Images are commented with HTML placeholders as per requirements
- All forms use Angular Reactive Forms with proper validation
- Mock API uses JSON Server for rapid development
- Authentication uses mock JWT tokens stored in local storage

## 👥 Contributors

- **Developer:** Dhruv Chauhan (@dhruvchauhan29)
- **Assignment:** HASHEDIN UNIVERSITY Final Angular Assignment

## 📄 License

This project is created for educational purposes as part of the HASHEDIN UNIVERSITY curriculum.
App

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.19.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
