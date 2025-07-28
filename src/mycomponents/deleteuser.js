import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
const ProfileForm = () => {
  const [currentView, setCurrentView] = useState('profile'); // 'profile', 'password', 'delete'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

 const { userId } = useParams(); 
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const handleDeleteUser = async () => {
  if (!userId) return;

  try {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    await axios.delete(`http://localhost:5000/api/team/member/${userId}`);
    alert('User deleted successfully');
    
    // Optional: redirect or reload
    window.location.href = '/'; // or navigate('/users') if using React Router v6
  } catch (error) {
    console.error('User deletion failed:', error);
    alert(error.response?.data?.message || 'Failed to delete user');
  }
};



const handleUpdatePassword = async () => {
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const response = await axios.put(`http://localhost:5000/api/auth/passwordchanging/${userId}/password`, {
      password,
    });

    alert('Password updated successfully');
    setCurrentView('profile');
  } catch (error) {
    console.error('Password update failed:', error);
    alert(error.response?.data?.message || 'Failed to update password');
  }
};

 useEffect(() => {
  const fetchUser = async () => {
    try {
      // Add validation and logging
      console.log('User ID before fetch:', userId); 
      
      if (!userId || typeof userId !== 'string') {
        throw new Error(`Invalid user ID: ${userId}`);
      }

      const response = await fetch(`http://localhost:5000/api/team/member/${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  if (userId) fetchUser();
}, [userId]);

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      width: '400px',
      maxWidth: '90vw',
      position: 'relative',
      padding: '0',
    },
    header: {
      padding: '24px 24px 0 24px',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      color: '#9CA3AF',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
    },
    profileSection: {
      textAlign: 'center',
      marginBottom: '24px',
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      margin: '0 auto 16px',
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    name: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      margin: '0',
    },
    form: {
      padding: '0 24px',
    },
    inputGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#111827',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    inputFocus: {
      borderColor: '#3B82F6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    passwordInputContainer: {
      position: 'relative',
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#6B7280',
      cursor: 'pointer',
      padding: '4px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      padding: '24px',
      borderTop: '1px solid #E5E7EB',
    },
    button: {
      flex: 1,
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none',
    },
    buttonOutline: {
      backgroundColor: 'white',
      color: '#DC2626',
      border: '1px solid #DC2626',
    },
    buttonPrimary: {
      backgroundColor: '#3B82F6',
      color: 'white',
      border: '1px solid #3B82F6',
    },
    sectionDivider: {
      borderTop: '1px solid #E5E7EB',
      margin: '24px 0',
      paddingTop: '24px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
    },
    deleteModal: {
      textAlign: 'center',
      padding: '24px',
    },
    deleteIcon: {
      width: '64px',
      height: '64px',
      backgroundColor: '#FEE2E2',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '24px',
      color: '#DC2626',
    },
    deleteTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '8px',
    },
    deleteMessage: {
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '24px',
    },
    deleteButtonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
    },
    cancelButton: {
      padding: '12px 24px',
      backgroundColor: 'white',
      color: '#374151',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    deleteButton: {
      padding: '12px 24px',
      backgroundColor: '#DC2626',
      color: 'white',
      border: '1px solid #DC2626',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    },
  };

  const ProfileView = () => (
    <div style={styles.modal}>
      <div style={styles.header}>
        <button 
          style={styles.closeButton}
          onClick={() => setCurrentView('profile')}
        >
          ×
        </button>
        
        <div style={styles.profileSection}>
          <div style={styles.avatar}>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
              alt="Profile" 
              style={styles.avatarImage}
            />
          </div>
          <h2 style={styles.name}>{user?.username || 'Loading...'}</h2>
        </div>
      </div>

      <div style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Designation</label>
        <div style={{ 
          padding: '12px',
          border: '1px solid #D1D5DB',
          borderRadius: '8px',
          backgroundColor: '#F3F4F6',
          color: '#111827'
        }}>
          {user?.role || 'Not specified'}
        </div>
      </div>

       
      <div style={styles.inputGroup}>
        <label style={styles.label}>Work Email</label>
        <div style={{ 
          padding: '12px',
          border: '1px solid #D1D5DB',
          borderRadius: '8px',
          backgroundColor: '#F3F4F6',
          color: '#111827'
        }}>
          {user?.email || 'Not specified'}
        </div>
      </div>
    </div>

      <div style={styles.buttonGroup}>
        <button 
          onClick={() => setCurrentView('delete')}
          style={{...styles.button, ...styles.buttonOutline}}
        >
          Delete user
        </button>
        <button 
          onClick={() => setCurrentView('password')}
          style={{...styles.button, ...styles.buttonPrimary}}
        >
          Change Password
        </button>
      </div>
    </div>
  );

  const PasswordView = () => (
    <div style={styles.modal}>
      <div style={styles.header}>
        <button 
          style={styles.closeButton}
          onClick={() => setCurrentView('profile')}
        >
          ×
        </button>
        
        <div style={styles.profileSection}>
          <div style={styles.avatar}>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
              alt="Profile" 
              style={styles.avatarImage}
            />
          </div>
          <h2 style={styles.name}>Omar Ali</h2>
        </div>
      </div>

     <div style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Designation</label>
        <div style={{ 
          padding: '12px',
          border: '1px solid #D1D5DB',
          borderRadius: '8px',
          backgroundColor: '#F3F4F6',
          color: '#111827'
        }}>
          {user?.role || 'Not specified'}
        </div>
      </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Work Email</label>
          <div style={{ 
          padding: '12px',
          border: '1px solid #D1D5DB',
          borderRadius: '8px',
          backgroundColor: '#F3F4F6',
          color: '#111827'
        }}>
          {user?.email || 'Not specified'}
        </div>
        </div>

        <div style={styles.sectionDivider}>
          <div style={styles.sectionTitle}>Change Password</div>
          
          <input 
  type={showPassword ? "text" : "password"}
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={styles.input}
/>

<input 
  type={showConfirmPassword ? "text" : "password"}
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  style={styles.input}
/>

        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button 
          onClick={() => setCurrentView('profile')}
          style={{...styles.button, ...styles.buttonOutline}}
        >
          Cancel
        </button>
        <button 
  onClick={handleUpdatePassword}
  style={{...styles.button, ...styles.buttonPrimary}}
>
  Update Password
</button>

      </div>
    </div>
  );

  const DeleteView = () => (
    <div style={{...styles.modal, width: '320px'}}>
      <div style={styles.deleteModal}>
        <div style={styles.deleteIcon}>
          🗑️
        </div>
        
        <div style={styles.deleteTitle}>Update Team Member</div>
        <div style={styles.deleteMessage}>
          Are You Sure You Want to<br />
          Delete User
        </div>

        <div style={styles.deleteButtonGroup}>
          <button 
            onClick={() => setCurrentView('profile')}
            style={styles.cancelButton}
          >
            Cancel
          </button>
          <button 
  onClick={handleDeleteUser}
  style={styles.deleteButton}
>
  Delete
</button>

        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.overlay}>
      {currentView === 'profile' && <ProfileView />}
      {currentView === 'password' && <PasswordView />}
      {currentView === 'delete' && <DeleteView />}
    </div>
  );
};

export default ProfileForm;