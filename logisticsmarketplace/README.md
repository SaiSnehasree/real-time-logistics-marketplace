# LogiFlow — Real-Time Logistics Marketplace

> A production-grade, full-stack logistics platform enabling shippers to publish freight loads, carriers to bid competitively, and operations teams to track shipments in real-time via WebSocket-powered GPS telemetry.

---

## ✨ Features

| Category | Feature |
|---|---|
| **Auth** | JWT-based login & registration with role-based access control |
| **Roles** | `SHIPPER` — create/manage shipments; `CARRIER` — browse & bid on loads |
| **Shipments** | Create, list, delete, and status-manage freight loads |
| **Marketplace** | Carriers browse all `AVAILABLE` shipments and place competitive bids |
| **Bidding** | Place, accept, and reject bids; auto-reject competing bids on acceptance |
| **Tracking** | Real-time GPS tracking via WebSocket/STOMP on a Leaflet map |
| **Notifications** | In-app push notifications via WebSocket; mark as read, mark all as read |
| **Dashboard** | Analytics KPIs: total shipments, available, in-transit, delivered |
| **Charts** | Recharts area chart showing lane volume vs. estimated revenue |
| **Security** | Input validation, JWT filter, method-level `@PreAuthorize`, CORS config |

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────┐
│                     React Frontend                    │
│  Vite · React Router · Tailwind CSS · Recharts        │
│  Leaflet · STOMP.js · SockJS · Axios                  │
└────────────────────────┬──────────────────────────────┘
                         │ HTTP REST (JWT Bearer)
                         │ WebSocket (STOMP over SockJS)
┌────────────────────────▼──────────────────────────────┐
│               Spring Boot Backend (v3.5)              │
│  Spring Security · Spring Data JPA · Spring WebSocket │
│  JWT (jjwt) · Hibernate · Lombok                      │
└────────────────────────┬──────────────────────────────┘
                         │ JDBC
┌────────────────────────▼──────────────────────────────┐
│               PostgreSQL Database                     │
│  Tables: users · shipments · bids ·                   │
│          shipment_locations · notifications           │
└───────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```sql
-- Users
users (id PK, name, email UNIQUE, password_hash, role)

-- Shipments
shipments (
  id PK,
  tracking_id UNIQUE,          -- indexed
  origin, destination, weight,
  status,                      -- AVAILABLE | AWAITING_PICKUP | IN_TRANSIT | DELIVERED
  shipper_id FK → users,       -- indexed
  carrier_id FK → users        -- indexed, nullable until bid accepted
)

-- Bids
bids (
  id PK,
  amount,
  status,                      -- PENDING | ACCEPTED | REJECTED
  shipment_id FK → shipments,  -- indexed
  carrier_id FK → users        -- indexed
)

-- Shipment Locations (GPS telemetry)
shipment_locations (
  id PK,
  tracking_id,                 -- indexed
  latitude, longitude,
  timestamp
)

-- Notifications
notifications (
  id PK,
  user_id FK → users,
  type,                        -- NEW_BID | BID_ACCEPTED | BID_REJECTED | ...
  message,
  reference_id,
  read BOOLEAN,
  created_at
)
```

---

## 🔐 JWT Authentication Flow

```
1. User submits email + password to POST /auth/login
2. Backend validates credentials, generates JWT (HS256, 24h expiry)
3. Frontend stores token in localStorage
4. All subsequent API requests include: Authorization: Bearer <token>
5. JwtAuthFilter intercepts requests, validates token, populates SecurityContext
6. @PreAuthorize annotations enforce role checks per endpoint
7. On 401 response, Axios interceptor clears localStorage → redirect /login
```

---

## 📡 WebSocket / Real-Time Flow

```
1. Frontend calls connectWebSocket() on page load (TrackingPage, NotificationsPage)
2. SockJS connects to /ws endpoint with JWT in STOMP headers
3. Subscriptions:
   • /topic/shipment/{trackingId}  → GPS location updates (TrackingPage)
   • /topic/notifications/{userId} → Notification push (NotificationsPage, Layout badge)
4. Carrier POSTs to /tracking/update → TrackingService broadcasts to topic
5. BidService & TrackingService send notifications via NotificationService
   → SimpMessagingTemplate.convertAndSend() to /topic/notifications/{userId}
6. React state updates immediately; map marker repositions in real time
```

---

## 🌐 API Reference

### Auth
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login, receive JWT |

