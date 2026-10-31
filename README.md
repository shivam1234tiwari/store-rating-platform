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

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run seed     # Seed default admin user
npm run dev      # Start server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev      # Start Vite frontend on http://localhost:5173
```

## Default Credentials
- **Admin Email:** `admin@storeplatform.com`
- **Admin Password:** `Admin@123`

<img width="1300" height="750" alt="Screenshot 2026-10-31 122426" src="https://github.com/user-attachments/assets/625701da-0234-4807-838d-19f62069d22c" />

<img width="1311" height="697" alt="Screenshot 2026-10-31 122711" src="https://github.com/user-attachments/assets/71f8f059-01ac-4682-bb9f-99292889ed5d" />

<img width="1535" height="730" alt="Screenshot 2026-10-31 122917" src="https://github.com/user-attachments/assets/8f976f65-71af-422a-a857-68dddf006cbb" />

<img width="1533" height="725" alt="Screenshot 2026-10-31 123356" src="https://github.com/user-attachments/assets/ab8a2f6b-37b4-431a-a0ba-6e228371369f" />

<img width="1535" height="735" alt="Screenshot 2026-10-31 132832" src="https://github.com/user-attachments/assets/4a2a950b-f5f6-4c50-8019-f249ec8aeca7" />




