
import React, { useState, useEffect } from 'react';

const CreateTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignTo, setAssignTo] = useState('General');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('High');
  const [selectedHR, setSelectedHR] = useState('');
  const [assignableUsers, setAssignableUsers] = useState([]);
useEffect(() => {
  const fetchUsers = async () => {
    try {
      // Fetch HR users
      const hrRes = await fetch('http://localhost:5000/api/auth/hr-users');
      const hrData = await hrRes.json();
      setHrUsers(hrData);

      // Fetch Non-HR users
      const nonHrRes = await fetch('http://localhost:5000/api/auth/non-hr-users');
      const nonHrData = await nonHrRes.json();
      setAssignableUsers(nonHrData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  fetchUsers();
}, []);
const [hrUsers, setHrUsers] = useState([]);
useEffect(() => {
  const fetchHRUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/hr-users');
      const data = await response.json();
      setHrUsers(data); // expected to be an array of HR user objects
    } catch (error) {
      console.error('Error fetching HR users:', error);
    }
  };

  fetchHRUsers();
}, []);


  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '40px',
      cursor: 'pointer',
    },
    backIcon: {
      marginRight: '12px',
      color: '#666',
    },
    headerTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#333',
      margin: 0,
    },
    formGroup: {
      marginBottom: '32px',
    },
    formGroupRow: {
      display: 'flex',
      gap: '24px',
      marginBottom: '32px',
    },
    formGroupHalf: {
      flex: 1,
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '8px',
    },
    required: {
      color: '#ff4444',
    },
    charCount: {
      fontSize: '12px',
      color: '#999',
      float: 'right',
      marginTop: '-20px',
      marginBottom: '8px',
    },
    titleInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    descriptionContainer: {
      position: 'relative',
    },
    descriptionInput: {
      width: '100%',
      minHeight: '120px',
      padding: '12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'inherit',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '8px 12px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '14px',
      color: '#666',
    },
    toolbarSelect: {
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      color: '#666',
      cursor: 'pointer',
    },
    toolbarButton: {
      border: 'none',
      background: 'none',
      fontSize: '14px',
      color: '#666',
      cursor: 'pointer',
      padding: '2px 4px',
      borderRadius: '3px',
    },
    toolbarButtonActive: {
      backgroundColor: '#f0f0f0',
    },
    selectContainer: {
      position: 'relative',
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'inherit',
      appearance: 'none',
      backgroundColor: 'white',
      cursor: 'pointer',
      boxSizing: 'border-box',
    },
    selectIcon: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#666',
      pointerEvents: 'none',
    },
    dateContainer: {
      position: 'relative',
    },
    dateInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    dateIcon: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#666',
      pointerEvents: 'none',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '16px',
      marginTop: '48px',
    },
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      fontFamily: 'inherit',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      color: '#4285f4',
      border: '1px solid transparent',
    },
    createButton: {
      backgroundColor: '#4285f4',
      color: 'white',
    },
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  if (!trimmedTitle || !trimmedDescription || !assignTo || !deadline || !priority || !selectedHR) {
    alert('Please fill in all required fields.');
    return;
  }

  const taskData = {
    title: trimmedTitle,
    description: trimmedDescription,
    assignTo, 
    deadline,
    priority,
    assignedBy: selectedHR,
  };

  try {
    const res = await fetch('http://localhost:5000/api/auth/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (res.ok) {
      alert('Task created successfully!');
      // optionally reset form
    } else {
      alert('Failed to create task');
    }
  } catch (error) {
    console.error('Submit failed:', error);
    alert('An error occurred during submission');
  }
};



  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.backIcon}>←</span>
        <h1 style={styles.headerTitle}>Create New Task</h1>
      </div>

      <div>
        <div style={styles.formGroup}>
          <div style={styles.label}>
            Title <span style={styles.required}>*</span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.titleInput}
          />
          <div style={styles.charCount}>25 words max</div>
        </div>

        <div style={styles.formGroup}>
          <div style={styles.label}>Description</div>
          <div style={styles.descriptionContainer}>
            <div style={styles.toolbar}>
              <select style={styles.toolbarSelect}>
                <option>14</option>
              </select>
              <button type="button" style={styles.toolbarButton}>T</button>
              <button type="button" style={styles.toolbarButton}>●</button>
              <button type="button" style={styles.toolbarButton}>I</button>
              <button type="button" style={styles.toolbarButton}>B</button>
              <button type="button" style={styles.toolbarButton}>U</button>
              <button type="button" style={styles.toolbarButton}>≡</button>
              <button type="button" style={styles.toolbarButton}>≡</button>
              <button type="button" style={styles.toolbarButton}>≡</button>
              <button type="button" style={styles.toolbarButton}>↗</button>
              <button type="button" style={styles.toolbarButton}>⛓</button>
              <button type="button" style={styles.toolbarButton}>🖼</button>
              <button type="button" style={styles.toolbarButton}>📎</button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.descriptionInput}
            />
          </div>
          <div style={styles.charCount}>100 words max</div>
        </div>

        <div style={styles.formGroupRow}>
          <div style={styles.selectContainer}>
  <select
    value={assignTo}
    onChange={(e) => setAssignTo(e.target.value)}
    style={styles.select}
  >
    <option value="">Select user</option>
    {assignableUsers.length > 0 ? (
      assignableUsers.map((user) => (
        <option key={user._id} value={user.username}>
          {user.username}
        </option>
      ))
    ) : (
      <option disabled>No users found</option>
    )}
  </select>
  <span style={styles.selectIcon}>▼</span>
</div>


          <div style={styles.formGroupHalf}>
            <div style={styles.label}>
              Deadline <span style={styles.required}>*</span>
            </div>
            <div style={styles.dateContainer}>
              <input
  type="date"
  value={deadline}
  onChange={(e) => setDeadline(e.target.value)}
  min={new Date().toISOString().split('T')[0]} // today's date in YYYY-MM-DD
  style={styles.dateInput}
/>

              <span style={styles.dateIcon}>📅</span>
            </div>
          </div>
        </div>

        <div style={styles.formGroupRow}>
          <div style={styles.formGroupHalf}>
            <div style={styles.label}>Priority</div>
            <div style={styles.selectContainer}>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={styles.select}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <span style={styles.selectIcon}>▼</span>
            </div>
          </div>

          <div style={styles.formGroupHalf}>
  <div style={styles.label}>Select HR</div>
  <div style={styles.selectContainer}>
    <select
      value={selectedHR}
      onChange={(e) => setSelectedHR(e.target.value)}
      style={styles.select}
    >
      <option value="">Select user</option>
      {hrUsers.length > 0 ? (
        hrUsers.map((user) => (
          <option key={user._id} value={user.username}>
            {user.username}
          </option>
        ))
      ) : (
        <option disabled>No HR users found</option>
      )}
    </select>
    <span style={styles.selectIcon}>▼</span>
  </div>
</div>

        </div>

        <div style={styles.buttonContainer}>
          <button type="button" style={{...styles.button, ...styles.cancelButton}}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{...styles.button, ...styles.createButton}}>
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskForm;