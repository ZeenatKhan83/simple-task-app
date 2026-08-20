# Momentum – Simple Task App

A beginner-friendly full stack Task Management application built with React (Vite), Node.js, Express, and SQLite.
```
## Folder Structure
simple-task-app/
├── server/     -> Node + Express + SQLite backend (REST API)
└── client/     -> React + Vite frontend

```
## Prerequisites

- Node.js (v18+) installed
- npm

## 1. Backend Setup

```bash
cd server
npm install
node server.js
```
Backend runs at: http://localhost:5000

## 2. Frontend Setup
Open a second terminal:

```bash
cd client
npm install
npm run dev
```
Frontend runs at:  http://localhost:5173/
## 3. Features

User Authentication (Register / Login with JWT)
Create, Read, Update, Delete Tasks
Subtasks support
Mark tasks as completed
Activity Heatmap (track daily progress)
SQLite database (no external database setup needed)

## 4. Test the API (optional, with Postman)

- GET    http://localhost:5000/api/tasks
- POST   http://localhost:5000/api/tasks
- PUT    http://localhost:5000/api/tasks/:id
- DELETE http://localhost:5000/api/tasks/:id
- PUT    http://localhost:5000/api/tasks/:id/complete
- GET    http://localhost:5000/api/activity/heatmap
- POST   http://localhost:5000/api/auth/register
- POST   http://localhost:5000/api/auth/login

## 5. Tech Stack

- Frontend: React 19 + Vite
- Backend: Node.js + Express
- Database: SQLite3
- Authentication: JWT + bcryptjs

