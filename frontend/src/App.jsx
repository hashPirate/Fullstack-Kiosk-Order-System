import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import "./__global_styles__.css";

/**
 * The main application component that serves as the entry point and router.
 * It fetches the current user's session and displays navigation links
 * based on their authentication status and roles (scopes).
 *
 * @returns {React.ReactElement} The rendered App component.
 */
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/session/current-user')
      .then(response => {
        if (response.data) {
          setUser(response.data);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

const userScopes = user?.scopes || [];
const hasManagerScope=userScopes.includes('manager');
const hasAnyScope=userScopes.length>0;


  return (
    <>
      <h2>Welcome to Exsellence!</h2>
      {user ? (
        <p>Currently logged in as: <strong>{user.username}</strong>  <NavLink to="/logout">Click here to logout.</NavLink></p>
      ) : (
        <p>You are not logged in. <NavLink to="/login">Click here to login.</NavLink></p>
      )}
      <p>Please choose a link to visit:</p>
      <ul>
        <li><NavLink to="/kiosk">Kiosk View</NavLink></li>
        <li><NavLink to="/menu">Menu Board</NavLink></li>
        {hasAnyScope && (
          <>
            <li><NavLink to="/cashier">Cashier View</NavLink></li>
            <li><NavLink to="/kitchen">Kitchen View</NavLink></li>
          </>
        )}
        {hasManagerScope && (
          <li><NavLink to="/manager">Manager View</NavLink></li>
        )}
        {/* Using "a" since the static docs content is not from this React project */}
        <li><a href="/docs">Code documentation</a></li>
      </ul>
      
    </>
  )
}

export default App
