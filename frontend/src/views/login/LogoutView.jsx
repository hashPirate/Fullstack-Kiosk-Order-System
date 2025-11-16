import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LogoutView() {
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Attempt to log out on the backend
                await axios.post('/api/session/logout');
            } catch (error) {
                console.error("Logout request failed, but redirecting anyway.", error);
            } finally {
                navigate('/', { replace: true });
            }
        };

        performLogout();
    }, [navigate]);

    return <div>Logging out...</div>;
}