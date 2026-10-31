# Store Rating Platform

A full-stack web application that allows users to submit ratings for stores registered on the platform. Built using **React (Vite)**, **Express.js (MVC Pattern)**, and **MySQL**.

## Tech Stack
- **Frontend:** React, Vite, React Router DOM, Tailwind CSS
- **Backend:** Express.js, Node.js (MVC Architecture)
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens), bcryptjs

## Project Architecture (MVC)
```text
store-rating-platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── store.model.js
│   │   └── rating.model.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   ├── user.controller.js
│   │   └── owner.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── validate.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── user.routes.js
│   │   └── owner.routes.js
│   ├── utils/
│   │   └── seed.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ValidationHelpers.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── UserDashboard.jsx
    │   │   ├── OwnerDashboard.jsx
    │   │   └── ChangePassword.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .env.example
```

## Quick Start Guide

### 1. Database Setup
Create MySQL database and tables using `schema.sql`:
```bash
mysql -u root -p < schema.sql
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run seed     # Seed default admin user
npm run dev      # Start server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev      # Start Vite frontend on http://localhost:5173
```

## Default Credentials
- **Admin Email:** `admin@storeplatform.com`
- **Admin Password:** `Admin@123`
