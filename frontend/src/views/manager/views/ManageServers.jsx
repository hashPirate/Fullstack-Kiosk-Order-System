/**
 * @module views/manager/views
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ManageServers.module.css';

/**
 * Component for managing server users (employees).
 * Allows viewing active/inactive users, toggling staff status, and creating/editing users.
 * @function ManageServers
 * @returns {React.ReactElement} The rendered server management interface.
 */
export default function ManageServers() {
    const [activeUsers, setActiveUsers] = useState([]);
    const [inactiveUsers, setInactiveUsers] = useState([]);
    const [showEditpopup, setShowEditpopup] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers=async () => {//grab db users
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/users');
            const allUsers = response.data;
        
            const usersWithScopes=allUsers.filter(user => {// ensure only scopd users (employees) are shown
                const userScopes=user.scopes || [];
                return userScopes.length>0; 
            });
            const active = usersWithScopes.filter(user=>user.on_staff===true); // simple filtering
            const inactive = usersWithScopes.filter(user=>user.on_staff===false);
            setActiveUsers(active);
            setInactiveUsers(inactive);
        } catch(err) {
            console.error('Uh oh! Error with fetching users:',err);
            setError(err.response?.data?.error || 'Uh oh! Error with fetching users');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    const toggleStaffStatus=async (user) => {
        try {
            const newOnStaffStatus=!user.on_staff;
            await axios.put(`/api/users/${user.username}/on-staff`, {
                onStaff:newOnStaffStatus
            });
            await fetchUsers();//refreshlist
        } catch (err) {
            console.error('Error with toggling the staff status WHOOPPSSSS - ', err);
            alert(err.response?.data?.error || 'Error with toggling the staff status');
        }
    };
    const handleAddUser=() => {
        setEditingUser(null);
        setShowEditpopup(true);
    };
    const handleEditUser=(user) => {
        setEditingUser(user);
        setShowEditpopup(true);
    };
    const handleSaveUser=async (userData) => {
        try {
            if (!editingUser) { //this means we are making a user bing bong
                if (!userData.newUsername||!userData.password) {
                    alert('Username and password are required for new users!!');
                    return;
                }
                try {//ensure no repeat users as unfortunately we do logins by username so that would break some stuff lmao
                    const checkResponse=await axios.get(`/api/users/${userData.newUsername}`);
                    if (checkResponse.data!==null) {//backend (thanks michael) returns null but a 200 
                        alert('A user with this username already exists.');
                        return;
                    }
                } catch (err) {
                    if (err.response?.status===404) {
                        //THIS IS GOOD!! USER NOT THERE YET BWAHAHAHAHA. blank if statement approving continuation
                    } else {
                        throw err;
                    }
                }
                await axios.post('/api/users', {
                    username:userData.newUsername,
                    password:userData.password
                });
                
                if (userData.isManager) {
                    await axios.put(`/api/users/${userData.newUsername}/manager`, {//check scope cause no matter what its gonna be an employee just check if scope should be set to manager or cashier
                        isManager: true
                    });
                } else {
                    await axios.put(`/api/users/${userData.newUsername}/cashier`, {
                        isCashier: true
                    });
                }
                
            } else {//setting new employees as inactive for default
                const originalUsername=editingUser.username;
                if (userData.newUsername && userData.newUsername!==originalUsername) {//check for username duplicates for this too hehehe
                    try {
                        const checkResponse=await axios.get(`/api/users/${userData.newUsername}`);
                        if (checkResponse.data!==null) {
                            alert('A user with this username already exists.');
                            return;
                        }
                    } catch (err) {
                        if (err.response?.status === 404) {//empty approval
                        } else {
                            throw err;
                        }
                    }
                    
                    await axios.put(`/api/users/${originalUsername}/username`, {
                        newUsername:userData.newUsername
                    });
                }
                if (userData.password) {//newpassword change
                    const usernameToUse=userData.newUsername || originalUsername;
                    await axios.put(`/api/users/${usernameToUse}/password`, {
                        password:userData.password
                    });
                }
                const currentIsManager=editingUser.scopes?.includes('manager') || false; // if managerstatus changed update it
                if (userData.isManager!==currentIsManager) {
                    const usernameToUse = userData.newUsername || originalUsername;
                    await axios.put(`/api/users/${usernameToUse}/manager`, {
                        isManager:userData.isManager
                    });
                    if (!userData.isManager) {//check to ensure cashier scope exists for that user (this is just a safety thing to make sure employees dont turn into customers LMAO) (not that that happened)
                        await axios.put(`/api/users/${usernameToUse}/cashier`, {
                            isCashier: true
                        });
                    }
                }
            }
            await fetchUsers();
            setShowEditpopup(false);
            setEditingUser(null);
        } catch (err) {
            console.error('Error saving user:', err);
            alert(err.response?.data?.error || 'Failed to save user');
        }
    };

    /**
     * Component that displays a list of users (active or inactive).
     * @function UserList
     * @param {Object} props - The component props.
     * @param {Array<Object>} props.users - Array of user objects to display.
     * @param {boolean} props.isActive - Whether the list shows active users (true) or inactive users (false).
     * @returns {React.ReactElement} The rendered user list.
     */
    const UserList = ({ users, isActive }) => ( 
        <div className={styles.userList}>
            <h3>{isActive ? 'Active' : 'Inactive'}</h3>
            <ul className={styles.userListItems}>
                {users.length === 0 ? (
                    <li className={styles.emptyMessage}>No {isActive ? 'active' : 'inactive'} users</li>
                ) : (
                    users.map(user => {
                        const isManager = user.scopes?.includes('manager') || false;
                        return (
                            <li key={user.user_id || user.username} className={styles.userItem}>
                                <span className={styles.userName}>
                                    {user.username} {isManager ? '[M]' : '[S]'}
                                </span>
                                <div className={styles.userActions}>
                                    <button 
                                        onClick={() => handleEditUser(user)}
                                        className={styles.editButton}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => toggleStaffStatus(user)}
                                        className={styles.switchButton}
                                    >
                                        Switch
                                    </button>
                                </div>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );

    if (loading) {
        return (
            <div className={styles.manageServers}>
                <div className={styles.loading}>Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.manageServers}>
                <div className={styles.error}>
                    <p>Error: {error}</p>
                    <button onClick={fetchUsers} className={styles.addButton}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

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
            {showEditpopup && (
                <EditUserpopup
                    user={editingUser}
                    onSave={handleSaveUser}
                    onClose={() => {
                        setShowEditpopup(false);
                        setEditingUser(null);
                    }}
                />
            )}
        </div>
    );
}
/**
 * Modal component for editing or creating a user.
 * @function EditUserpopup
 * @param {Object} props - The component props.
 * @param {Object|null} props.user - The user object to edit, or null for creating a new user.
 * @param {Function} props.onSave - Callback function called when the user is saved.
 * @param {Object} props.onSave.userData - The user data to save.
 * @param {string} props.onSave.userData.newUsername - The new username.
 * @param {string} [props.onSave.userData.password] - The password (optional for editing).
 * @param {boolean} props.onSave.userData.isManager - Whether the user is a manager.
 * @param {Function} props.onClose - Callback function called when the modal is closed.
 * @returns {React.ReactElement} The rendered edit user popup modal.
 */
function EditUserpopup({ user, onSave, onClose }) {
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [isManager, setIsManager] = useState(
        user?.scopes?.includes('manager') || false
    );
    useEffect(() => {
        setUsername(user?.username||'');
        setPassword('');
        setIsManager(user?.scopes?.includes('manager') || false);
    }, [user]);

    const handleSubmit=(e) => {
        e.preventDefault();
        if (!user && (!username||!password)) {
            alert('Username and password are required for new users.');
            return;
        }
        onSave({
            newUsername: username,
            password: password||undefined,
            isManager
        });
    };
    return (
        <div className={styles.popupOverlay} onClick={onClose}>
            <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
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
                    <div className={styles.popupActions}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
