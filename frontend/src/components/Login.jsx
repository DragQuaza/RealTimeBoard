import React, { useState } from 'react';

const Login = ({ onJoin }) => {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim() && roomId.trim()) {
            onJoin(username, roomId);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass">
                <h1>SyncBoard</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="input-group">
                        <label htmlFor="username">Your Name</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="roomId">Room ID</label>
                        <input
                            id="roomId"
                            type="text"
                            placeholder="e.g. daily-standup"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={!username.trim() || !roomId.trim()}>
                        Join Whiteboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
