# MediNex - SaaS-Based Outpatient Hospital Management System (Frontend)

## Introduction

This is the frontend of **MediNex**, a SaaS-based outpatient hospital management system designed to help hospitals and clinics manage patients, staff, and appointments from a unified platform.

The system supports multiple hospitals under a single platform (multi-tenant architecture), ensuring secure data isolation for each hospital. This frontend interacts with a backend REST API to provide a complete hospital management experience.

### Purpose and Goals

- Provide a clean and responsive interface for hospital operations  
- Simplify hospital workflows through centralized UI dashboards  
- Support role-based access views for different users  
- Enable smooth interaction with backend APIs  
- Improve usability and accessibility for healthcare staff  

## Problem Statement

Many hospitals still rely on manual or outdated systems, leading to:

- Missed or double-booked appointments  
- Scattered patient records  
- Lack of coordination between staff and doctors  
- Inefficient data handling  

This project solves these issues by providing a structured and intuitive interface for managing hospital operations.

## System Overview

This frontend is part of the MediNex SaaS platform and includes:

- Patient onboarding UI  
- Appointment scheduling interface  
- Medical history visualization  
- Role-based dashboards  
- Multi-hospital switching interface  

## Technology Stack

Frontend: Next.js + Tailwind CSS  
Backend API: Node.js + Express  
Database: MySQL  
Authentication: JWT + Bcrypt.js  
Hosting: Vercel (Frontend) / Railway (Backend API)

## Key Features

### 1. Owner Onboarding & Hospital Registration UI
- Interface for registering hospitals  
- Multi-hospital switching dashboard  
- Owner-level administrative UI controls  

### 2. Role-Based Dashboards (RBAC UI)
- Separate views for Admin, Doctor, Receptionist, and Staff  
- UI adapts based on user permissions  
- Secure navigation and access control  

### 3. User Management Interface
- Add and manage hospital users  
- Assign roles to users  
- View staff and doctor lists  

### 4. Patient Management UI
- Register new patients  
- View and update patient information  
- Maintain structured patient records  

### 5. Doctor Availability UI
- Visual scheduling interface for doctor availability  
- Working days and time slots configuration view  

### 6. Appointment Scheduling Interface
- Schedule, reschedule, and cancel appointments  
- Calendar-based appointment view  
- Link appointments with patients and doctors  

### 7. Patient Medical History UI
- View patient medical history  
- Display past diagnoses and prescriptions  
- Easy access for doctors during consultation  

## UI Screenshots

- https://drive.google.com/file/d/1K-k6wZSYUxTQgzfdCmaYa6OWUNEjrLFL/view?usp=drive_link  
- https://drive.google.com/file/d/1uxmjGbTgCsSFjUsdV50-vpi5Kw0gTbEe/view?usp=drive_link  

## Project Links

Frontend Repository: https://github.com/AymenAyub/Electronic-Health-Record  
Backend Repository: https://github.com/AymenAyub/Electronic-Health-Record-backend  
Live Project: https://electronic-health-record-otzo.vercel.app/  

Note: Backend is currently inactive due to Railway trial expiration.

## Future Improvements

- Real-time notifications for appointments  
- Advanced analytics dashboard  
- Mobile application support  
- Offline mode for clinics  

## License

This project is for educational and portfolio purposes.
