# MediNex - SaaS-Based Outpatient Hospital Management System

## Introduction

MediNex is a SaaS-based hospital management system designed to help hospitals and clinics manage patients, staff, appointments, and medical records from a unified platform. The system supports multiple hospitals under a single platform (multi-tenant architecture), ensuring secure data isolation for each hospital.

### Purpose and Goals

- Simplify hospital administrative workflows by centralizing hospital operations
- Improve efficiency, data accuracy, and security in healthcare systems
- Provide a scalable SaaS platform for multiple hospitals and clinics
- Enhance patient care through structured medical history and appointment scheduling

---

## Problem Statement

Many hospitals and clinics still rely on manual processes or outdated systems, leading to:

- Missed or double-booked appointments
- Scattered or inaccessible patient records
- Lack of communication between doctors and staff
- Inefficient reporting and record-keeping
- No centralized system for outpatient management

MediNex solves these issues by providing a modern, scalable, and centralized SaaS solution.

---

## System Overview

MediNex is a SaaS (Software as a Service) platform that enables hospitals to manage outpatient operations efficiently in one system.

The system includes:

- Patient onboarding and registration
- Appointment scheduling system
- Medical history tracking
- Role-based access control (RBAC)
- Multi-hospital (multi-tenant) architecture

---

## Technology Stack

Frontend: Next.js + Tailwind CSS  
Backend: Node.js + Express  
Database: MySQL  
Authentication: JWT + Bcrypt.js  
Hosting: Vercel (Frontend) / Railway (Backend)

---

## Key Features

### 1. Owner Onboarding & Hospital Registration

- When a user logs in for the first time, they are prompted to register a hospital
- The Owner account is automatically assigned administrative privileges
- Owners can register and manage multiple hospitals under one account
- Easy switching between hospitals from the dashboard

Each hospital has isolated data including patients, staff, appointments, and records to ensure privacy and scalability.

---

### 2. Role & Permission Management (RBAC)

- Owners can create and manage roles such as Admin, Doctor, Receptionist, and Staff
- Each role has specific permissions (e.g., edit patients, manage appointments)
- Accessible from the Role Management section in the dashboard

This system ensures strict access control and security for all users.

---

### 3. User Management

- Owners can add and manage hospital users
- Each user is assigned a role with predefined permissions
- Users include doctors, staff, and admins
- Each user gets individual login credentials and dashboards

This ensures structured onboarding and controlled access.

---

### 4. Patient Registration & Management

Patient data is stored permanently for future visits.

Captured Information:
- Name, Age, Gender, Contact Details  
- CNIC, Guardian Information  
- Address and Emergency Contact  

This eliminates duplicate entries and improves record accuracy.

---

### 5. Doctor Availability Management

- Owners can define doctors’ schedules and availability
- Working days and time slots can be configured
- Prevents scheduling conflicts and double bookings

This ensures efficient appointment planning.

---

### 6. Appointment Scheduling System

- Staff can schedule appointments based on doctor availability
- View, reschedule, or cancel appointments
- Each appointment is linked to both patient and doctor
- Weekly overview available for doctors and owners

This system ensures smooth patient flow and time management.

---

### 7. Patient Medical History

Each patient has a complete medical record accessible to authorized users.

Stored Information:
- Past complaints
- Diagnoses
- Prescribed medicines

Doctors can review full history before consultation for accurate treatment.

---

## UI Screenshots

- https://drive.google.com/file/d/1K-k6wZSYUxTQgzfdCmaYa6OWUNEjrLFL/view?usp=drive_link  
- https://drive.google.com/file/d/1uxmjGbTgCsSFjUsdV50-vpi5Kw0gTbEe/view?usp=drive_link  

---

## Project Links

Frontend Repository: https://github.com/AymenAyub/Electronic-Health-Record  
Backend Repository: https://github.com/AymenAyub/Electronic-Health-Record-backend  
Live Project: https://electronic-health-record-otzo.vercel.app/  

Note: Backend is currently inactive due to Railway trial expiration.

---

## Future Improvements

- Cloud deployment for backend stability  
- Advanced analytics dashboard for hospitals  
- AI-based diagnosis suggestions  
- Notification system for appointments  


---

## License

This project is developed for educational and portfolio purposes.
