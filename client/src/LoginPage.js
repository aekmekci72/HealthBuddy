import React, { useState } from 'react';
import axios from 'axios';
// import backgroundImg from './assets/loginbg.png';
// import logintext from './assets/logintext.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/login',
        {
          username,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === 'Login successful') {
        console.log('Setting username in local storage:', username);
        localStorage.setItem('username', username);
        console.log(username);
        window.location.href = '/Homepage';
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred while logging in');
    }
  };

  return (
    <div>
      
    
    <div style={styles.page_container}>
      <div className='bg-white-resonate '>
    <div className="flex items-center justify-center mt-5">
        <h1 className=" text-9xl text-grey-resonate">Log</h1>
      </div>
      <div className="flex items-center justify-center mt-0">
        <h1 className=" text-9xl text-grey-resonate mx-[-0px]">In</h1>
      </div>
      
      <div style={styles.container}>
        <div style={styles.inputContainer}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      </div>
    </div>
    </div>
    </div>
  );
};

const styles = {
  page_container: {
    // backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    height: '100vh', // Adjust to cover the entire viewport
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logintext: {
    position: 'absolute',
    top: '18%', // Adjust to desired position
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px', // Adjust to image dimensions
    marginTop: '4%'
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center',
    marginTop: '14%', // Adjust this value for spacing
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px'
  },
  inputContainer: {
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%'
  },
  button: {
    backgroundColor: '#9F9D81',
    color: '#fff',
    padding: '10px 15px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    color: 'red',
    marginTop: '10px'
  }
};

export default LoginPage;
