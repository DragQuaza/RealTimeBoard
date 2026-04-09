import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { LogOut } from 'lucide-react';
import Login from './components/Login';
import Whiteboard from './components/Whiteboard';
import Toolbar from './components/Toolbar';
import UserList from './components/UserList';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [users, setUsers] = useState([]);

  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);

  // Allow connecting whenever the user decides
  const handleJoin = (name, room) => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    setUsername(name);
    setRoomId(room);

    newSocket.emit('join-room', { roomId: room, username: name });

    newSocket.on('room-users', (userList) => {
      setUsers(userList);
    });

    setIsJoined(true);
  };

  const handleLeave = () => {
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
    setIsJoined(false);
    setUsername('');
    setRoomId('');
    setUsers([]);
  };

  const handleClear = () => {
    setClearTrigger(prev => prev + 1);
    if (socket && roomId) {
      socket.emit('clear-canvas', roomId);
    }
  };

  if (!isJoined) {
    return (
      <div className="app-container">
        <Login onJoin={handleJoin} />
      </div>
    );
  }

  return (
    <div className="app-container workspace">
      {/* Header overlay on canvas */}
      <div className="header" style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)', pointerEvents: 'none' }}>
        <div className="header-left" style={{ pointerEvents: 'auto' }}>
          <h2>SyncBoard</h2>
          <p>Room: {roomId}</p>
        </div>
        <div className="header-right" style={{ pointerEvents: 'auto' }}>
          <UserList users={users} />

          <button className="btn-danger" onClick={handleLeave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={16} />
            Leave
          </button>
        </div>
      </div>

      <Whiteboard
        socket={socket}
        roomId={roomId}
        currentColor={currentColor}
        brushSize={brushSize}
        isEraser={isEraser}
        clearTrigger={clearTrigger}
      />

      {/* Toolbar overlay set up via CSS absolute position */}
      <Toolbar
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        isEraser={isEraser}
        setIsEraser={setIsEraser}
        onClear={handleClear}
      />
    </div>
  );
}

export default App;
