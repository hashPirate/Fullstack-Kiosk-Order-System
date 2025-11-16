import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginView.module.css';
import { FcGoogle } from 'react-icons/fc';

export default function LoginView() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await axios.post('/api/session/login', { username, password });
            
            // On successful login, the backend should set a session cookie.
            if (response.status === 200) {
                const redirectPath = searchParams.get('redirect') || '/';
                navigate(redirectPath, { replace: true });
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Login failed. Please check your credentials.');
            } else {
                setError('A network error occurred. Please try again later.');
            }
            console.error('Login error:', err);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <header className={styles.header}>
                <Link to="/">Exsellence</Link>
            </header>
            <form className={styles.loginForm} onSubmit={handleLogin}>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <div className={styles.inputGroup}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className={styles.loginButton}>Login</button>
                <div className={styles.divider}>
                    <span>OR</span>
                </div>
                <a href={`/api/session/auth/google?redirect=${encodeURIComponent(searchParams.get('redirect') || '/')}`} className={styles.googleButton}>
                    <FcGoogle size="20" />
                    <span>Sign in with Google</span>
                </a>
            </form>
        </div>
    );
}