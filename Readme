<h1 align="center">🚗 RideConnect — Enterprise Carpooling Platform</h1>

<p align="center">
  <strong>Odoo Hackathon 2026 | Odoo × KSV</strong><br/>
  A full-stack, production-grade enterprise carpooling solution designed to reduce commute costs, lower carbon emissions, and streamline employee transportation across organizations.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk" alt="Java 21"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen?style=for-the-badge&logo=springboot" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-8.1-purple?style=for-the-badge&logo=vite" alt="Vite"/>
  <img src="https://img.shields.io/badge/PostgreSQL-17-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4.3-cyan?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/Razorpay-Integrated-blue?style=for-the-badge&logo=razorpay" alt="Razorpay"/>
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Screenshots & UI Walkthrough](#-screenshots--ui-walkthrough)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Team](#-team)

---

## 🌟 Overview

**RideConnect** is a comprehensive enterprise carpooling platform built for the **Odoo Hackathon 2026**. It enables employees within an organization to share rides, reducing transportation costs and environmental impact. The platform features real-time ride matching, secure Razorpay-powered payments with digital wallets, live GPS tracking with route visualization, in-app WebSocket-based chat, and an admin analytics dashboard with exportable PDF reports.

The application is designed with **role-based access control (RBAC)**, supporting two primary roles:
- **Employee** — Can discover rides, book trips, publish rides as a driver, manage vehicles, track rides in real-time, and manage their digital wallet.
- **Admin** — Has access to a comprehensive dashboard with platform analytics, employee management, vehicle oversight, audit logs, and configurable platform settings.

---

## ✨ Key Features

### 🧑‍💼 Employee Portal
| Feature | Description |
|---|---|
| **🔍 Discover Rides** | Search for available rides by origin, destination, and date with coordinate-based routing via OSRM |
| **📝 Publish Rides** | Offer rides as a driver with vehicle selection, pricing, and seat availability |
| **🗺️ Live Tracking** | Real-time ride tracking with interactive Leaflet maps and WebSocket-powered location updates |
| **📊 Ride Analytics** | Personal ride history with distance, cost savings, and environmental impact metrics |
| **💰 Digital Wallet** | Integrated Razorpay-powered wallet with one-click recharge and full transaction history |
| **💬 In-App Chat** | Real-time messaging between drivers and passengers via WebSocket/STOMP |
| **🚗 My Vehicles** | Register and manage personal vehicles with document upload support |
| **📍 Saved Places** | Save frequently used locations for quick ride search |
| **🎫 My Trips** | View all booked trips with OTP verification for ride start |
| **⚡ Active Rides** | Monitor and manage currently active rides in real-time |
| **📥 PDF Reports** | Download personal trip analytics as formatted PDF documents |
| **👤 Profile & Settings** | Complete profile management with customizable preferences |

### 🛡️ Admin Dashboard
| Feature | Description |
|---|---|
| **📈 Platform Analytics** | Company-wide KPIs — total trips, distance covered, fuel saved, cost savings |
| **👥 Manage Employees** | View, search, and manage all registered employees |
| **🚙 Manage Vehicles** | Oversee all registered fleet vehicles with details |
| **🔧 Platform Settings** | Configure company-wide carpooling rules and preferences |
| **📄 Export Analytics PDF** | One-click download of comprehensive platform analytics reports |
| **🔒 Audit Logs PDF** | Download system audit trails for compliance and oversight |

---

## 🏗️ System Architecture

<p align="center">
  <img src="docs/architecture_diagram.png" alt="System Architecture" width="650"/>
</p>

The platform follows a **layered microservice-ready architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React 19)                   │
│          Vite 8.1 · TailwindCSS 4.3 · Leaflet          │
│    React Router · Axios · SockJS · Lucide Icons         │
├─────────────────────────────────────────────────────────┤
│               REST API + WebSocket Layer                │
│          JWT Authentication · CORS · STOMP              │
├─────────────────────────────────────────────────────────┤
│              BACKEND (Spring Boot 4.1.0)                │
│  Java 21 · Spring Security · Spring Data JPA · Lombok   │
│  WebSocket · Razorpay SDK · OpenPDF · ClickHouse JDBC   │
├─────────────────────────────────────────────────────────┤
│                    DATA LAYER                           │
│         PostgreSQL (Primary) · ClickHouse (OLAP)        │
├─────────────────────────────────────────────────────────┤
│                EXTERNAL SERVICES                        │
│   Razorpay · OSRM Routing · Nominatim Geocoding        │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Java** | 21 (LTS) | Core programming language |
| **Spring Boot** | 4.1.0 | Application framework |
| **Spring Security** | Latest | Authentication & authorization |
| **Spring Data JPA** | Latest | ORM & data access layer |
| **Spring WebSocket** | Latest | Real-time communication (STOMP over SockJS) |
| **PostgreSQL** | 17+ | Primary relational database |
| **ClickHouse** | 23.x | OLAP analytics database for platform metrics |
| **JWT (jjwt)** | 0.11.5 | Stateless token-based authentication |
| **Razorpay Java SDK** | 1.4.6 | Payment gateway integration |
| **OpenPDF** | 1.3.30 | Server-side PDF report generation |
| **Lombok** | Latest | Boilerplate code reduction |
| **Maven** | 3.9+ | Build & dependency management |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.7 | UI component library |
| **Vite** | 8.1.1 | Build tool & dev server |
| **TailwindCSS** | 4.3.3 | Utility-first CSS framework |
| **React Router DOM** | 7.18.1 | Client-side routing & navigation |
| **Axios** | 1.18.1 | HTTP client for API calls |
| **Leaflet** | 1.9.4 | Interactive map rendering |
| **React Leaflet** | 4.2.1 | React bindings for Leaflet |
| **SockJS Client** | 1.6.1 | WebSocket fallback transport |
| **@stomp/stompjs** | 7.0.0 | STOMP messaging protocol |
| **Lucide React** | 1.25.0 | Modern icon library |

