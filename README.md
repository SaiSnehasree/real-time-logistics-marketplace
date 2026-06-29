# Real-Time Shipment Tracking Portal & Logistics Marketplace

## Overview

The Real-Time Shipment Tracking Portal & Logistics Marketplace is a full-stack web application designed to streamline logistics operations by providing shipment management, carrier bidding, shipment tracking, and analytics through a centralized platform.

The system enables shippers to manage freight loads, carriers to participate in transportation opportunities, and administrators to monitor logistics activities through an interactive dashboard.

Developed using Spring Boot, React.js, and PostgreSQL, the platform demonstrates modern full-stack development practices, secure authentication mechanisms, and scalable application architecture.

---

## Problem Statement

The logistics and freight industry often faces several operational challenges, including:

* Limited visibility into shipment progress
* Inefficient freight management processes
* Lack of centralized shipment monitoring
* Difficulty in managing carrier participation
* Delayed operational insights and reporting

This project addresses these challenges by providing a unified platform for shipment management, tracking, and logistics analytics.

---

## Key Features

### Authentication & Security

* User Registration and Login
* JWT-Based Authentication
* Protected Routes
* Secure Password Encryption
* Spring Security Integration

### Shipment Management

* Create Shipments
* View Shipment Details
* Search Shipments
* Delete Shipments
* Shipment Status Monitoring

### Carrier Bidding Marketplace

* View Carrier Bids
* Monitor Bid Status
* Marketplace Overview Dashboard
* Shipment-Bid Association Management

### Tracking Portal

* Shipment Progress Visualization
* Interactive Map Integration
* Status-Based Tracking Dashboard
* Activity Timeline Monitoring

### Analytics Dashboard

* Shipment Statistics
* Status Distribution Analysis
* Operational Insights
* Logistics Performance Overview

---

## Technology Stack

### Backend

* Java 17+
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* JWT Authentication

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* Recharts
* React Leaflet

### Database

* PostgreSQL

### Development Tools

* Git
* GitHub
* IntelliJ IDEA
* VS Code
* Postman

---

## System Architecture

```text
Frontend (React.js)
        |
        v
REST APIs (Spring Boot)
        |
        v
Service Layer
        |
        v
Spring Data JPA
        |
        v
PostgreSQL Database
```

---

## User Roles

### Shipper

* Manage shipment records
* Monitor shipment progress
* Review shipment information

### Carrier

* Participate in shipment bidding
* View shipment opportunities
* Track assigned shipments

### Administrator

* Monitor logistics operations
* Access analytics dashboard
* Manage overall platform activities

---

## Project Structure

```text
real-time-logistics-marketplace/

├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   └── assets
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   ├── security
│   └── config
│
└── README.md
```

---

## Implemented Modules

| Module                 | Status    |
| ---------------------- | --------- |
| Authentication System  | Completed |
| JWT Security           | Completed |
| Shipment Management    | Completed |
| Carrier Bidding Module | Completed |
| Dashboard Analytics    | Completed |
| Tracking Portal        | Completed |
| PostgreSQL Integration | Completed |
| Interactive Maps       | Completed |

---

## Application Screens

* Login Page
* Registration Page
* Dashboard
* Shipments Module
* Bids Module
* Tracking Portal
* Analytics Dashboard

---

## Learning Outcomes

This project provided practical experience in:

* Full Stack Web Development
* REST API Development
* Spring Security and JWT Authentication
* Database Design and Integration
* React Component Architecture
* Logistics Domain Modeling
* Dashboard and Analytics Development
* Version Control using Git and GitHub

---

## Future Enhancements

* Real-Time WebSocket Tracking
* Live GPS Location Updates
* Bid Acceptance and Rejection Workflow
* Notification System
* Email Alerts
* Advanced Analytics
* Cloud Deployment
* Microservices Architecture

---

## Author

**M. Sai Sneha Sree**

---

## License

This project was developed for academic and internship learning purposes.
