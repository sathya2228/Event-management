# 🎉 Event Hive – Event Management System

A full-stack web application for creating, managing, and viewing events. Built with **React** for the frontend and **Django REST Framework** for the backend.

---

## 🚀 Features

### 🔐 User Authentication
- Signup and login with email & password
- JWT token-based authentication

### 📅 Event Management
- Create new events
- View list of all events
- Event details with title, venue, description, image, cost, time, and date

---

## 🖥️ Tech Stack

### Frontend
- React (Vite)
- Axios
- React Router
- Tailwind CSS

### Backend
- Django
- Django REST Framework
- djoser (for auth)
- SQLite (default DB)

---

## 📦 Setup Instructions

### 🔧 Backend (Django)

#Step 3: Clone the repo:

   ```bash
   git clone https://github.com/sathya2228/Event-management.git
   cd event-hive/backend

# Step 2: Create a virtual environment
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Apply migrations
python manage.py makemigrations
python manage.py migrate

# Step 5: Create a superuser (optional for admin)
python manage.py createsuperuser

# Step 6: Run the backend server
python manage.py runserver


### 🔧 Frontend(React)

# Step 1: Go to frontend directory
cd ../frontend

# Step 2: Install dependencies
npm install

# Step 3: Start the frontend development server
npm run dev