### External Services & APIs

| Service | Purpose |
|---|---|
| **Razorpay** | Payment processing, order creation, signature verification |
| **OSRM (Open Source Routing Machine)** | Route calculation, distance & duration estimation |
| **Nominatim (OpenStreetMap)** | Forward geocoding for location search |
| **Leaflet + OpenStreetMap** | Interactive map tiles and route visualization |

---

## 📁 Project Structure

```
odoofff/
├── 📂 backend/                              # Spring Boot Backend
│   ├── pom.xml                              # Maven dependencies
│   └── src/main/java/com/odoohackathon/
│       └── odoohackathon/
│           ├── OdooHackathonApplication.java # Main entry point
│           ├── 📂 config/
│           │   ├── DatabaseSeeder.java       # Mock data seeder (50+ records)
│           │   ├── ClickHouseConfig.java     # ClickHouse OLAP configuration
│           │   ├── WebSocketConfig.java      # STOMP WebSocket configuration
│           │   └── 📂 security/
│           │       ├── SecurityConfig.java         # Spring Security filter chain
│           │       ├── JwtService.java              # JWT token generation & validation
│           │       ├── JwtAuthenticationFilter.java # Request authentication filter
│           │       ├── CustomUserDetailsService.java# User loading for auth
│           │       └── ApplicationConfig.java       # BCrypt encoder & auth manager
│           └── 📂 domain/
│               ├── 📂 user/        # User management (entity, DTO, repo, service, controller)
│               ├── 📂 ride/        # Ride publishing & discovery
│               ├── 📂 trip/        # Trip booking & lifecycle
│               ├── 📂 vehicle/     # Vehicle registration & management
│               ├── 📂 payment/     # Razorpay integration & wallet
│               ├── 📂 chat/        # Real-time messaging
│               ├── 📂 tracking/    # GPS location tracking
│               ├── 📂 analytics/   # Platform analytics & KPIs
│               ├── 📂 audit/       # System audit logs & PDF reporting
│               ├── 📂 admin/       # Admin-specific APIs
│               └── 📂 notification/# Push notification service
│
├── 📂 frontend/                             # React Frontend
│   ├── package.json                         # NPM dependencies
│   └── src/
│       ├── App.jsx                          # Root component with routing
│       ├── main.jsx                         # React DOM entry point
│       ├── 📂 context/
│       │   └── AuthContext.jsx              # Global auth state (JWT + localStorage)
│       ├── 📂 services/
│       │   ├── api.js                       # Axios instance (base URL + interceptors)
│       │   ├── authService.js               # Login, register, password reset
│       │   ├── rideService.js               # Ride CRUD operations
│       │   ├── tripService.js               # Trip booking & history
│       │   ├── vehicleService.js            # Vehicle management
│       │   ├── paymentService.js            # Razorpay widget + wallet APIs
│       │   ├── chatService.js               # Chat message APIs
│       │   ├── savedLocationService.js      # Saved places CRUD
│       │   ├── analyticsService.js          # Dashboard & PDF exports
│       │   └── adminService.js              # Admin management APIs
│       ├── 📂 pages/
│       │   ├── Login.jsx                    # Authentication page
│       │   ├── Register.jsx                 # Employee registration
│       │   ├── ResetPassword.jsx            # Password recovery flow
│       │   ├── SplashScreen.jsx             # Animated splash/loading screen
│       │   ├── 📂 employee/                 # Employee portal pages
│       │   │   ├── EmployeeLayout.jsx       # Sidebar navigation layout
│       │   │   ├── DiscoverRides.jsx        # Ride search with map routing
│       │   │   ├── PublishRide.jsx          # Offer a new ride
│       │   │   ├── MyTrips.jsx             # Trip history & management
│       │   │   ├── ActiveRides.jsx         # Currently active rides
│       │   │   ├── LiveTracking.jsx        # Real-time map tracking
│       │   │   ├── Wallet.jsx              # Digital wallet & Razorpay
│       │   │   ├── Chat.jsx                # WebSocket chat interface
│       │   │   ├── MyVehicles.jsx          # Vehicle management
│       │   │   ├── SavedPlaces.jsx         # Favorite locations
│       │   │   ├── Analytics.jsx           # Personal ride analytics
│       │   │   ├── Profile.jsx             # User profile editor
│       │   │   ├── Settings.jsx            # App preferences
│       │   │   └── AdminDashboard.jsx      # Quick admin view
│       │   ├── 📂 admin/                    # Admin portal pages
│       │   │   ├── AdminLayout.jsx         # Admin sidebar layout
│       │   │   ├── DashboardOverview.jsx   # Platform KPIs & analytics
│       │   │   ├── ManageEmployees.jsx     # Employee management table
│       │   │   ├── ManageVehicles.jsx      # Fleet vehicle oversight
│       │   │   ├── OnboardDriver.jsx       # Driver onboarding flow
│       │   │   └── PlatformSettings.jsx    # Platform configuration
│       │   └── 📂 driver/                   # Driver-specific pages
│       │       ├── DriverLayout.jsx        # Driver navigation layout
│       │       ├── ActiveRides.jsx         # Driver's active rides
│       │       └── PublishRide.jsx         # Driver ride publishing
│       └── 📂 assets/                       # Static assets & screenshots
└── README.md                               # This file
```

---

## 🗄️ Database Schema

The platform uses **PostgreSQL** as the primary transactional database and **ClickHouse** for analytics aggregation.

### Core Entities (PostgreSQL)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Users      │     │   Vehicles   │     │  Companies   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │────▶│ id (PK)      │     │ id (PK)      │
│ firstName    │     │ owner_id(FK) │     │ name         │
│ lastName     │     │ model        │     │ domain       │
│ email (UQ)   │     │ regNumber(UQ)│     └──────────────┘
│ password     │     │ seatingCap   │
│ phoneNumber  │     │ insurance    │
│ role (ENUM)  │     │ registration │
│ company_id   │     │ pollution    │
│ driverLicense│     │ createdAt    │
│ createdAt    │     └──────────────┘
│ updatedAt    │
└──────┬───────┘
       │
       │ 1:N (as driver)
       ▼
┌──────────────┐        ┌──────────────────┐
│    Rides      │        │      Trips       │
├──────────────┤        ├──────────────────┤
│ id (PK)      │───────▶│ id (PK)          │
│ driver_id(FK)│  1:N   │ ride_id (FK)     │
│ vehicle_id   │        │ passenger_id(FK) │
│ pickup       │        │ bookedSeats      │
│ destination  │        │ totalFare        │
│ departureTime│        │ status (ENUM)    │
│ availSeats   │        │ startOtp         │
│ farePerSeat  │        │ createdAt        │
│ createdAt    │        └────────┬─────────┘
└──────────────┘                 │
                                 │ 1:N
                                 ▼
                  ┌────────────────────────┐
                  │  PaymentTransactions   │
                  ├────────────────────────┤
                  │ id (PK)                │
                  │ trip_id (FK, nullable) │
                  │ wallet_id (FK)         │
                  │ amount                 │
                  │ paymentMethod          │
                  │ transactionType        │
                  │ status                 │
                  │ createdAt              │
                  └────────────────────────┘

