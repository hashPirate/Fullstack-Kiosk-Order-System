// import { useState } from 'react'
import { NavLink } from 'react-router-dom';
import "./__global_styles__.css";

function App() {

  return (
    <>
      <h2>Welcome to Exsellence!</h2>
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
