import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ManageServers.module.css';

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
