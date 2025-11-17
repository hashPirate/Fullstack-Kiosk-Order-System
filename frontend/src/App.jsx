import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import "./__global_styles__.css";

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
        <li><NavLink to="/cashier">Cashier View</NavLink></li>
        <li><NavLink to="/kitchen">Kitchen View</NavLink></li>
        <li><NavLink to="/manager">Manager View</NavLink></li>
      </ul>
      
    </>
  )
}

export default App
