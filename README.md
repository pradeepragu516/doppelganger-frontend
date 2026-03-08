# Smart Maintenance System - Role-Based Industrial Monitoring Platform

## Overview
A production-grade React frontend for AI-powered predictive maintenance in manufacturing plants with three distinct user roles.

## Features
- ✅ **Role-Based Authentication** - Three completely different dashboards
- ✅ **Real-Time Sensor Simulation** - Automatic data updates every 5 seconds
- ✅ **Anomaly Detection Engine** - Automatic threshold monitoring
- ✅ **Maintenance Request Workflow** - Complete lifecycle tracking
- ✅ **Data-Driven Analytics** - Charts using Chart.js
- ✅ **Professional Industrial UI** - Dark theme monitoring console

## User Roles & Access

### 1. ADMIN (Plant Control Center)
**Login:** `admin@factory.com` / any password

**Dashboard:** `/admin/dashboard`

**Capabilities:**
- Monitor all machines in the plant
- View global anomaly detection logs
- Assign maintenance tasks to technicians
- Analyze machine health and anomaly trends
- Manage system users
- View system performance metrics

**Pages:**
- Dashboard - Fleet overview, technician workload, system events
- Machine Monitor - Grid view of all machines
- Maintenance Requests - Assign and track all requests
- Analytics - Temperature, vibration, anomaly frequency charts
- User Management - View all system users

**Sidebar Menu:**
- Dashboard
- Machine Monitor
- Maintenance Requests
- Analytics
- User Management

---

### 2. MAINTENANCE TECHNICIAN (Field Console)
**Login:** `tech@factory.com` / any password

**Dashboard:** `/maintenance/dashboard`

**Capabilities:**
- View maintenance requests assigned to them
- See machine fault diagnostics
- Update repair status (Pending → In Progress → Resolved)
- Add repair notes and parts replaced
- Mark requests as resolved

**Pages:**
- Dashboard - Urgent tasks, critical alerts, machine diagnostics
- Assigned Requests - Tasks assigned to this technician
- Update Status - Update repair progress and notes

**Sidebar Menu:**
- Dashboard
- Assigned Requests

**Restrictions:**
- ❌ Cannot see admin analytics
- ❌ Cannot see user management
- ❌ Cannot see global machine fleet

---

### 3. OPERATOR (Machine Operator)
**Login:** `operator@factory.com` / any password

**Dashboard:** `/operator/dashboard`

**Capabilities:**
- View machine status overview
- Submit issue reports for machines
- Track submitted maintenance requests
- See machine alerts (Critical/Warning)

**Pages:**
- Dashboard - Machine status, alerts, statistics
- Report Issue - Submit maintenance request form
- My Requests - Track personal reported issues

**Sidebar Menu:**
- Dashboard
- Report Issue
- My Requests

**Restrictions:**
- ❌ Cannot see admin controls
- ❌ Cannot see technician tools
- ❌ Cannot update maintenance requests

---

## Installation

```bash
cd client
npm install
```

## Run Development Server

```bash
npm run dev
```

Application opens at `http://localhost:3000`

---

## Testing Role-Based Access

### Test Admin Access:
1. Go to `http://localhost:3000/login`
2. Enter email: `admin@factory.com`
3. Enter any password
4. Click Login
5. **Expected:** Redirected to `/admin/dashboard`
6. **Verify:** Sidebar shows Admin menu (Dashboard, Machine Monitor, Maintenance Requests, Analytics, User Management)

### Test Technician Access:
1. Logout (if logged in)
2. Go to `http://localhost:3000/login`
3. Enter email: `tech@factory.com`
4. Enter any password
5. Click Login
6. **Expected:** Redirected to `/maintenance/dashboard`
7. **Verify:** Sidebar shows Maintenance menu (Dashboard, Assigned Requests)

### Test Operator Access:
1. Logout (if logged in)
2. Go to `http://localhost:3000/login`
3. Enter email: `operator@factory.com`
4. Enter any password
5. Click Login
6. **Expected:** Redirected to `/operator/dashboard`
7. **Verify:** Sidebar shows Operator menu (Dashboard, Report Issue, My Requests)

---

## Maintenance Request Workflow

### Complete Lifecycle:

1. **Anomaly Detected** (Automatic)
   - System detects sensor threshold violation
   - Anomaly event created
   - If Critical → Maintenance request auto-generated

2. **OR User Reports Issue** (Manual)
   - Operator submits issue via Report Issue form
   - Maintenance request created
   - Appears in Admin dashboard

3. **Admin Assigns Technician**
   - Admin views request in Maintenance Requests page
   - System auto-assigns to random technician

4. **Technician Repairs**
   - Technician sees request in Assigned Requests
   - Updates status to "In Progress"
   - Adds repair notes and parts replaced

5. **Request Resolved**
   - Technician marks as "Resolved"
   - Request removed from active queue
   - Visible in history

