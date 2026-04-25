# 🚀 TransportIQ — India's Smartest Logistics Platform

A production-ready, real-time transportation, logistics, and supply chain management platform built for the Indian market. Inspired by BlackBuck and Delhivery.

## 🎯 Overview

TransportIQ connects **Shippers**, **Transporters**, **Drivers**, and **Admins** in a unified ecosystem for freight movement across India.

### Key Features
- **Shipment Booking** with map-based locations, vehicle selection, and dynamic pricing
- **Live GPS Tracking** with 3-5 second updates via Socket.IO
- **Driver Auto-Matching** using geolocation and vehicle type
- **Razorpay Payments** (UPI, Cards, Wallets, COD)
- **GST-Compliant Invoicing** with CGST/SGST/IGST support
- **Fleet Management** for transporters
- **Analytics Dashboard** with Recharts visualizations
- **AI-based ETA Prediction** using vehicle speed models
- **Multi-stop Delivery** support
- **OTP Authentication** (India-ready)

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, Recharts, Leaflet.js |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | PostgreSQL (PostGIS), Redis |
| **Auth** | JWT + bcrypt + OTP |
| **Payments** | Razorpay |
| **Maps** | Leaflet.js / OpenStreetMap |
| **DevOps** | Docker, GitHub Actions |

## 📁 Project Structure

```
├── frontend/           # Next.js 14 + Tailwind CSS
│   ├── src/app/        # App Router pages
│   │   ├── (auth)/     # Login, Register
│   │   ├── (shipper)/  # Shipper dashboard, booking, tracking
│   │   ├── (transporter)/ # Fleet management
│   │   ├── (driver)/   # Driver interface
│   │   └── (admin)/    # Admin panel
│   ├── src/components/ # Shared UI, maps, charts
│   ├── src/lib/        # API client, socket, utils
│   └── src/contexts/   # Auth context
│
├── backend/            # Express.js modular API
│   ├── src/services/   # Auth, Shipment, Tracking, Payment, Fleet, Driver, Pricing, Admin
│   ├── src/models/     # Sequelize ORM models
│   ├── src/middleware/  # Auth, RBAC, validation, rate limiting
│   └── src/utils/      # Distance, pricing, matching, ETA
│
├── database/           # PostgreSQL schema (PostGIS)
├── docker-compose.yml  # Full stack containers
└── .github/workflows/  # CI/CD pipeline
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or Docker)
- Redis (or Docker)

### 1. Clone & Install

```bash
git clone <repo-url>
cd TransportIQ

# Install all dependencies
npm run install:all
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your database credentials, JWT secrets, etc.
```

### 3. Database Setup

**Option A: Docker (Recommended)**
```bash
docker-compose up -d postgres redis
```

**Option B: Manual**
```bash
psql -U postgres -c "CREATE DATABASE transportiq;"
psql -U postgres -d transportiq -f database/schema.sql
```

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev

# Or individually
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:3000
```

### 5. Default Admin Login
- **Phone:** 9999999999
- **Password:** Admin@123

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with phone/password |
| POST | `/api/auth/otp/request` | Request OTP |
| POST | `/api/auth/otp/verify` | Verify OTP & login |
| GET | `/api/auth/profile` | Get profile |

### Shipments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shipments` | Create shipment |
| POST | `/api/shipments/estimate` | Get fare estimate |
| GET | `/api/shipments` | List shipments |
| GET | `/api/shipments/:id` | Get shipment details |
| PATCH | `/api/shipments/:id/status` | Update status |
| POST | `/api/shipments/:id/auto-assign` | Auto-assign driver |

### Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tracking/trip/:id/location` | Record GPS point |
| GET | `/api/tracking/trip/:id/locations` | Get location history |
| GET | `/api/tracking/trip/:id/position` | Get live position |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/:id/verify` | Verify payment |

### Fleet, Driver, Pricing, Admin
See full API documentation in the codebase.

## 🔧 Configuration

All configuration is via environment variables. See `.env.example` for the full list.

## 📊 Database Schema

- **users** — All roles with KYC, geolocation
- **vehicles** — Registration, documents, capacity
- **shipments** — Full lifecycle with multi-stop
- **trips** — Active tracking with route polylines
- **locations** — GPS history (PostGIS indexed)
- **payments** — Razorpay + GST breakdown
- **invoices** — GST-compliant invoices
- **pricing_rules** — Dynamic pricing per vehicle type
- **notifications** — In-app + push ready

## 🇮🇳 India-Specific Compliance

- GST invoice generation (CGST/SGST/IGST)
- E-way bill structure ready
- Driver KYC (Aadhaar, Driving License)
- Multi-language support (future-ready)
- Indian phone number validation
- INR currency throughout

## License

MIT
