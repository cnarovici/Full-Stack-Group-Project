# CareerConnect

A full-stack career fair platform that connects students with employers through events, job opportunities, and direct messaging.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

## Overview

CareerConnect is a comprehensive career fair management platform designed for universities and organizations. It enables students to discover career events, connect with employers, and manage their professional profiles. Employers can create and manage events, view student applicants, and communicate directly with potential candidates.

## Features

### For Students
- **User Authentication** - Secure registration and login system
- **Profile Management** - Create and edit profiles with skills, job preferences, school, and major
- **Resume Upload** - Upload resumes via file upload or URL link
- **Event Discovery** - Browse all career fair events with filtering options
- **Smart Recommendations** - Personalized event recommendations based on skills and preferences using a topological sort algorithm
- **RSVP System** - Register for events and track saved events
- **Messaging** - Direct communication with employers after RSVPing to their events
- **Search** - Autocomplete search functionality for finding events

### For Employers
- **Company Profiles** - Create and manage company information
- **Event Management** - Create, edit, and delete career fair events
- **Applicant Tracking** - View students who have RSVP'd to events
- **Messaging** - Communicate with interested students
- **Event Analytics** - Track event engagement and attendance

## Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **CSS3** - Styling with custom components

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database management
- **SQLite** - Database
- **JWT** - JSON Web Tokens for authentication
- **Flask-CORS** - Cross-origin resource sharing

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://python.org/)
- **pip** - Python package manager (comes with Python)
- **npm** - Node package manager (comes with Node.js)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/cnarovici/Full-Stack-Group-Project.git
cd Full-Stack-Group-Project
```

### 2. Install Frontend Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
npm install react-router-dom
```

### 3. Install Backend Dependencies

Navigate to the backend directory and install Python packages:

```bash
cd backend
pip install Flask==3.0.0 Flask-SQLAlchemy==3.1.1 Flask-CORS==4.0.0 PyJWT==2.8.0 Werkzeug==3.0.1
```

## Running the Application

You need to run both the backend and frontend servers simultaneously. Open 2 terminals and run the backend then frontend

### 1. Start the Backend Server

Open a terminal, navigate to the backend directory, and run:

```bash
cd backend
python app.py
```

The backend server will start on `http://localhost:5001`

You should see output similar to:
```
✅ Database ready!
✅ Search indexes initialized!

============================================================
📋 REGISTERED API ROUTES:
============================================================
  /api/auth/register                       [POST]
  /api/auth/login                          [POST]
  /api/events                              [GET, POST]
  ...
============================================================

 * Running on http://0.0.0.0:5001
```

### 2. Start the Frontend Server

Open a new terminal, navigate to the frontend directory, and run:

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
Full-Stack-Group-Project/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentDashboard.js
│   │   │   ├── StudentProfile.js
│   │   │   ├── StudentEditProfile.js
│   │   │   ├── StudentUpdateResume.js
│   │   │   ├── BrowseEvents.js
│   │   │   ├── ViewEvent.js
│   │   │   ├── EmployerDashboard.js
│   │   │   ├── EmployerProfile.js
│   │   │   ├── EventApplicants.js
│   │   │   ├── ConversationThread.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── ... (CSS files)
│   │   ├── utils/
│   │   │   └── auth.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── app.py              # Flask application entry point
│   ├── routes.py           # API route definitions
│   ├── models.py           # Database models
│   ├── trie.py             # Search index implementation
│   ├── topological_sort.py # Recommendation algorithm
│   ├── uploads/
│   │   └── resumes/        # Uploaded resume files
|   ├── _pycache_           # Pycache files auto generated to run faster
│   ├── migrate_db.py       # Migrates database in case of database errors such as messaging or unfound accounts/events 
│   └── instance/
│       └── career_fair.db  # SQLite database
|    
│
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Student Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/student` | Get student profile |
| PUT | `/api/profile/student` | Update student profile |
| POST | `/api/profile/student/resume` | Upload resume file |

### Employer Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/employer` | Get employer profile |
| PUT | `/api/profile/employer` | Update employer profile |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| POST | `/api/events` | Create new event (employer only) |
| GET | `/api/events/:id` | Get event details |
| PUT | `/api/events/:id` | Update event (employer only) |
| DELETE | `/api/events/:id` | Delete event (employer only) |
| GET | `/api/events/recommendations` | Get personalized recommendations |

### RSVP
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events/:id/rsvp` | RSVP to an event |
| DELETE | `/api/events/:id/rsvp` | Cancel RSVP |
| GET | `/api/events/:id/rsvp/status` | Check RSVP status |
| GET | `/api/events/rsvp` | Get all RSVP'd events |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | Get all conversations |
| POST | `/api/messages` | Send a new message |
| GET | `/api/messages/:id` | Get conversation thread |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search/autocomplete` | Search events with autocomplete |

## Usage Tips

1. **First Time Setup**: Register as either a student or employer to create your account
2. **Students**: Complete your profile with skills and job preferences to get better event recommendations
3. **Employers**: Create events with relevant tags to attract matching students
4. **Messaging**: Students must RSVP to an event before they can message the employer

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Neither work (generally Mac specifc issue, disable airplay and kill all Elmedia processes)
killall -9 Elmedia
```

**Database issues:**
Delete the `instance/` folder in the backend directory and restart the server to create a fresh database, or migrate database
```bash
python migrate_db.py
```

**Module not found errors:**
Make sure you've installed all dependencies:
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && pip install Flask==3.0.0 Flask-SQLAlchemy==3.1.1 Flask-CORS==4.0.0 PyJWT==2.8.0 Werkzeug==3.0.1
```

## License

This project was created for CS 473 at the University of Illinois at Chicago.
