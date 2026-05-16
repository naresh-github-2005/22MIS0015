# Vehicle Maintenance Scheduler & Campus Notification System

## Overview

This project was developed as part of the backend evaluation task.

The project contains:

- Custom Logging Middleware
- Vehicle Maintenance Scheduler
- Priority Notification Inbox
- Notification System Design Documentation

The application integrates with protected APIs using Bearer Token authentication and follows modular backend architecture practices.

---

# Project Structure

22MIS0015/

├── logging_middleware/
│   └── logger.js

├── vehicle_maintenance_scheduler/
│   └── Solution.js

├── notification_app_be/
│   ├── priorityInbox.js
│   ├── server.js
│   └── package.json

├── screenshots/

├── notification_system_design.md
└── .gitignore

---

# Features

## 1. Logging Middleware

Reusable logging utility integrated with the provided logging API.

### Supported Features

- Centralized logging
- Error logging
- Info/debug logging
- API event tracking
- Protected API integration

---

## 2. Vehicle Maintenance Scheduler

Optimizes vehicle maintenance scheduling using a dynamic programming approach.

### Objective

- Maximize operational impact
- Stay within available mechanic-hours

### Algorithm Used

- 0/1 Knapsack Dynamic Programming

### Functionality

- Fetch depot data
- Fetch vehicle maintenance tasks
- Optimize task selection
- Return highest impact schedule

---

## 3. Priority Inbox

Ranks notifications based on:

### Priority Order

1. Placement
2. Result
3. Event

### Additional Logic

- Latest notifications prioritized first
- Top 10 notifications returned

---

# Technologies Used

- Node.js
- JavaScript
- Axios
- Dotenv

---

# Setup Instructions

## Install Dependencies

```bash
npm install
