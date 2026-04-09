# SyncBoard - Real-time Collaborative Whiteboard

A production-minded MVP for a real-time collaborative whiteboard built with React, Node.js, and Socket.io.

## 🚀 Live Demo
- **Open Whiteboard**: [https://whiteboard-real-time-one.vercel.app](https://whiteboard-real-time-one.vercel.app)

## 🛠 Technical Infrastructure
For recruiters and developers interested in the deployment architecture:
- **Frontend Hosting**: [Vercel](https://vercel.com) (Continuous Deployment from GitHub)
- **Backend Hosting**: [Render](https://render.com) (Persistent Node.js Instance)
- **Real-time Engine**: Socket.io (WebSockets)
- **Backend API/Socket URL**: [https://whiteboard-real-time.onrender.com](https://whiteboard-real-time.onrender.com)

## Architecture & Features
- **Frontend**: React (Vite), vanilla CSS, HTML5 Canvas, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io.
- **Features**: Real-time multi-user drawing with low latency, Room-based sessions, Pen/Eraser/Color Picker/Brush Size, minimal glassmorphism UI.

## Project Structure
```text
whiteboard/
├── backend/
│   ├── package.json
│   └── server.js         # Socket.io connection logic
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── App.jsx       # Main App and Socket Context
│       ├── index.css     # Vanilla CSS styles glassmorphism
│       └── components/
│           ├── Whiteboard.jsx # Canvas Logic
│           ├── Toolbar.jsx    # Drawing Tools UI
│           ├── UserList.jsx   # Active User bubbles
│           └── Login.jsx      # Join Room UI
└── README.md
```

## Setup Instructions

### 1. Start the Backend
```bash
cd backend
npm install
node server.js
```
The Socket.io server runs on port `3001`.

### 2. Start the Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The React development server runs on `http://localhost:5173`.

