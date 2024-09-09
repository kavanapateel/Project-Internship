import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome to the Home</h2>
      <nav style={styles.nav}>
        <ul style={styles.ul}>
          <li style={styles.li}><Link to="/page1" style={styles.link}>Assign</Link></li>
          <li style={styles.li}><Link to="/page2" style={styles.link}>Dashboard</Link></li>
          <li style={styles.li}><Link to="/page3" style={styles.link}>Server</Link></li>
        </ul>
      </nav>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    overflow: 'hidden',
    padding: '0',
    margin: '0',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#000',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  nav: {
    marginTop: '20px',
  },
  ul: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  li: {
    padding: '0',
    margin: '0',
  },
  link: {
    display: 'block',
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default Home;