┌──────────────────┐     ┌──────────────────┐
│     Wallet       │     │  SavedLocations  │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ user_id (FK, UQ) │     │ user_id (FK)     │
│ balance          │     │ name             │
│ createdAt        │     │ address          │
│ updatedAt        │     │ latitude         │
└──────────────────┘     │ longitude        │
                         └──────────────────┘
```

### Trip Status Lifecycle
```
BOOKED → IN_PROGRESS → COMPLETED
                    └→ CANCELLED
```

---

## 📸 Screenshots & UI Walkthrough

### 🔐 Authentication

<table>
  <tr>
    <td align="center"><strong>Sign In</strong></td>
    <td align="center"><strong>Sign Up</strong></td>
  </tr>
  <tr>
    <td><img src="docs/signin.png" alt="Sign In" width="400"/></td>
    <td><img src="docs/signup.png" alt="Sign Up" width="400"/></td>
  </tr>
</table>

> Role-based authentication with JWT tokens. Employees and Admins are redirected to their respective dashboards automatically upon login.

---

### 🧑‍💼 Employee Portal

<table>
  <tr>
    <td align="center"><strong>Employee Dashboard — Discover Rides</strong></td>
  </tr>
  <tr>
    <td><img src="docs/employee_dashboard.png" alt="Employee Dashboard" width="800"/></td>
  </tr>
</table>

> The main employee interface with a collapsible sidebar navigation. Discover rides by entering origin and destination — the system uses **OSRM** for route calculation and **Leaflet** for interactive map visualization with route polylines.

---

<table>
  <tr>
    <td align="center"><strong>Publish a Ride</strong></td>
    <td align="center"><strong>My Vehicles</strong></td>
  </tr>
  <tr>
    <td><img src="docs/publish_ride.png" alt="Publish Ride" width="400"/></td>
    <td><img src="docs/my_vehicles.png" alt="My Vehicles" width="400"/></td>
  </tr>
</table>

> **Publish Ride**: Drivers can offer rides by selecting their vehicle, setting pickup/destination, departure time, available seats, and fare per seat. Pre-populated from saved locations.  
> **My Vehicles**: Register vehicles with model, registration number, seating capacity, and document uploads (insurance, registration, pollution certificates).

---

<table>
  <tr>
    <td align="center"><strong>Trip Details & History</strong></td>
    <td align="center"><strong>Active Rides</strong></td>
  </tr>
  <tr>
    <td><img src="docs/trip_details.png" alt="Trip Details" width="400"/></td>
    <td><img src="docs/active_rides.png" alt="Active Rides" width="400"/></td>
  </tr>
</table>

> **My Trips**: Complete trip history with booking details, OTP codes, fare information, and status tracking (Booked → In Progress → Completed).  
> **Active Rides**: Real-time view of all currently active rides with passenger count and ride status.

---

### 💰 Payments & Wallet

<table>
  <tr>
    <td align="center"><strong>Digital Wallet</strong></td>
    <td align="center"><strong>Razorpay Payment Gateway</strong></td>
  </tr>
  <tr>
    <td><img src="docs/wallet.png" alt="Wallet" width="400"/></td>
    <td><img src="docs/rezor_pay.png" alt="Razorpay" width="400"/></td>
  </tr>
</table>

> **Wallet**: Sleek dark-themed balance card with quick recharge functionality. Full transaction history with color-coded entries (green for credits, red for debits).  
> **Razorpay**: Integrated payment gateway for secure wallet top-ups. Supports UPI, cards, net banking, and wallets with server-side signature verification.

---

<table>
  <tr>
    <td align="center"><strong>Payment History</strong></td>
    <td align="center"><strong>Saved Places</strong></td>
  </tr>
  <tr>
    <td><img src="docs/payment.png" alt="Payment History" width="400"/></td>
    <td><img src="docs/saved_places.png" alt="Saved Places" width="400"/></td>
  </tr>
</table>

> **Payments**: Detailed transaction log with type (Recharge/Deduction/Earning), timestamp, and payment method.  
> **Saved Places**: Save home, office, or frequently visited locations with name and address for one-tap ride searching.

---

### 📊 Analytics & Reporting

<table>
  <tr>
    <td align="center"><strong>Ride Analytics</strong></td>
    <td align="center"><strong>Vehicle Details</strong></td>
  </tr>
  <tr>
    <td><img src="docs/ride_anaysis.png" alt="Ride Analytics" width="400"/></td>
    <td><img src="docs/vehivle%20details.png" alt="Vehicle Details" width="400"/></td>
  </tr>
</table>

> **Analytics**: Personal ride analytics with key metrics — total trips, distance covered, fuel saved, and cost savings. Downloadable as a formatted PDF report via OpenPDF.  
> **Vehicle Details**: Comprehensive view of registered vehicle information with document verification status.

---

### 🛡️ Admin Panel

<table>
  <tr>
    <td align="center"><strong>Admin Dashboard</strong></td>
  </tr>
  <tr>
    <td><img src="docs/dashboard.png" alt="Admin Dashboard" width="800"/></td>
  </tr>
</table>

> Platform-wide analytics dashboard showing total trips, distance covered, estimated fuel savings, and total cost saved. Includes one-click **PDF export** for both platform analytics and system audit logs.

---

<table>
  <tr>
    <td align="center"><strong>Manage Users</strong></td>
    <td align="center"><strong>Platform Settings</strong></td>
  </tr>
  <tr>
    <td><img src="docs/admin_user_manage.png" alt="Manage Users" width="400"/></td>
    <td><img src="docs/setting_admin.png" alt="Platform Settings" width="400"/></td>
  </tr>
</table>

> **Manage Users**: Search, filter, and manage all registered employees with role assignment.  
> **Platform Settings**: Configure company-wide carpooling policies, ride limits, and platform behavior.

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate & receive JWT token |
| `POST` | `/api/auth/forgot-password` | Initiate password reset |
| `POST` | `/api/auth/reset-password` | Reset password with token |

### Rides
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/rides` | Publish a new ride |
| `GET` | `/api/rides/search` | Search available rides |
| `GET` | `/api/rides/my-rides` | Get logged-in driver's rides |
| `GET` | `/api/rides/{id}` | Get ride details |

