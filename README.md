# University Dormitory Placement System

## Project Description

The University Dormitory Placement System is a web-based application developed to automate and manage student dormitory assignments within a university. The system helps administrators efficiently allocate students to dormitory blocks and rooms based on predefined rules such as gender, department, and dorm capacity.

The application ensures that male and female students are assigned to separate blocks and that students from the same department are grouped together whenever possible. Each dorm room has a fixed capacity of six students. When a dorm reaches full capacity, the system automatically assigns students to the next available dorm.

Students can log in to the system to view their dormitory placement details, including their assigned block, dorm room, and roommates. Administrators can manage students, blocks, dormitories, placements, and reports through a secure dashboard.

## Features

### Administrator Features

* Secure Login Authentication
* Dashboard with Statistics
* Student Management (Add, Edit, Delete, View)
* Block Management
* Dorm Management
* Automatic Dormitory Placement
* Placement Reports
* Occupancy Monitoring
* Remove Individual Placements
* Clear All Placements for New Academic Year

### Student Features

* Secure Login
* View Profile Information
* View Dormitory Assignment
* View Assigned Block and Dorm
* View Roommates

## Placement Rules

1. Male and female students are assigned to separate blocks.
2. Students are grouped by department whenever possible.
3. Each dorm room accommodates a maximum of six students.
4. Once a dorm is full, students are assigned to the next available dorm.
5. Only active students are eligible for placement.

## Technology Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt Password Hashing

### Database

* MySQL

## System Modules

* Authentication Module
* Student Management Module
* Block Management Module
* Dorm Management Module
* Placement Management Module
* Student Portal Module
* Reporting Module

## Project Structure

### Frontend

* React Components
* Pages
* Services
* Context API
* Routes

### Backend

* Controllers
* Models
* Routes
* Middleware
* Services
* Utilities
* Database Migrations

## Installation

### Clone Repository

```bash
git clone (https://github.com/TadesseAsrie/university-d-placement-system)
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

1. Create a MySQL database.
2. Import migration files.
3. Configure the `.env` file.
4. Run the application.

## Default Roles

### Super Admin

* Full system access
* Create and manage administrators

### Admin

* Manage students, dorms, blocks, and placements

### Student

* View personal placement information

## Future Enhancements

* Excel Import and Export
* Email Notifications
* SMS Notifications
* PDF Reports
* Multi-Campus Support
* Mobile Application


