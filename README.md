# 🚀 TransportIQ — India's Smartest Logistics Platform

An enterprise-architected, real-time transportation, logistics, and supply chain management platform built for the Indian market. Inspired by BlackBuck and Delhivery.

## 🎯 Overview

TransportIQ connects **Shippers**, **Transporters**, **Drivers**, and **Admins** in a unified, role-based ecosystem for freight movement across India.

### 🏗️ Architecture Overview

```
                      +----------------------------------+
                      |     Next.js 16 App Router UI     |
                      |  (Shipper / Transporter / Driver) |
                      +----------------+-----------------+
                                       | HTTP / WebSockets
                                       v
                      +----------------+-----------------+
                      |     Express.js API Gateway       |
                      +----------------+-----------------+
                                       |
    +------------------+---------------+---------------+-------------------+
    |                  |                               |                   |
    v                  v                               v                   v
+---+------------+  +--+---------------+     +---------+-------+  +--------+--------+
|  PostgreSQL    |  | Redis v4 Cache   |     | Apache Kafka    |  | Socket.IO      |
|  + PostGIS     |  | & Rate Limiter   |     | Event Streaming |  | Live Tracking  |
+----------------+  +------------------+     +-----------------+  +-----------------+
```

### ⚡ Feature Implementation Matrix

| Capability | Status | Implementation Details |
|---|---|---|
| **Geospatial & Routing** | ✅ Implemented | PostGIS point-in-polygon queries, Haversine distance math, Leaflet route rendering |
| **Realtime Tracking** | ✅ Implemented | Socket.IO location broadcast, status state-machine (Booking -> Transit -> Delivered) |
| **Authentication & RBAC** | ✅ Implemented | JWT + bcrypt auth, role-gated API middleware, verification badge tracking |
| **Payment Gateway** | ✅ Implemented | Razorpay integration, GST breakdown (CGST/SGST/IGST), digital wallet ledger |
| **Event Pipeline** | ✅ Implemented | Apache Kafka producer/consumer pipeline for asynchronous shipment lifecycle events |
| **Decision & Pricing Engine** | ⚙️ Heuristic / Rule-Based | Intent matching, route heuristics, dynamic fare calculation, demand estimation |
| **Failsafe System** | ✅ Failsafe Enabled | Graceful Redis & payment gateway fallback handling for local development |

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16+ (App Router), React 19, Tailwind CSS v4, Recharts, Leaflet.js, React Icons |
| **Backend** | Node.js (v20+), Express.js, Socket.IO, Sequelize ORM |
| **Database** | PostgreSQL 15+ (PostGIS extension), Redis (v4 client) |
| **Messaging** | Apache Kafka & Zookeeper |
| **Auth** | JWT + bcrypt + OTP verification |
| **Payments** | Razorpay Integration |
| **Maps** | Leaflet.js / OpenStreetMap |
| **DevOps** | Docker, Docker Compose, GitHub Actions |

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