### Trips
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/trips/book` | Book a trip on a ride |
| `GET` | `/api/trips/my-trips` | Get passenger's trip history |
| `PUT` | `/api/trips/{id}/cancel` | Cancel a booked trip |
| `PUT` | `/api/trips/{id}/start` | Start a trip (OTP verified) |
| `PUT` | `/api/trips/{id}/complete` | Complete a trip |

### Vehicles
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/vehicles` | Register a new vehicle |
| `GET` | `/api/vehicles/my-vehicles` | Get user's vehicles |
| `DELETE` | `/api/vehicles/{id}` | Remove a vehicle |

### Payments & Wallet
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payments/create-order` | Create Razorpay order |
| `POST` | `/api/payments/verify-razorpay` | Verify payment signature |
| `GET` | `/api/payments/wallet` | Get wallet balance |
| `POST` | `/api/payments/wallet/recharge` | Recharge wallet |
| `POST` | `/api/payments/trip/pay` | Pay for a trip |
| `GET` | `/api/payments/transactions` | Get transaction history |

### Chat (WebSocket)
| Protocol | Endpoint | Description |
|---|---|---|
| `WS` | `/ws` | WebSocket connection endpoint |
| `STOMP` | `/app/chat.send` | Send a chat message |
| `STOMP` | `/topic/ride/{id}` | Subscribe to ride chat room |

### Analytics & Audit
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/dashboard` | Get platform KPIs |
| `GET` | `/api/audit/report/pdf` | Download analytics PDF |
| `GET` | `/api/audit/audit-logs/pdf` | Download audit logs PDF |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/employees` | List all employees |
| `GET` | `/api/admin/stats` | Get admin statistics |

### Saved Locations
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/saved-locations` | Save a new location |
| `GET` | `/api/saved-locations` | Get user's saved locations |
| `DELETE` | `/api/saved-locations/{id}` | Delete a saved location |

