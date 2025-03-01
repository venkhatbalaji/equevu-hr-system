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

equevu-hr-system/ │── backend/ # FastAPI Backend (Python) │ │── app/ │ │── db/ │ │── services/ │ │── schemas/ │ │── main.py │ │── Dockerfile │── frontend/ # Next.js Frontend (React, TypeScript) │ │── src/ │ │── pages/ │ │── components/ │ │── context/ │ │── Dockerfile │── docker-compose.yml # Docker configuration for full app │── README.md

---

## 🚀 **1. Running Locally**

### **Backend (FastAPI + PostgreSQL)**

```sh
cd backend
python -m venv venv   # Create Virtual Environment
source venv/bin/activate  # (On Windows, use: venv\Scripts\activate)
pip install -r requirements.txt  # Install dependencies
python main.py --reload  # Run FastAPI server
```
