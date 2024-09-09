import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        { username, password }
      );
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      alert(error.response.data.message);
      setError(error.response.data.message);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Register</h2>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Username:</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type='submit' style={styles.button}>Register</button>
      </form>
    </div>
  );
}

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
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
    boxSizing: 'border-box',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#000',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#000',
  },
  input: {
    width: '90%',
    padding: '10px',
    fontSize: '1em',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '1em',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
    border: '1px solid #f5c6cb',
  },
};

export default Register;
