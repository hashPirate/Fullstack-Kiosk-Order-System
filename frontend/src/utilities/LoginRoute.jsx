import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

/**
 *  rules:
 * - Kiosk: everyone should be able see it regardless of the scop/login
 * - Manager:can see to all views
 * - Employee: can see cashier/kitchen/and kiosk, but not manager
 */
export default function LoginRoute({children,requiredAccess}) {//i accidntally changed children and broke the whole thing so be careful
    const [user, setUser]=useState(null);
    const [loading, setLoading]=useState(true);
    const location=useLocation();

    useEffect(() => {
        if (requiredAccess==='kiosk') {
            setLoading(false);//shouldnt check
            return;
        }
        axios.get('/api/session/current-user')
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    },[requiredAccess]);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (requiredAccess==='kiosk') {//this would not work for some reason so i did it twice to force it to load
        return children;
    }
    if (!user) {
        return <Navigate to="/login"state={{from:location}}replace />;
    }

    const userScopes=user.scopes || [];
    const hasManagerScope=userScopes.includes('manager');
    const hasAnyScope=userScopes.length>0; //i kept the same structure in app.jsx

    let hasAccess=false;

    switch (requiredAccess) {//used a switch woohoo
        case 'cashier':
        case 'kitchen':
            hasAccess=hasAnyScope;
            break;
        
        case 'manager':
            hasAccess=hasManagerScope;
            break;
        default:
            hasAccess=true;
    }

    if (!hasAccess) {
        if (!hasAnyScope) {
            return <Navigate to="/kiosk" replace />; //force return
        } else {
            return <Navigate to="/cashier" replace />;
        }
    }
    return children;
}

