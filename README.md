# Equevu HR System

Equevu HR System is a minimal HR platform where candidates can **register** and **upload resumes**, while admins can **view and download resumes**.

## 🚀 Features

✅ Candidate Registration  
✅ Resume Upload (PDF/DOCX)  
✅ Admin Dashboard for Viewing Candidates  
✅ Secure Authentication for Admin  
✅ Pagination & Filtering  
✅ Dockerized Deployment

---

## 🏗 **Project Structure**

equevu-hr-system/
│── backend/ # FastAPI Backend (Python)
│ │── app/ # Application logic
│ │ │── api/ # API Routes
│ │ │── services/ # Business logic layer
│ │ │── schemas/ # Pydantic models for validation
│ │ │── db/ # Database configuration
│ │── main.py # Entry point for FastAPI
│ │── Dockerfile # Docker configuration for backend
│── frontend/ # Next.js Frontend (React, TypeScript)
│ │── src/
│ │ │── pages/ # Next.js pages
│ │ │── components/ # UI components
│ │ │── context/ # Context providers
│ │── Dockerfile # Docker configuration for frontend
│── docker-compose.yml # Docker configuration for full app
│── README.md # Documentation

## 🏗 **Running the project**

### **To run the backend, frontend, and database (PostgreSQL) all together using Docker Compose, use:**

```sh
docker-compose up --build # Building 

docker-compose up -d # Running
```