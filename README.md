# Lumina Library - Library Management System

A full-stack, SOLID-principled Library Management System constructed with a React frontend, Node.js + Express backend, and MongoDB database. Designed with a professional modern Navy Blue and Teal corporate SaaS style.

---

## 🎨 UI Theme & Styling
- **Primary Color:** Navy Blue (`#0F172A`) for headers, navbar, and primary branding.
- **Secondary Color:** White (`#FFFFFF`) for card modules and layouts.
- **Accent Color:** Teal Blue (`#14B8A6`) for action buttons, links, interactive highlights, and hover states.
- **Backgrounds:** Light Slate Gray (`#F8FAFC`) for body background and tables.
- **Cards & Layouts:** Clean rounded card shapes (12px), soft SaaS shadows, and Outfit typography.

---

## 🛠️ Technology Stack & Architecture

This application was built strictly around **SOLID Design Principles** to ensure low coupling and high separation of concerns:

- **Frontend:** React.js (Vite, Axios, Lucide Icons, CSS Modules)
- **Backend:** Node.js + Express (jsonwebtoken, bcryptjs, cors, dotenv)
- **Database:** MongoDB (Mongoose ODM, hosted on MongoDB Atlas)

### SOLID Principles Highlights:
1. **Single Responsibility Principle (SRP):** Complete separation between database definitions (Models), business operations logic (Services), and request handling (Controllers).
2. **Interface Segregation Principle (ISP):** Splitting services into dedicated domain files (`AuthService`, `BookService`, `BorrowService`) instead of a single giant module.
3. **Dependency Inversion Principle (DIP):** Routing and controllers depend on high-level service interfaces rather than directly executing low-level database queries.
4. **Multi-Host Shard Connection:** Resolved Node.js Windows SRV lookup bugs (`queryTxt ETIMEOUT`) by using a direct multi-host shard connection string.

---

## ⚙️ Running Locally

Follow these instructions to start the full-stack system on your machine:

### 🟢 1. Running the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *The backend runs on [http://localhost:5050](http://localhost:5050)*.

---

### 🔵 2. Running the Frontend Client
1. Open a new terminal window/tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   

---

## 🔒 User Roles & Test Scenarios

To test the application's functionality, create accounts directly on the Sign Up tab:
- **Admin Role:** Whitelist as "Admin" during sign up to add new books, edit existing catalog data, delete books, and view real-time borrow logs.
- **Member Role:** Whitelist as "Member" to browse the catalog, search items, check out/borrow books, return books, and view borrowing history.
