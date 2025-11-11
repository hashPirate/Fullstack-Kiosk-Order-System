import { useState } from 'react';
import styles from './ManageServers.module.css';


const FAKE_ACTIVE_USERS = [
    { username: 'fake_dudee', is_manager:false,on_staff:true },
    { username: 'fake_dude2', is_manager:true,on_staff:true },
    { username: 'fakedude3', is_manager:false, on_staff:true }
];

const FAKE_INACTIVE_USERS = [
    { username: 'fake4', is_manager: false, on_staff: false },
    { username: 'fake5', is_manager: false, on_staff: false }
];

export default function ManageServers() {
    const [activeUsers] = useState(FAKE_ACTIVE_USERS);
    const [inactiveUsers] = useState(FAKE_INACTIVE_USERS);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const toggleStaffStatus = (user) => {
        console.log('Toggle staff status (demo mode):', user.username);
    };
    const handleAddUser = () => {
        setEditingUser(null);
        setShowEditModal(true);
    };
    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowEditModal(true);
    };
    const handleSaveUser = (userData) => {
        console.log('Save user (demo mode):', userData);
        setShowEditModal(false);
        setEditingUser(null);
    };

    const UserList =({ users, isActive }) => (
        <div className={styles.userList}>
            <h3>{isActive ? 'Active' : 'Inactive'}</h3>
            <ul className={styles.userListItems}>
                {users.map(user => (
                    <li key={user.username} className={styles.userItem}>
                        <span className={styles.userName}>
                            {user.username} {user.is_manager ? '[M]' : '[S]'}
                        </span>
                        <div className={styles.userActions}>
                            <button 
                                onClick={() =>handleEditUser(user)}
                                className={styles.editButton}
                            >
                                Edit
                            </button>
                            <button 
                                onClick={()=>toggleStaffStatus(user)}
                                className={styles.switchButton}
                            >
                                Switch
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
    return (
        <div className={styles.manageServers}>
            <div className={styles.serversContainer}>
                <UserList users={activeUsers} isActive={true} />
                <UserList users={inactiveUsers} isActive={false} />
            </div>
            <div className={styles.manageUsersSection}>
                <h3>Manage Users</h3>
                <button 
                    onClick={handleAddUser}
                    className={styles.addButton}
                >
                    Add User
                </button>
            </div>
            {showEditModal &&     (
                <EditUserModal
                    user={editingUser}
                    onSave={handleSaveUser}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingUser(null);
                    }}
                />
            )}
        </div>
    );
}
function EditUserModal({ user,onSave,onClose }) {
    const [username, setUsername]=useState(user?.username || '');
    const [password, setPassword]=useState('');
    const [isManager, setIsManager]=useState(user?.is_manager || false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user && (!username || !password)) {
            alert('Username and password are required for new users.');
            return;
        }
        onSave({
            newUsername: username,
            password: password || undefined,
            isManager
        });
    };
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>{user ? `Editing User: ${user.username}` : 'Create New User'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formField}>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formField}>
                        <label>New Password {user && '(optional)'}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>setPassword(e.target.value)}
                            placeholder={user ? 'Leave blank to keep unchanged' : 'Password is required'}
                            required={!user}
                        />
                    </div>
                    
                    <div className={styles.formField}>
                        <label>
                            <input
                                type="checkbox"
                                checked={isManager}
                                onChange={(e) =>setIsManager(e.target.checked)}
                            />
                            Is Manager
                        </label>
                    </div>
                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