---

## Real-Time Features

### Automatic Sensor Simulation
- Sensors update every 5 seconds
- Temperature: 55-95°C
- Pressure: 75-110 PSI
- Vibration: 1.5-7 mm/s

### Anomaly Detection Thresholds
- **Temperature > 80°C** → Triggers anomaly
- **Pressure > 100 PSI** → Triggers anomaly
- **Vibration > 5 mm/s** → Triggers anomaly

### Severity Levels
- **Normal:** Score 0.0 - 0.6
- **Warning:** Score 0.6 - 0.8 (Alert sent)
- **Critical:** Score 0.8 - 1.0 (Maintenance request created)

---

## Project Structure

```
client/src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   ├── Sidebar.jsx         # Role-based sidebar menu
│   ├── MachineCard.jsx     # Machine display card
│   ├── AlertCard.jsx       # Alert notification card
│   ├── ChartPanel.jsx      # Chart.js wrapper
│   ├── RequestTable.jsx    # Maintenance request table
│   ├── SensorInputForm.jsx # Manual sensor update form
│   └── HealthIndicator.jsx # Machine health bar
│
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   │
│   ├── admin/
│   │   ├── AdminDashboard.jsx       # Plant control center
│   │   ├── MachineMonitor.jsx       # All machines grid
│   │   ├── MachineDetails.jsx       # Single machine analytics
│   │   ├── AnomalyMonitor.jsx       # Anomaly event log
│   │   ├── MaintenanceRequests.jsx  # Request management
│   │   ├── Analytics.jsx            # Charts and analytics
│   │   ├── UserManagement.jsx       # User list
│   │   └── AddMachine.jsx           # Add new machine
│   │
│   ├── maintenance/
│   │   ├── MaintenanceDashboard.jsx # Technician console
│   │   ├── AssignedRequests.jsx     # Assigned tasks
│   │   └── UpdateStatus.jsx         # Update repair status
│   │
│   └── operator/
│       ├── OperatorDashboard.jsx    # Operator console
│       ├── ReportIssue.jsx          # Issue report form
│       └── MyRequests.jsx           # Personal requests
│
├── context/
│   ├── AuthContext.jsx      # Authentication state
│   └── MachineContext.jsx   # Machine data & simulation
│
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── anomalyService.js
│   ├── machineService.js
│   └── requestService.js
│
├── utils/
│   └── helpers.js
│
├── App.jsx                  # Route configuration
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

---

## Key Features by Role

### Admin Features:
✅ Fleet health overview
✅ Machine status breakdown
✅ Technician workload distribution
✅ System event stream
✅ Temperature & vibration charts
✅ Anomaly frequency analysis
✅ User management

### Technician Features:
✅ Task-focused dashboard
✅ Urgent tasks list
✅ Critical machine alerts
✅ Machine diagnostics
✅ Repair status updates
✅ Parts tracking
✅ Repair notes

### Operator Features:
✅ Machine status overview
✅ Issue reporting form
✅ Request tracking
✅ Machine alerts
✅ Personal request history

---

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router v6** - Routing
- **Context API** - State management
- **Chart.js** - Data visualization
- **CSS3** - Styling (Dark industrial theme)

---

## Design Theme

- **Background:** #0f1115
- **Cards:** #1b1f2a
- **Accent:** #00d4ff (Cyan/Electric Blue)
- **Warning:** #ffaa00 (Amber)
- **Critical:** #ff3366 (Red)
- **Success:** #00ff88 (Green)

---

## Troubleshooting

### Issue: All users see the same dashboard
**Solution:** Check login email format
- Admin: Must contain "admin"
- Technician: Must contain "tech" or "maintenance"
- Operator: Any other email

### Issue: Sidebar menu not changing
**Solution:** Verify user role in AuthContext
- Check localStorage for user data
- Ensure role is correctly set

### Issue: Charts not displaying
**Solution:** Ensure Chart.js is installed
```bash
npm install chart.js react-chartjs-2
```

---

## Demo Workflow

1. **Login as Admin** (`admin@factory.com`)
   - View plant overview
   - See all 12 machines
   - Check anomaly frequency chart
   - View technician workload

2. **Add New Machine**
   - Go to Machine Monitor
   - Click "Add Machine"
   - Enter sensor values
   - Watch anomaly detection

3. **Login as Operator** (`operator@factory.com`)
   - View machine status
   - Click "Report Issue"
   - Submit maintenance request
   - Track in "My Requests"

4. **Login as Technician** (`tech@factory.com`)
   - See assigned requests
   - Click "Update" on request
   - Change status to "In Progress"
   - Add repair notes
   - Mark as "Resolved"

---

## Support

For issues or questions, check:
- Role-based routing in `App.jsx`
- Login logic in `LoginPage.jsx`
- Sidebar menu in `Sidebar.jsx`
- User context in `AuthContext.jsx`
