import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
const { instance } = useMsal();
const navigate = useNavigate();
  const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Login success:', data);
      console.log(data.userId); 
      alert("Login success");
      localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        localStorage.setItem('name',data.username);
        localStorage.setItem('userId', data.userId);
      navigate('/dashboard');
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
  }
};


const handleMicrosoftLogin = async () => {
  try {
    const loginResponse = await instance.loginPopup({
      scopes: ['User.Read'],
    });

    const idToken = loginResponse.idToken;
    const account = loginResponse.account;
    console.log('Microsoft Login Success:', account);

    // Send token to backend for verification only
    const response = await fetch('http://localhost:5000/api/auth/verify-ms-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Microsoft login successful');
      localStorage.setItem('email', account.username);
      localStorage.setItem('name', data.username);
      localStorage.setItem('userId', data.userId);
      console.log(data.userId); 
      console.log(account.username);
      console.log(data.username);
      navigate('/dashboard');
    } else {
      alert(data.message || 'Microsoft login failed');
    }
  } catch (err) {
    console.error('Microsoft login error:', err);
    alert('Microsoft login failed');
  }
};



  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      backgroundColor: 'rgba(147, 204, 226, 0.12)',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0',
      width: '100%',
      maxWidth: '450px',
      padding: '40px'
    },
    title: {
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '30px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#555',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#4285f4',
      boxShadow: '0 0 0 2px rgba(66, 133, 244, 0.2)'
    },
    passwordContainer: {
      position: 'relative'
    },
    passwordInput: {
      width: '100%',
      padding: '12px',
      paddingRight: '50px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    showHideBtn: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#666',
      cursor: 'pointer',
      fontSize: '12px'
    },
    forgotPassword: {
      textAlign: 'right',
      marginBottom: '20px'
    },
    forgotLink: {
      color: '#666',
      fontSize: '14px',
      textDecoration: 'none',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '30px'
    },
    loginBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#4285f4',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    signupBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#5f6368',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    footer: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    backgroundColor: '#f1f1f1',
    padding: '10px 20px',
    textAlign: 'center',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  footerLink: {
    background: 'none',
    border: 'none',
    color: '#494747ff',
    cursor: 'pointer',
    fontSize: '12px',
  }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#4285f4'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={styles.passwordInput}
              onFocus={(e) => e.target.style.borderColor = '#4285f4'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.showHideBtn}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div style={styles.forgotPassword}>
          <button style={styles.forgotLink}>
            Forgot Password?
          </button>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={handleSubmit}
            style={styles.loginBtn}
            onMouseOver={(e) => e.target.style.backgroundColor = '#3367d6'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4285f4'}
          >
            Login
          </button>
          
          <button
  onClick={handleMicrosoftLogin}
  style={{
    width: '100%',
    padding: '12px',
    backgroundColor: '#2F2F94',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }}
  onMouseOver={(e) => e.target.style.backgroundColor = '#1a1a6b'}
  onMouseOut={(e) => e.target.style.backgroundColor = '#2F2F94'}
>
  Login with Microsoft
</button>

          <button
            onClick={() => console.log('Sign up clicked')}
            style={styles.signupBtn}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4a4d52'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#5f6368'}
          >
            Sign up
          </button>
        </div>


        
      </div>
      <div style={styles.footer}>
          <div style={styles.footerLinks}>
            <button style={styles.footerLink}>Terms & Conditions</button>
            <button style={styles.footerLink}>Privacy Policy</button>
            <button style={styles.footerLink}>Contact Us</button>
          </div>
        </div>
    </div>
    
  );
};

export default LoginPage;