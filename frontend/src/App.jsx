// import { useState } from 'react'
import { NavLink } from 'react-router-dom';
import './App.css';

function App() {

  return (
    <>
      <p>
        This is the home page.
      </p>
      <NavLink to="other">Link to Other</NavLink>
    </>
  )
}

export default App
