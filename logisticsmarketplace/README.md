# LogiFlow 🚚

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18%2B-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **LogiFlow** is a premium, enterprise-ready real-time logistics marketplace and shipment control tower dashboard. The platform connects shippers, carriers, and dispatchers through a dual-sided freight exchange, offering interactive Leaflet maps, WebSockets-powered driver telemetry feeds, and SLA alert tracking.

---

## 📖 Overview

Logistics dispatchers and cargo managers frequently struggle with fragmented dispatch tools, lack of live driver tracking, and manual rate negotiations.

**LogiFlow solves this by serving as a unified Logistics Control Tower:**
* **Shippers** publish freight requirements (weight, source, destination, cargo classification) to a public marketplace exchange.
* **Carriers** bid competitively on published lanes with real-time rate comparisons.
* **Dispatchers** supervise live fleet telemetry (coordinate tracking, velocity updates, route deviations, and ETA probability scores) via an interactive control tower.

---

## 🛠️ Key Features

* **Control Tower HUD:** Full-bleed interactive maps powered by Leaflet, displaying live coordinate tracking, pulsing markers, and custom dark mode tiles.
* **Real-Time Telemetry Feed:** WebSocket (STOMP) message broker delivering driver GPS coordinates, velocity changes, and route compliance details.
* **Freight Exchange Marketplace:** Double-sided bidding queue featuring priority classifications (*Expedited*, *Hot Load*, *Standard*) and bidder metrics.
* **Operations Dashboard:** Aggregated logistics KPIs including On-Time Delivery (OTD%), capacity metrics, delayed shipments, and lane spending trends.
* **SLA Compliance Monitor:** Geo-fencing alerts warning dispatchers of path deviations or drop-offs in ETA confidence.
* **Secure Operations:** Stateless authentication via JWT and multi-role access control (Shipper, Carrier, Dispatcher).

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Dispatcher / Carrier / Shipper]) -->|HTTPS / WSS| FE[React SPA - Leaflet + Recharts]
    subgraph Spring Boot Application
        FE -->|REST API| Sec[Spring Security / JWT Filter]
        FE -->|WebSocket Conn| STOMP[Spring WebSockets Broker - STOMP]
        Sec --> Ctrl[Logistics Controller Layers]
        STOMP --> Telem[Driver Telemetry Service]
        Ctrl --> Srv[Business Services]
    end
    subgraph Data Tier
        Srv --> DB[(PostgreSQL Database)]
        Telem --> DB
    end
