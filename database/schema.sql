-- ============================================
-- TransportIQ Database Schema
-- PostgreSQL with PostGIS Extension
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('shipper', 'transporter', 'driver', 'admin');
CREATE TYPE kyc_status AS ENUM ('pending', 'submitted', 'verified', 'rejected');
CREATE TYPE vehicle_type AS ENUM ('mini_truck', 'lcv', 'hcv', 'trailer', 'container', 'tanker', 'refrigerated');
CREATE TYPE shipment_status AS ENUM ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE trip_status AS ENUM ('assigned', 'en_route_pickup', 'at_pickup', 'in_transit', 'at_drop', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('upi', 'card', 'wallet', 'cod', 'bank_transfer');
CREATE TYPE notification_type AS ENUM ('shipment_update', 'payment', 'trip_update', 'system', 'promotion');

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role user_role NOT NULL DEFAULT 'shipper',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    gstin VARCHAR(15),
    avatar_url TEXT,
    
    -- KYC Fields (primarily for drivers)
    kyc_status kyc_status DEFAULT 'pending',
    aadhaar_number VARCHAR(12),
    aadhaar_doc_url TEXT,
    driving_license VARCHAR(20),
    dl_doc_url TEXT,
    pan_number VARCHAR(10),
    
    -- Driver-specific
    is_online BOOLEAN DEFAULT false,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    current_location GEOGRAPHY(Point, 4326),
    
    -- Metadata
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    otp_code VARCHAR(6),
    otp_expires_at TIMESTAMP WITH TIME ZONE,
    refresh_token TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- VEHICLES TABLE
-- ============================================

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    color VARCHAR(50),
    
    capacity_tons DECIMAL(8, 2) NOT NULL,
    capacity_volume_cbm DECIMAL(8, 2),
    
    -- Documents
    insurance_number VARCHAR(50),
    insurance_expiry DATE,
    fitness_expiry DATE,
    permit_number VARCHAR(50),
    permit_expiry DATE,
    rc_doc_url TEXT,
    insurance_doc_url TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    current_location GEOGRAPHY(Point, 4326),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SHIPMENTS TABLE
-- ============================================

CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Users
    shipper_id UUID NOT NULL REFERENCES users(id),
    transporter_id UUID REFERENCES users(id),
    driver_id UUID REFERENCES users(id),
    vehicle_id UUID REFERENCES vehicles(id),
    
    -- Pickup Location
    pickup_address TEXT NOT NULL,
    pickup_city VARCHAR(100),
    pickup_state VARCHAR(100),
    pickup_pincode VARCHAR(6),
    pickup_lat DECIMAL(10, 8) NOT NULL,
    pickup_lng DECIMAL(11, 8) NOT NULL,
    pickup_contact_name VARCHAR(100),
    pickup_contact_phone VARCHAR(15),
    pickup_location GEOGRAPHY(Point, 4326),
    
    -- Drop Location
    drop_address TEXT NOT NULL,
    drop_city VARCHAR(100),
    drop_state VARCHAR(100),
    drop_pincode VARCHAR(6),
    drop_lat DECIMAL(10, 8) NOT NULL,
    drop_lng DECIMAL(11, 8) NOT NULL,
    drop_contact_name VARCHAR(100),
    drop_contact_phone VARCHAR(15),
    drop_location GEOGRAPHY(Point, 4326),
    
    -- Multi-stop support
    stops JSONB DEFAULT '[]',
    
    -- Cargo Details
    weight_kg DECIMAL(10, 2) NOT NULL,
    material_type VARCHAR(100),
    material_description TEXT,
    num_packages INTEGER DEFAULT 1,
    is_fragile BOOLEAN DEFAULT false,
    is_hazardous BOOLEAN DEFAULT false,
    
    -- Vehicle Requirement
    vehicle_type_required vehicle_type NOT NULL,
    
    -- Status & Tracking
    status shipment_status DEFAULT 'pending',
    
    -- Pricing
    distance_km DECIMAL(10, 2),
    estimated_duration_minutes INTEGER,
    estimated_fare DECIMAL(12, 2),
    final_fare DECIMAL(12, 2),
    
    -- Payment
    payment_method payment_method DEFAULT 'upi',
    is_paid BOOLEAN DEFAULT false,
    
    -- Schedule
    pickup_scheduled_at TIMESTAMP WITH TIME ZONE,
    pickup_actual_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes
    shipper_notes TEXT,
    driver_notes TEXT,
    cancellation_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TRIPS TABLE
-- ============================================

CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id),
    driver_id UUID NOT NULL REFERENCES users(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    
    status trip_status DEFAULT 'assigned',
    
    -- Route
    route_polyline TEXT,
    planned_route JSONB,
    
    -- Tracking
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    current_speed DECIMAL(5, 2),
    current_heading DECIMAL(5, 2),
    
    -- Distance & Time
    distance_covered_km DECIMAL(10, 2) DEFAULT 0,
    estimated_arrival TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    start_time TIMESTAMP WITH TIME ZONE,
    pickup_reached_at TIMESTAMP WITH TIME ZONE,
    pickup_completed_at TIMESTAMP WITH TIME ZONE,
    drop_reached_at TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- LOCATION HISTORY TABLE (GPS Tracking)
-- ============================================

CREATE TABLE locations (
    id BIGSERIAL PRIMARY KEY,
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES users(id),
    
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    point GEOGRAPHY(Point, 4326),
    
    speed DECIMAL(5, 2),
    heading DECIMAL(5, 2),
    accuracy DECIMAL(8, 2),
    altitude DECIMAL(10, 2),
    
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id),
    user_id UUID NOT NULL REFERENCES users(id),
    
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    method payment_method NOT NULL,
    
    -- Razorpay
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    
    status payment_status DEFAULT 'pending',
    
    -- GST
    subtotal DECIMAL(12, 2),
    gst_rate DECIMAL(5, 2) DEFAULT 18.00,
    cgst_amount DECIMAL(12, 2),
    sgst_amount DECIMAL(12, 2),
    igst_amount DECIMAL(12, 2),
    total_gst DECIMAL(12, 2),
    
    failure_reason TEXT,
    refund_id VARCHAR(100),
    
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INVOICES TABLE
-- ============================================

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(30) UNIQUE NOT NULL,
    
    payment_id UUID NOT NULL REFERENCES payments(id),
    shipment_id UUID NOT NULL REFERENCES shipments(id),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Company details
    from_gstin VARCHAR(15),
    from_name VARCHAR(255),
    from_address TEXT,
    
    to_gstin VARCHAR(15),
    to_name VARCHAR(255),
    to_address TEXT,
    
    -- Amounts
    subtotal DECIMAL(12, 2) NOT NULL,
    gst_rate DECIMAL(5, 2) DEFAULT 18.00,
    cgst DECIMAL(12, 2),
    sgst DECIMAL(12, 2),
    igst DECIMAL(12, 2),
    total DECIMAL(12, 2) NOT NULL,
    
    -- E-way bill
    eway_bill_number VARCHAR(20),
    eway_bill_date DATE,
    eway_bill_expiry DATE,
    
    pdf_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    type notification_type DEFAULT 'system',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PRICING RULES TABLE
-- ============================================

CREATE TABLE pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    vehicle_type vehicle_type NOT NULL,
    
    base_fare DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    per_km_rate DECIMAL(8, 2) NOT NULL DEFAULT 15.00,
    per_kg_rate DECIMAL(8, 2) NOT NULL DEFAULT 2.00,
    loading_charge DECIMAL(10, 2) DEFAULT 200.00,
    unloading_charge DECIMAL(10, 2) DEFAULT 200.00,
    
    min_fare DECIMAL(10, 2) DEFAULT 800.00,
    surge_multiplier DECIMAL(4, 2) DEFAULT 1.00,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DRIVER EARNINGS TABLE
-- ============================================

CREATE TABLE driver_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES users(id),
    trip_id UUID REFERENCES trips(id),
    shipment_id UUID REFERENCES shipments(id),
    
    amount DECIMAL(12, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) DEFAULT 10.00,
    commission_amount DECIMAL(12, 2),
    net_earning DECIMAL(12, 2),
    
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

-- Users
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users USING GIST(current_location);
CREATE INDEX idx_users_online_drivers ON users(is_online, role) WHERE role = 'driver' AND is_online = true;

-- Vehicles
CREATE INDEX idx_vehicles_transporter ON vehicles(transporter_id);
CREATE INDEX idx_vehicles_driver ON vehicles(driver_id);
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX idx_vehicles_location ON vehicles USING GIST(current_location);

-- Shipments
CREATE INDEX idx_shipments_shipper ON shipments(shipper_id);
CREATE INDEX idx_shipments_transporter ON shipments(transporter_id);
CREATE INDEX idx_shipments_driver ON shipments(driver_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_id);
CREATE INDEX idx_shipments_pickup_location ON shipments USING GIST(pickup_location);
CREATE INDEX idx_shipments_drop_location ON shipments USING GIST(drop_location);
CREATE INDEX idx_shipments_created ON shipments(created_at DESC);

-- Trips
CREATE INDEX idx_trips_shipment ON trips(shipment_id);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_driver_active ON trips(driver_id, status) WHERE status NOT IN ('completed', 'cancelled');

-- Locations (GPS tracking - heavily queried)
CREATE INDEX idx_locations_trip ON locations(trip_id);
CREATE INDEX idx_locations_driver ON locations(driver_id);
CREATE INDEX idx_locations_point ON locations USING GIST(point);
CREATE INDEX idx_locations_recorded ON locations(recorded_at DESC);
CREATE INDEX idx_locations_trip_time ON locations(trip_id, recorded_at DESC);

-- Payments
CREATE INDEX idx_payments_shipment ON payments(shipment_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_razorpay ON payments(razorpay_order_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Pricing Rules
CREATE INDEX idx_pricing_vehicle ON pricing_rules(vehicle_type);
CREATE UNIQUE INDEX idx_pricing_active_vehicle ON pricing_rules(vehicle_type) WHERE is_active = true;

-- Driver Earnings
CREATE INDEX idx_earnings_driver ON driver_earnings(driver_id);
CREATE INDEX idx_earnings_trip ON driver_earnings(trip_id);

-- ============================================
-- SEED DEFAULT PRICING RULES
-- ============================================

INSERT INTO pricing_rules (vehicle_type, base_fare, per_km_rate, per_kg_rate, min_fare) VALUES
    ('mini_truck', 500, 12, 1.5, 800),
    ('lcv', 800, 16, 2.0, 1200),
    ('hcv', 1500, 22, 2.5, 2500),
    ('trailer', 2500, 30, 3.0, 4000),
    ('container', 3000, 35, 3.5, 5000),
    ('tanker', 2000, 28, 3.0, 3500),
    ('refrigerated', 2500, 32, 4.0, 4000);

-- ============================================
-- SEED ADMIN USER
-- ============================================

-- Password: Admin@123 (bcrypt hash)
INSERT INTO users (email, phone, password_hash, role, first_name, last_name, is_verified, kyc_status)
VALUES (
    'admin@transportiq.in',
    '9999999999',
    '$2b$12$LJ3m4ys3GZ4kMRXnM5G0/.V3HvG3H6y8sR8gRfD4IYo4bGqE1NUPK',
    'admin',
    'System',
    'Admin',
    true,
    'verified'
);
