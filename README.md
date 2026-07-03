# 🚀 TransportIQ — India's Smartest Logistics Platform

A production-ready, real-time transportation, logistics, and supply chain management platform built for the Indian market. Inspired by BlackBuck and Delhivery.

## 🎯 Overview

TransportIQ connects **Shippers**, **Transporters**, **Drivers**, and **Admins** in a unified, role-based ecosystem for freight movement across India.

### Key Features
* **Role-Based Portals**: Tailored interfaces for Shippers, Transporters, Drivers, and Admins.
* **Interactive Shipper Portal**:
  * **Shipment Booking**: Map-based pickup/drop locations, vehicle selection, and dynamic pricing rules.
  * **Live GPS Tracking**: Real-time driver tracking with route map visualization (powered by Leaflet.js).
  * **Notifications Tray**: Dynamic bell notification indicator showing unread counts and quick navigation.
* **Transporter Marketplace (Load Board)**:
  * **Bidding Engine**: Transporters can place bids and quotes dynamically on open shipper loads.
  * **Fleet & Driver Management**: Live driver registry tracking status states (Active/Idle/Offline) and vehicle allocation.
* **Full-Fidelity Driver App**:
  * **Active Trip Tracker**: Interactive status steps (Arrive, Load, Transit, Deliver) with live route tracking.
  * **Earnings Analyzer**: Recharts-based daily/weekly earnings graphs, wallet balance tracking, and cash-out requests.
  * **KYC Vault**: Store personal verification fields (license, Aadhaar) with verification badge trackers.
* **Advanced Backend Services**:
  * **Route Optimization Engine**: Computes highly optimized pathways with real-time ETA predictions.
  * **Razorpay Payment Gateway**: Seamless checkout experience, GST-compliant invoicing (CGST, SGST, IGST calculations), and transaction verifications.
  * **Digital Wallet & Settlements**: Ledger entries, balance tracking, and automated transporter payout simulations.
  * **Audited logs**: Full tracking of disputes, warehouse stocks, and audit trails.
* **Robust Error Handling & Security**:
  * Client-side validation with specific field-level server error alerts.
  * Suppressed browser hydration warnings (autofill `fdprocessedid` mismatch resolved).
  * Highly stable, camelCase Redis v4 Rate Limiter (`pTTL`/`pExpire`) with failsafe offline mock fallbacks.

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14+ (App Router), Tailwind CSS, Recharts, Leaflet.js, React Icons |
| **Backend** | Node.js, Express.js, Socket.IO, Sequelize ORM |
| **Database** | PostgreSQL (PostGIS), Redis (v4 client) |
| **Auth** | JWT + bcrypt + OTP |
| **Payments** | Razorpay |
| **Maps** | Leaflet.js / OpenStreetMap |
| **DevOps** | Docker, GitHub Actions |

## 📁 Project Structure

```
├── frontend/           # Next.js App Router + Tailwind CSS
│   ├── src/app/        # App Router pages
│   │   ├── (auth)/     # Hydration-safe Login (with Role Selection), Register (with helper requirements)
│   │   ├── (shipper)/  # Shipper booking, settings, tracking, and shipments
│   │   ├── (transporter)/ # Fleet, loads, drivers registry, earnings, settings, notifications
│   │   ├── (driver)/   # Active trip, earnings tracking, trip history, profile/KYC, settings, notifications
│   │   └── (admin)/    # Admin panel dashboards, user database controls, notifications
│   ├── src/components/ # Shared dashboard layouts, Leaflet map utilities, analytical charts
│   ├── src/lib/        # API clients, interceptors, Socket.IO events
│   └── src/contexts/   # Global Auth status and context
│
├── backend/            # Express.js Modular REST & Gateway API
│   ├── src/services/   # Auth controllers, shipment, fleet, driver, payments, pricing, and system alerts
│   ├── src/models/     # Sequelize ORM models (PostGIS/PostgreSQL schema definitions)
│   ├── src/middleware/  # Dynamic role verification, rate limiting (Redis v4), error parsing
│   └── src/utils/      # Fare calculators, ETA prediction models, matching heuristics
│
├── database/           # PostgreSQL schema (PostGIS)
├── docker-compose.yml  # Multi-container local orchestration (Postgres, Redis, Kafka, Zookeeper)
└── .github/workflows/  # CI/CD pipeline
```

## 🚀 Quick Start

### Prerequisites
* Node.js 18+
* PostgreSQL 15+ (with PostGIS extension enabled)
* Redis Server 7+

### 1. Clone & Install
```bash
git clone <repo-url>
cd TransportIQ

# Install all workspace dependencies (root, backend, frontend)
npm run install:all
```

### 2. Environment Setup
Create a `.env` file in the root directory (and `backend/.env`):
```bash
cp .env.example .env
# Open and configure database credentials, JWT secrets, and payment API keys
```

### 3. Database Setup
**Option A: Docker Orchestration (Recommended)**
```bash
docker-compose up -d postgres redis
```
**Option B: Manual Setup**
```bash
psql -U postgres -c "CREATE DATABASE transportiq;"
psql -U postgres -d transportiq -f database/schema.sql
```

### 4. Start Development
To launch both frontend and backend development servers concurrently:
```bash
npm run dev
```
* **Frontend Dev Server**: [http://localhost:3000](http://localhost:3000)
* **Backend API Gateway**: [http://localhost:5000](http://localhost:5000) (Health check: `http://localhost:5000/api/health`)

---

### 5. Default Verification Credentials

For testing and verification, you can log in with:
* **Admin Phone:** `9999999999` | **Password:** `Admin@123`

## 🐳 Docker Deployment
To build and run all services in production/containers:
```bash
# Build and start all services
docker-compose up -d

# View real-time container output logs
docker-compose logs -f
```

## 📡 API Endpoints

### Authentication
* `POST /api/auth/register` - Create account (validates phone, password complexity, and role).
* `POST /api/auth/login` - Verify credentials and return JWT tokens.
* `POST /api/auth/otp/request` - Generate and send verification OTP.
* `POST /api/auth/otp/verify` - Confirm OTP code.
* `PUT /api/auth/profile` - Update profile details (editable name, email, company, GSTIN).

### Shipments & Allocation
* `POST /api/shipments` - Create shipment booking.
* `POST /api/shipments/estimate` - Fare estimations based on routing rules.
* `PATCH /api/shipments/:id/status` - Transition shipment/trip states.

## 🇮🇳 India-Specific Features
* **GST Compliance**: Instantly generates IGST, CGST, and SGST breakdowns.
* **Indian Phone Validation**: Standard regex checks for `+91` ten-digit mobile numbers.
* **Driver Verification**: Track license registration and Aadhaar numbers.
* **INR Currency Support**: Full UI localization displaying `₹` symbols.

## License
Licensed under the [MIT License](LICENSE).