```

---

## 🗄️ Database Design

```mermaid
erDiagram
    USERS {
        Long id PK
        String name
        String email
        String password
        String role
    }
    SHIPMENTS {
        Long id PK
        String origin
        String destination
        Double weight
        String status
        String priority
        Long shipper_id FK
    }
    BIDS {
        Long id PK
        Double amount
        String status
        Long shipment_id FK
        Long carrier_id FK
    }
    TRACKING_EVENTS {
        Long id PK
        Double latitude
        Double longitude
        Double speed
        String status
        Timestamp timestamp
        Long shipment_id FK
    }

    USERS ||--o{ SHIPMENTS : "posts"
    SHIPMENTS ||--o{ BIDS : "attracts"
    USERS ||--o{ BIDS : "submits"
    SHIPMENTS ||--o{ TRACKING_EVENTS : "tracks"
```

---

## 🔄 Application Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Shipper as Shippers (SLA Mgr)
    actor Carrier as Carriers (Fleet)
    participant Sys as LogiFlow Core
    actor Driver as Driver Mobile App
    actor Dispatcher as Control Tower HUD

    Shipper->>Sys: Publish Freight Load (Origin -> Destination)
    Carrier->>Sys: Submit Competitive Bid (₹ Rate & SLA details)
    Shipper->>Sys: Award Lane / Accept Carrier Bid
    Sys->>Driver: Dispatch Route & Trigger Start Check-in
    loop Live Tracking
        Driver->>Sys: Stream GPS coordinates & speed (WSS/STOMP)
        Sys->>Dispatcher: Update Map view, velocity & path alerts
    end
    Driver->>Sys: Complete Terminal Delivery
    Sys->>Shipper: Archive Load & Log SLA Compliance
```

---

## 💻 Tech Stack

### Frontend Architecture
| Layer | Core Tool | Utilization |
|---|---|---|
| **View Layer** | React.js (v18+) | Declarative UI, state hooks, split-pane routing maps. |
| **Styling** | Tailwind CSS (v4) | Premium layouts, dark-mode styling controls, custom fonts. |
| **Telemetry Map** | Leaflet Maps | GPS coordinate paths, geofences, pulsed indicators. |
| **Analytics** | Recharts | Area charts, fuel index indices, lane volume distribution. |
| **HTTP client** | Axios | Axios instance configurations with Authorization headers. |

### Backend Architecture
| Layer | Core Tool | Utilization |
|---|---|---|
| **Base Engine** | Spring Boot (3.x) | Core application controller frameworks and REST endpoints. |
| **Security** | Spring Security & JWT | Stateless filter validations, role checks. |
| **Data Access** | Spring Data JPA | Relational database mapping, transactional query configurations. |
| **Real-Time** | Spring WebSockets | STOMP message channel broker for live telemetry coordinates. |
| **Persistence** | PostgreSQL | Enterprise relational tables and indices. |

---

## 🌐 API Highlights

### Authentication & Core Dispatch
```http
POST /api/auth/register    --> Register a new system account
POST /api/auth/login       --> Verify credentials and generate JWT token
```

### Shipment Lane Exchange
```http
GET  /api/shipments            --> List active shipment lanes
POST /api/shipments            --> Publish a new shipment lane
DELETE /api/shipments/{id}     --> Cancel/Remove shipment lane from exchange
GET  /api/shipments/analytics  --> Generate dashboard telemetry analytics
```

### Bidding Interface
```http
GET  /api/bids                 --> View active carrier bids
POST /api/bids                 --> Submit rate offer on shipment lane
```

---

## 📡 WebSocket Telemetry Architecture

Driver location coordinate updates are sent to `/app/driver/telemetry` which gets processed by the Spring WebSocket broker and broadcast to dispatcher screens watching `/topic/shipments/{id}/route`.

```mermaid
sequenceDiagram
    Driver Mobile->>Spring Broker: SEND /app/driver/telemetry {lat, lng, speed}
    Spring Broker->>Telemetry Service: Parse telemetry values & verify geofence
    alt Route Deviation Detected
        Telemetry Service->>Spring Broker: Trigger alert routing
    end
    Telemetry Service->>Dispatcher HUD: Broadcast /topic/shipments/2/route {lat, lng, speed, deviation: true}
```

---

## 📂 Project Structure

```text
logisticsmarketplace/
├── src/                          # Spring Boot Backend Code
│   ├── main/
│   │   ├── java/com/logiflow/    # Java packages (Controller, Services, Entities)
│   │   └── resources/
│   │       └── application.yml   # Database & Secret properties
├── frontend/                     # React Frontend Application
│   ├── src/
│   │   ├── assets/               # Brand illustrations and static images
│   │   ├── components/           # Reusable components (Layout, StatCard, Chart)
│   │   ├── pages/                # Page views (Dashboard, Bids, Tracking, Auth)
│   │   ├── services/             # Axios API connection endpoints
│   │   ├── App.jsx               # Application routes configuration
│   │   ├── index.css             # Main styling, Leaflet filters, keyframes
│   │   └── main.jsx              # DOM render point
│   ├── package.json              # Dependecy definitions
│   └── vite.config.js            # Build script configurations
├── README.md                     # Documentation file
└── pom.xml                       # Maven Build XML Configuration
```

---

## 🚀 Installation Guide

### Prerequisite Checks
* Java Development Kit (JDK) 17+ installed.
* Node.js (v18+) and npm installed.
* PostgreSQL database instance running locally on port 5432.

### Step 1: PostgreSQL Setup
Create a new database named `logistics_marketplace`:
```sql
CREATE DATABASE logistics_marketplace;
```

### Step 2: Configure Environment
Open `src/main/resources/application.properties` (or `application.yml`) and adjust database parameters:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/logistics_marketplace
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password

# Authentication Setup
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000
```

### Step 3: Run Backend Service
Build and boot the Spring application:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

### Step 4: Run React Frontend
Navigate to the frontend directory, install dependency libraries, and start the Vite local dev server:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` on browser to access the control tower.

---

## 🔮 Future Enhancements

* **Route Optimization Engine:** Integrate OSRM (Open Source Routing Machine) to calculate transit pathways dynamically.
* **SMS Dispatch Alerting:** Integrate Twilio to send automatic delay warnings to shippers and cargo receivers.
* **Proof of Delivery (PoD) Signatures:** Upload signed terminal receipts to AWS S3 buckets to automate checkout processes.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
