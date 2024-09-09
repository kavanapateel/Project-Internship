import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function App() {
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Admin Login</h1>
      <div style={styles.linkContainer}>
        <Link 
          to="/login" 
          style={hover ? {...styles.link, ...styles.linkHover} : styles.link}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Login
        </Link>
        <span> | </span>
        <Link 
          to="/register" 
          style={hover ? {...styles.link, ...styles.linkHover} : styles.link}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Register
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    overflow: 'hidden',
    padding: '0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '0',
  },
  title: {
    fontSize: '2.5em',
    color: '#000',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  },
  linkContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    fontSize: '1.2em',
    color: '#000',
    textDecoration: 'none',
    margin: '0 10px',
    padding: '10px 20px',
    borderRadius: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  },
  linkHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  }
};

export default App;

