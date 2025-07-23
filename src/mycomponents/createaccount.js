import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [showVerification, setShowVerification] = useState(false);
const [verificationCode, setVerificationCode] = useState('');

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
const { instance } = useMsal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
const [role, setRole] = useState('');
const handleMicrosoftLogin = async () => {
  if (!role) {
    alert('Please select a role before signing in with Microsoft');
    return;
  }

  try {
    const loginResponse = await instance.loginPopup({
      scopes: ['User.Read'],
    });

    const idToken = loginResponse.idToken;
    const account = loginResponse.account;
    console.log('Microsoft Login Success:', account);

    const response = await fetch('http://localhost:5000/api/auth/login-ms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, role }), 
    });

    const data = await response.json();

    if (response.ok) {
      alert('Microsoft login successful');
      localStorage.setItem('email', account.username);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      alert(data.message || 'Microsoft login failed');
    }
  } catch (err) {
    console.error('Microsoft login error:', err);
    alert('Microsoft login failed');
  }
};
  
const handleCodeVerification = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/signup-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: verificationCode }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Signup completed!');
      localStorage.setItem('email', email);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      alert(data.message || 'Verification failed');
    }
  } catch (err) {
    console.error('Verification error:', err);
    alert('Server error');
  }
};

const handleSignup = async () => {
  if (!username || !email || !password || !confirmPassword || !role) {
    alert('Please fill in all fields');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/signup-initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
      setShowVerification(true);
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (err) {
    console.error('Signup error:', err);
    alert('Server error');
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
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      backgroundColor: 'rgba(147, 204, 226, 0.12)',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0',
      width: '100%',
      maxWidth: '450px',
      padding: '40px',
    },
    title: {
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '30px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#555',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    passwordContainer: {
      position: 'relative',
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
      fontSize: '12px',
    },
    signupBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#4285f4',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
<div style={styles.formGroup}>
  <label style={styles.label}>Full Name</label>
  <input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    placeholder="Enter your username"
    style={styles.input}
    onFocus={(e) => e.target.style.borderColor = '#4285f4'}
    onBlur={(e) => e.target.style.borderColor = '#ddd'}
  />
</div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Work Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
<div style={styles.formGroup}>
  <label style={styles.label}>Select Role</label>
  <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    style={{ ...styles.input, paddingRight: '30px' }}
  >
    <option value="">Choose your role</option>
    <option value="auditor">Auditor</option>
    <option value="employee">Employee</option>
    <option value="manager">Manager</option>
    <option value="HR">HR</option>
    {/* Add more roles as needed */}
  </select>
</div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
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

        <div style={styles.formGroup}>
          <label style={styles.label}>Confirm Password</label>
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        <button
          onClick={handleSignup}
          style={styles.signupBtn}
          onMouseOver={(e) => e.target.style.backgroundColor = '#3367d6'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4285f4'}
        >
          Sign up
        </button>
        {showVerification && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 9999
  }}>
    <div style={{ backgroundColor: 'white', padding: 30, borderRadius: 10 }}>
      <h3>Enter Verification Code</h3>
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="6-digit code"
        style={styles.input}
      />
      <button
        onClick={handleCodeVerification}
        style={{ ...styles.signupBtn, marginTop: 10 }}
      >
        Verify & Complete Signup
      </button>
    </div>
  </div>
)}

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
      </div>
    </div>
  );
};

export default SignupPage;
