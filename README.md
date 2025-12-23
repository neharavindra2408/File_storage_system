# 📁 File Storage System (Full Stack Project)

A secure file storage web application built using **Flask (Python)** and **MySQL**, featuring **JWT authentication**, file upload/download/delete functionality, and a basic frontend.  
This project was developed step-by-step with deployment readiness in mind.

---

## 🚀 Features

- User Registration & Login
- JWT-based Authentication
- Secure File Upload
- List Uploaded Files
- Download Files
- Delete Files
- Protected Routes (Unauthorized access blocked)
- Frontend + Backend integration
- Environment-based configuration
- Deployment-ready structure

---

## 🛠 Tech Stack

### Backend
- Python
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- MySQL
- PyMySQL
- Bcrypt
- Python-dotenv

### Frontend
- HTML
- CSS
- JavaScript (Fetch API)

### Tools
- Postman (API testing)
- Git & GitHub

---

## 📂 Project Structure

File_storage_system/
├── backend/
│ ├── app.py
│ ├── config.py
│ ├── .env # ignored
│ ├── routes/
│ │ ├── auth_routes.py
│ │ └── file_routes.py
│ ├── database/
│ │ └── models.py
│ ├── utils/
│ │ └── errors.py
│ ├── uploads/ # ignored
│ ├── requirements.txt
│ └── .gitignore
│
├── frontend/
│ ├── index.html
│ ├── login.html
│ ├── register.html
│ ├── dashboard.html
│ ├── css/
│ │ └── style.css
│ └── js/
│ ├── auth.js
│ └── files.js
│
└── README.md

## ⚙️ Environment Setup

### 1️⃣ Clone the repository
```bash
git clone <your-repo-url>
cd File_storage_system

### 2️⃣ Backend setup
### Create virtual environment
python -m venv venv
venv\Scripts\activate   # Windows

### Install dependencies
pip install -r requirements.txt

### 3️⃣ Configure environment variables

# Create a .env file inside backend/:

FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
DB_NAME=file_storage
### ⚠️ .env is ignored and should never be committed.

### 4️⃣ Database setup (MySQL)
CREATE DATABASE file_storage;

### 5️⃣ Run the backend
cd backend
python app.py

# Backend runs at:
http://127.0.0.1:5000

### 6️⃣ Run the frontend

Use Live Server or open HTML files directly:

frontend/login.html

### 🔒 Security Features
Password hashing using Bcrypt
JWT authentication
Token expiry handling
Protected routes
Secrets stored in environment variables

🌍 Deployment

The project is structured for deployment on AWS:

Backend → EC2 (Flask + Gunicorn + Nginx)

Database → MySQL (EC2 or RDS)

Frontend → EC2 or S3 (static hosting)

Deployment steps are planned separately.

📌 Future Enhancements
File size validation
User roles
File sharing
Move uploads to AWS S3
UI improvements
Pagination for file listing

👩‍💻 Author
Neha Ravindra
Beginner-to-intermediate full stack project built for learning and portfolio purposes.

⭐ Notes
This project is beginner-friendly but follows real-world backend practices, making it suitable for:
Resume projects
Internship preparation
Backend learning
Deployment practice