### Shipments
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/shipments` | SHIPPER | Create shipment |
| GET | `/shipments/my` | SHIPPER, CARRIER | My shipments |
| GET | `/shipments/marketplace` | Any | Available loads |
| GET | `/shipments/analytics` | Any | Dashboard KPIs |
| PATCH | `/shipments/{id}/status` | SHIPPER, CARRIER | Update status |
| DELETE | `/shipments/{id}` | SHIPPER | Delete shipment |

### Bids
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/bids` | CARRIER | Place bid |
| GET | `/bids` | SHIPPER | All bids (filtered to own loads in UI) |
| GET | `/bids/my` | CARRIER | My submitted bids |
| POST | `/bids/{id}/accept` | SHIPPER | Accept bid, reject others |
| POST | `/bids/{id}/reject` | SHIPPER | Reject bid |

### Tracking
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/tracking/update` | CARRIER | Push GPS location update |
| GET | `/tracking/{trackingId}` | Any | Get latest location |

### Notifications
| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/notifications` | Auth | My notifications |
| GET | `/notifications/unread-count` | Auth | Unread badge count |
| PUT | `/notifications/{id}/read` | Auth | Mark one as read |
| PUT | `/notifications/read-all` | Auth | Mark all as read |

---

## 🚀 Installation & Running

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### 1. Database Setup
```sql
CREATE DATABASE logistics_db;
```

### 2. Backend Setup
```bash
# Clone the repository
cd logisticsmarketplace

# Copy and configure environment
# (or set environment variables directly)
cp .env.example .env   # edit DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET

# Run the backend
mvn spring-boot:run
# → Starts on http://localhost:8080
# → Hibernate auto-creates tables on first run (ddl-auto=update)
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Set VITE_API_URL=http://localhost:8080

# Start dev server
npm run dev
# → Starts on http://localhost:5173
```

### 4. Access the App
Open **http://localhost:5173** and register as a **SHIPPER** or **CARRIER**.

---

## 🔧 Environment Variables

### Frontend (`.env` in `frontend/`)
| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | Spring Boot backend URL |

### Backend (environment variables / `application.properties`)
| Variable | Default | Description |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/logistics_db` | PostgreSQL JDBC URL |
| `DB_USERNAME` | `postgres` | Database username |
| `DB_PASSWORD` | *(required)* | Database password |
| `JWT_SECRET` | *(default in dev)* | HS256 signing key (Base64) |
| `JWT_EXPIRATION_MS` | `86400000` | Token validity (ms) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Allowed frontend origins |

---

## 🧪 Running Tests

```bash
# Run all tests (unit + integration)
mvn clean test

# Run specific test class
mvn test -Dtest=BidServiceTest
mvn test -Dtest=ShipmentServiceTest
mvn test -Dtest=AuthServiceTest
```

**Test coverage:**
- `AuthServiceTest` — register (success, duplicate email, missing role)
- `ShipmentServiceTest` — create, list, delete (ownership check)
- `BidServiceTest` — place bid, duplicate bid guard, accept bid (ownership + status cascade)
- `LogisticsmarketplaceApplicationTests` — Spring context loads successfully

---

## 📦 Production Build

```bash
# Build frontend
cd frontend && npm run build
# → Outputs to frontend/dist/

# Build backend JAR
cd .. && mvn clean package -DskipTests
# → Outputs to target/logisticsmarketplace-0.0.1-SNAPSHOT.jar

# Run production JAR
java -jar target/logisticsmarketplace-0.0.1-SNAPSHOT.jar \
  --DB_URL=jdbc:postgresql://prod-host:5432/logistics_db \
  --DB_USERNAME=prod_user \
  --DB_PASSWORD=prod_password \
  --JWT_SECRET=your_production_secret \
  --CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 📐 Project Structure

```
logisticsmarketplace/
├── src/
│   ├── main/java/com/sneha/logisticsmarketplace/
│   │   ├── config/          # Security, CORS, WebSocket, JWT config
│   │   ├── controller/      # REST endpoints
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── entity/          # JPA entities
│   │   ├── exception/       # Custom exceptions + GlobalExceptionHandler
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── security/        # JwtUtil, JwtAuthFilter, UserDetailsService
│   │   ├── service/         # Business logic
│   │   └── websocket/       # LocationMessage DTO
│   └── test/                # Unit & integration tests
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout, ProtectedRoute, StatCard, AnalyticsChart
│   │   ├── pages/           # All page components
│   │   └── services/        # api.js (Axios) + websocket.js (STOMP)
│   ├── .env.example
│   └── package.json
└── pom.xml
```

---

## 🛡️ Security Notes

- Passwords are hashed with BCrypt before storage
- JWT is signed with HS256 using a configurable secret
- All protected endpoints require a valid Bearer token
- Role-based authorization is enforced both at the API layer (`@PreAuthorize`) and in the UI (route guards + conditional rendering)
- Token is automatically cleared from localStorage and the user is redirected to login on any 401 response

---

## 📝 License

MIT — built as part of the Infotact Internship project by Sai Snehasree.
