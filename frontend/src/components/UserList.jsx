import React from 'react';

const UserList = ({ users }) => {
    // Get initials for avatar (max 2 chars)
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    // Show only up to 4 users as avatars, rest as number
    const displayUsers = users.slice(0, 4);
    const remaining = Math.max(0, users.length - 4);

    return (
        <div className="user-list">
            <div className="users-avatars">
                {displayUsers.map((user, idx) => (
                    <div
                        key={idx}
                        className="user-avatar"
                        title={user.username}
                        style={{ zIndex: displayUsers.length - idx }}
                    >
                        {getInitials(user.username)}
                    </div>
                ))}
            </div>

            <div className="user-count">
                {users.length} {users.length === 1 ? 'user' : 'users'} online
                {remaining > 0 ? ` (+${remaining})` : ''}
            </div>
        </div>
    );
};

export default UserList;