### Tracking
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tracking/update` | Update driver location |
| `GET` | `/api/tracking/{rideId}` | Get ride tracking data |

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** (LTS)
- **Maven 3.9+**
- **Node.js 20+** & **npm 10+**
- **PostgreSQL 15+**
- **ClickHouse** (optional, for analytics)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/rideconnect-carpooling.git
cd rideconnect-carpooling
```

### 2. Database Setup

```sql
-- Create the PostgreSQL database
CREATE DATABASE carpooling_platform;
```

### 3. Backend Setup

```bash
cd backend

# Configure your database credentials in:
# src/main/resources/application.properties

# Build and run
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`. The `DatabaseSeeder` will automatically populate the database with 50+ demo records on first run.

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`.

### 5. Demo Credentials

| Role | Email | Password |
|---|---|---|
| Employee | `dev.trivedi@company.com` | `password123` |
| Admin | `admin@company.com` | `admin123` |

---

## ⚙️ Environment Configuration

### Backend (`application.properties`)

```properties
# Application
spring.application.name=Odoo-Hackathon
server.port=8080

# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/carpooling_platform
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA/Hibernate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true

# Razorpay (Test Keys)
razorpay.key.id=rzp_test_XXXXXXXXXXXXXXX
razorpay.key.secret=XXXXXXXXXXXXXXXXXXXXXXXXXX

# JWT
jwt.secret=your-256-bit-secret-key
jwt.expiration=86400000  # 24 hours

# ClickHouse (Optional)
clickhouse.url=jdbc:clickhouse://localhost:8123/default
clickhouse.username=default
clickhouse.password=
```

### Frontend (`services/api.js`)

The Axios base URL points to `http://localhost:8080/api` by default. Update if deploying to a different host.

---

## 🔐 Security Implementation

- **JWT-based stateless authentication** with configurable expiration
- **BCrypt password hashing** via Spring Security's `PasswordEncoder`
- **Role-based route protection** on both frontend (React Router guards) and backend (Spring Security filter chain)
- **CORS configuration** allowing frontend origin
- **Razorpay signature verification** for payment security (HMAC SHA256)
- **OTP verification** for trip start confirmation

---

## 📊 Analytics & Reporting

The platform features a dual-database analytics strategy:

1. **PostgreSQL** — Transactional data (OLTP) for real-time ride/trip/payment operations
2. **ClickHouse** — Analytical data (OLAP) for aggregated platform metrics and dashboards

PDF reports are generated server-side using **OpenPDF** and include:
- Platform-wide trip statistics
- Distance and fuel savings calculations
- Cost savings analysis
- System audit logs with timestamps

---

## 👥 Team

Built with ❤️ for the **Odoo Hackathon 2026 | Odoo × KSV**


---

<p align="center">
  <strong>⭐ Star this repository if you found it helpful!</strong>
</p>

<p align="center">
  <em>Built with Java 21 · Spring Boot 4.1 · React 19 · PostgreSQL · Razorpay · Leaflet</em>
</p>
