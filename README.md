# Real-Time Shipment Tracking Portal & Logistics Marketplace

## Overview

The Real-Time Shipment Tracking Portal & Logistics Marketplace is a full-stack logistics platform that connects shippers and carriers through a digital freight marketplace while providing real-time shipment visibility.

The platform allows shippers to post freight loads, carriers to submit competitive bids, and customers to track shipment movement through a live tracking dashboard powered by WebSockets.

This project is being developed as part of an internship program with a focus on scalable backend architecture, real-time communication, secure authentication, and modern full-stack development practices.

---

## Business Problem

The logistics industry often faces challenges such as:

* Limited visibility into shipment movement
* Manual freight brokering processes
* Inefficient carrier discovery
* Delayed shipment status updates
* Lack of real-time customer tracking

This platform addresses these issues by providing a centralized marketplace and a real-time tracking system.

---

## Key Features

### Freight Marketplace

* Shippers can create shipment requests
* Carriers can browse available shipments
* Carriers can submit bids for shipments
* Shippers can review and accept bids
* Automatic rejection of competing bids after selection

### Real-Time Shipment Tracking

* Simulated GPS location updates
* Live shipment tracking dashboard
* Real-time coordinate broadcasting using WebSockets
* Shipment status monitoring
* Delivery progress visibility

### Authentication & Security

* JWT-based authentication
* Role-based authorization
* Secure API endpoints
* Separate access control for:

  * Shippers
  * Carriers
  * Customers

---

## Technology Stack

### Backend

* Java 17+
* Spring Boot
* Spring Security
* Spring Data JPA
* JWT Authentication
* Spring WebSocket (STOMP)

### Frontend

* React.js
* Axios
* React Router
* Tailwind CSS

### Database

* PostgreSQL

### Real-Time Communication

* WebSockets
* STOMP Messaging Protocol

### Version Control

* Git
* GitHub

---

## System Roles

### Shipper

* Create shipment requests
* View received bids
* Award shipments to carriers
* Track shipment progress

### Carrier

* Browse available shipments
* Submit bids
* Manage assigned shipments
* Send tracking updates

### Customer

* Enter tracking ID
* View shipment location
* Monitor delivery status

---

## Planned Modules

### Phase 1

* Project Setup
* PostgreSQL Configuration
* Authentication System
* User Management

### Phase 2

* Shipment Management
* Freight Marketplace
* Bidding Engine

### Phase 3

* WebSocket Integration
* Live GPS Tracking
* Shipment Event Broadcasting

### Phase 4

* React Dashboard
* Interactive Map Integration
* End-to-End Testing

---

## Project Structure

```text
src/main/java/com/sneha/logisticsmarketplace

├── config
├── controller
├── dto
├── entity
├── repository
├── service
├── security
├── exception
├── websocket
└── LogisticsmarketplaceApplication
```

---

## Current Status

### Completed

* GitHub Repository Setup
* Spring Boot Project Initialization
* Maven Configuration
* Spring Security Setup
* WebSocket Dependency Integration
* Initial Project Structure

### In Progress

* PostgreSQL Database Setup
* Entity Design
* Authentication Module

---

## Future Enhancements

* ETA Prediction
* Email Notifications
* SMS Alerts
* Carrier Rating System
* Route Optimization
* Analytics Dashboard
* Containerized Deployment using Docker

---

## Author

**M. Sai Sneha Sree**

Integrated M.Tech Software Engineering
VIT-AP University

---

## License

This project is developed for educational and internship purposes.
