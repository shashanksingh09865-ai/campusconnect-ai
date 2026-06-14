# CampusConnect AI

A modern campus management backend built using FastAPI, SQLAlchemy, JWT Authentication, and SQLite. This project is designed to help students and administrators manage campus activities through a centralized platform.

## Features

### Authentication System

* User Registration
* User Login
* Password Hashing using Bcrypt
* JWT Token Authentication

### Notice Board

* Create Notices
* View All Notices
* Database Storage

### Notes Management

* Add Study Notes
* View Notes
* Organized by Subject

### Dashboard API

* Latest Notices
* Latest Notes
* Centralized Dashboard Endpoint

## Tech Stack

### Backend

* FastAPI
* Python

### Database

* SQLite
* SQLAlchemy ORM

### Authentication

* JWT (JSON Web Tokens)
* Passlib (Bcrypt)

### Version Control

* Git
* GitHub

---

## Project Structure

```text
campusconnect-ai/
│
├── auth/
│   └── auth_handler.py
│
├── database/
│   ├── database.py
│   └── session.py
│
├── models/
│   ├── user.py
│   ├── notice.py
│   └── notes.py
│
├── routes/
│   ├── users.py
│   ├── notice.py
│   ├── notes.py
│   └── dashboard.py
│
├── main.py
├── requirements.txt
├── .gitignore
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/shashanksingh09865-ai/campusconnect-ai.git
cd campusconnect-ai
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

Windows:

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Project

```bash
python -m uvicorn main:app --reload
```

---

## API Documentation

After starting the server:

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

---

## Current APIs

### Authentication

* POST /register
* POST /login

### Notice Board

* POST /notice
* GET /notices

### Notes

* POST /notes
* GET /notes

### Dashboard

* GET /dashboard

---

## Future Enhancements

* Role-Based Access Control (Admin/Student)
* File Upload System (PDF Notes)
* AI Campus Assistant
* React Frontend Dashboard
* Email Notifications
* Cloud Deployment

---

## Author

**Shashank Singh**

B.Tech CSE Student

Passionate about Backend Development, Artificial Intelligence, and Full Stack Projects.

---

## License

This project is created for learning, portfolio building, and educational purposes.
