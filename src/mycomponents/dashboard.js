import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
 const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [activeView, setActiveView] = useState('Table');
  const [activeTeamTab, setActiveTeamTab] = useState('Teams');
  const [monthlyData, setMonthlyData] = useState({});
  const [userRole, setUserRole] = useState('');
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [auditorFiles, setAuditorFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();
const handleTaskClick = (task, userName) => {
  const isEmployee = userRole === 'employee';
  const isAuditor = userRole === 'Auditor';

  // Ensure we have all required task properties
  const taskData = {
    title: task.title || task.taskTitle || 'Untitled Task',
    description: task.description || task.taskDescription || '',
    assignedBy: task.assignedBy || { username: task.assignedByName || 'Unknown' },
    assignee: userName || task.assignedTo || 'Unknown',
    deadline: task.deadline || null,
    status: task.status || 'pending',
    priority: task.priority || 'medium',
    fileData: task.fileData || null,
    fileName: task.fileName || null,
    fileType: task.fileType || null,
    fullTask: task
  };

  if (isAuditor) {
    navigate(`/auditor-task/${task._id || task.id}`, {
      state: taskData
    });
  } else {
    navigate(isEmployee ? `/employee-task/${task._id}` : `/task/${task._id}`, {
      state: taskData
    });
  }
};
const userId = localStorage.getItem('userId');
const fetchAuditorFiles = async () => {
  try {
    // Add query parameter to exclude closed tasks
    const res = await fetch(`http://localhost:5000/api/team/auditor-files/${userId}?excludeClosed=true`);
    if (!res.ok) throw new Error('Failed to fetch files');
    
    const data = await res.json();
    
    if (data.success && data.files) {
      const processedFiles = data.files
        .filter(file => {
          // Double-check filtering on frontend as well
          const taskStatus = file.status || file.taskStatus || '';
          const normalizedStatus = taskStatus.toLowerCase().trim();
          
          console.log('File status check:', file.taskTitle, 'Status:', normalizedStatus);
          
          return normalizedStatus !== 'closed' && 
                 normalizedStatus !== 'completed' && 
                 normalizedStatus !== 'done';
        })
        .map(file => ({
          ...file,
          id: file._id,
          fileData: file.fileData?.toString('base64'),
          taskTitle: file.taskTitle,
          taskDescription: file.taskDescription,
          assignedByName: file.assignedByName || file.uploadedByName || 'Unknown'
        }));
      
      console.log('Processed files after filtering:', processedFiles.length);
      setAuditorFiles(processedFiles);
    }
  } catch (err) {
    console.error('Error fetching files:', err);
    setAuditorFiles([]);
  }
};
useEffect(() => {
  if (userRole === 'Auditor') {
    fetchAuditorFiles();
  }
}, [userRole]); // Fetch files when user role is set to Auditor
  const handleViewFile = (file) => {
    setSelectedFile(file);
  };

  const handleCloseFile = () => {
    setSelectedFile(null);
  };

useEffect(() => {
  const fetchTeams = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/team/all-teams');
      const data = await res.json();
      if (res.ok) {
        setTeams(data.teams);
      } else {
        console.error('Failed to fetch teams:', data.message);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  fetchTeams();
}, []);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    assigned: 0,
    review: 0,
    closed: 0,
  });

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '30px',
    },
    leftHeader: {
      display: 'flex',
      flexDirection: 'column',
    },
    welcomeText: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px',
    },
    welcomeName: {
      color: '#4285f4',
      fontWeight: '500',
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#333',
      margin: '0',
    },
    headerButtons: {
      display: 'flex',
      gap: '10px',
    },
    btn: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    btnOutline: {
      backgroundColor: 'white',
      color: '#4285f4',
      border: '1px solid #4285f4',
    },
    btnPrimary: {
      backgroundColor: '#4285f4',
      color: 'white',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '20px',
      marginBottom: '30px',
    },
    statCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center',
    },
    statCardTotal: {
      backgroundColor: '#4285f4',
      color: 'white',
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '5px',
    },
    statLabel: {
      fontSize: '14px',
      color: '#666',
    },
    statLabelWhite: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.8)',
    },
    kpiSection: {
      display: 'flex',
      gap: '30px',
      marginBottom: '30px',
    },
    kpiLeft: {
      flex: '1',
    },
    kpiRight: {
      width: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    kpiTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#333',
    },
    chartContainer: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      height: '200px',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: '8px',
    },
    chartBar: {
      width: '20px',
      backgroundColor: '#e3f2fd',
      borderRadius: '4px 4px 0 0',
      display: 'flex',
      alignItems: 'flex-end',
      position: 'relative',
    },
    chartBarActive: {
      backgroundColor: '#4285f4',
    },
    chartLabel: {
      fontSize: '12px',
      color: '#666',
      position: 'absolute',
      bottom: '-20px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    circularProgress: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: 'conic-gradient(#4285f4 0deg 180deg, #ff6b6b 180deg 198deg, #e3f2fd 198deg 360deg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginBottom: '20px',
    },
    circularProgressInner: {
      width: '80px',
      height: '80px',
      backgroundColor: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    progressNumber: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333',
    },
    progressLabel: {
      fontSize: '12px',
      color: '#666',
    },
    progressLegend: {
      display: 'flex',
      gap: '15px',
      fontSize: '12px',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    legendDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
    controlsBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    searchContainer: {
      position: 'relative',
      width: '250px',
    },
    searchInput: {
      width: '100%',
      padding: '8px 12px 8px 35px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#666',
    },
    filters: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
    },
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    filterLabel: {
      fontSize: '14px',
      color: '#666',
    },
    filterSelect: {
      padding: '6px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
    },
    viewTabs: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px',
    },
    viewTab: {
      padding: '10px 0',
      fontSize: '14px',
      color: '#666',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      fontWeight: '500',
    },
    viewTabActive: {
      color: '#4285f4',
      borderBottom: '2px solid #4285f4',
    },
    // Table styles for HR view
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      marginBottom: '30px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      borderBottom: '1px solid #e0e0e0',
    },
    tableCell: {
      padding: '15px',
      fontSize: '14px',
      color: '#333',
      borderBottom: '1px solid #f0f0f0',
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
    },
    statusActive: {
      backgroundColor: '#e3f2fd',
      color: '#1976d2',
    },
    statusCompleted: {
      backgroundColor: '#e8f5e8',
      color: '#2e7d32',
    },
    statusPending: {
      backgroundColor: '#fff3e0',
      color: '#f57c00',
    },
    // Task styles for employee view
    tasksSection: {
      display: 'flex',
      gap: '30px',
      marginBottom: '30px',
    },
    taskColumn: {
      flex: '1',
    },
    taskColumnTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '15px',
      color: '#333',
    },
    taskItem: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '10px',
    },
    taskTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '5px',
    },
    taskDescription: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '8px',
    },
    taskAssignedBy: {
      fontSize: '12px',
      color: '#4285f4',
      fontWeight: '500',
    },
    taskDeadline: {
      fontSize: '12px',
      color: '#ff6b6b',
      marginTop: '8px',
    },
    teamsSection: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    teamsTabs: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px',
    },
    teamTab: {
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      borderRadius: '20px',
      fontWeight: '500',
    },
    teamTabActive: {
      backgroundColor: '#4285f4',
      color: 'white',
    },
    teamTabInactive: {
      backgroundColor: '#f5f5f5',
      color: '#666',
    },
    teamsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
    },
    teamCard: {
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
    },
    teamName: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '5px',
      color: '#333',
    },
    teamDesc: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '15px',
    },
    teamMembers: {
      display: 'flex',
      gap: '5px',
    },
    memberAvatar: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      backgroundColor: '#4285f4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      fontWeight: '500',
      border: '2px solid white',
    },
    moreMembers: {
      backgroundColor: '#e3f2fd',
      color: '#4285f4',
    },
  };

  const monthsOrder = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const chartData = monthsOrder.map(month => ({
    month: month.slice(0, 3),
    height: (monthlyData[month] || 0) * 20,
    active: new Date().toLocaleString('default', { month: 'long' }) === month
  }));

  useEffect(() => {
    const fetchUserRole = async () => {
      const email = localStorage.getItem('email');
      console.log(email);
      if (!email) return;

      try {
        const res = await fetch('http://localhost:5000/api/auth/get-user-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
          setUserRole(data.role);
          console.log(data.role);
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        alert("User email not found");
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/user-stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
          setStats(data);
          setMonthlyData(data.monthlyTasks);
        } else {
          console.error('Failed to fetch stats:', data.message);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem('email');
      if (!email) return;

      try {
        // Fetch username
        const userRes = await fetch('http://localhost:5000/api/auth/get-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const userData = await userRes.json();
        if (userRes.ok && userData.username) {
          localStorage.setItem('name', userData.username);
        }

        // Fetch role-specific data
        if (userRole === 'HR') {
          // Fetch assigned tasks for HR
          const assignedRes = await fetch('http://localhost:5000/api/auth/hr-assigned-tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });

          const assignedData = await assignedRes.json();
          if (assignedRes.ok) {
            setAssignedTasks(assignedData.tasks || []);
          }
        } else {
          // Fetch user's assigned task
          const taskRes = await fetch('http://localhost:5000/api/auth/user-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });

          const taskData = await taskRes.json();
          
setUserTasks(taskData.tasks || []);

        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    if (userRole) {
      fetchUserData();
    }
  }, [userRole]);

  const usernamevalue = localStorage.getItem('name');

  const getStatusBadge = (status) => {
    const statusStyle = status === 'completed' ? styles.statusCompleted : 
                      status === 'active' ? styles.statusActive : styles.statusPending;
    
    return (
      <span style={{...styles.statusBadge, ...statusStyle}}>
        {status || 'Pending'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


  const renderHRView = () => (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Assigned To</th>
            <th style={styles.tableHeader}>Task Title</th>
            <th style={styles.tableHeader}>Description</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Deadline</th>
            <th style={styles.tableHeader}>Priority</th>
          </tr>
        </thead>
        <tbody>
          {assignedTasks.length > 0 ? (
            assignedTasks.map((task, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{task.assignedTo?.username || 'N/A'}</td>

                <td style={styles.tableCell}>{task.title || 'No title'}</td>
                <td style={styles.tableCell}>{task.description || 'No description'}</td>
                <td style={styles.tableCell}>{getStatusBadge(task.status)}</td>
                <td style={styles.tableCell}>{formatDate(task.deadline)}</td>
                <td style={styles.tableCell}>{task.priority || 'Medium'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{...styles.tableCell, textAlign: 'center', color: '#666'}}>
                No tasks assigned yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderEmployeeView = () => (
  <div style={styles.tasksSection}>
    {/* To Do Section */}
    <div style={styles.taskColumn}>
      <div style={styles.taskColumnTitle}>To Do</div>

      {userTasks.length > 0 ? (
        userTasks
          .filter((task) => {
            const status = task.status?.toLowerCase().trim();
            return (
              status &&
              ![
                'submitted and waiting for review',
                'review',
                'closed',
                'done',
                'completed'
              ].includes(status)
            );
          })
          .map((task, idx) => (
            <div
              key={task._id || idx}
              style={{ ...styles.taskItem, cursor: 'pointer' }}
              onClick={() => handleTaskClick(task, usernamevalue)}
            >
              <div style={styles.taskTitle}>{task.title}</div>
              <div style={styles.taskDescription}>{task.description}</div>
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy?.username}</div>
              {task.deadline && (
                <div style={styles.taskDeadline}>Deadline: {formatDate(task.deadline)}</div>
              )}
              {task.priority && (
                <div style={styles.taskDescription}>Priority: {task.priority}</div>
              )}
            </div>
          ))
      ) : (
        <div style={styles.taskItem}>
          <div style={styles.taskDescription}>No tasks in To Do</div>
        </div>
      )}
    </div>

    {/* In Progress Section */}
    <div style={styles.taskColumn}>
      <div style={styles.taskColumnTitle}>In Progress</div>

      {userTasks.some(task => {
        const status = task.status?.trim().toLowerCase();
        return status === 'submitted and waiting for review';
      }) ? (
        userTasks
          .filter(task => {
            const status = task.status?.trim().toLowerCase();
            return status === 'submitted and waiting for review';
          })
          .map((task, idx) => (
            <div
              key={task._id || idx}
              style={{ ...styles.taskItem, cursor: 'pointer' }}
              onClick={() => handleTaskClick(task, usernamevalue)}
            >
              <div style={styles.taskTitle}>{task.title}</div>
              <div style={styles.taskDescription}>{task.description}</div>
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy?.username}</div>
              {task.deadline && (
                <div style={styles.taskDeadline}>Deadline: {formatDate(task.deadline)}</div>
              )}
              {task.priority && (
                <div style={styles.taskDescription}>Priority: {task.priority}</div>
              )}
            </div>
          ))
      ) : (
        <div style={styles.taskItem}>
          <div style={styles.taskDescription}>No tasks in progress</div>
        </div>
      )}
    </div>

    {/* Completed Section */}
    <div style={styles.taskColumn}>
      <div style={styles.taskColumnTitle}>Completed</div>

      {userTasks.some(task => {
        const status = task.status?.trim().toLowerCase();
        return status === 'closed';
      }) ? (
        userTasks
          .filter(task => {
            const status = task.status?.trim().toLowerCase();
            return status === 'closed';
          })
          .map((task, idx) => (
            <div
              key={task._id || idx}
              style={{ ...styles.taskItem, cursor: 'pointer' }}
              onClick={() => handleTaskClick(task, usernamevalue)}
            >
              <div style={styles.taskTitle}>{task.title}</div>
              <div style={styles.taskDescription}>{task.description}</div>
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy?.username}</div>
              {task.deadline && (
                <div style={styles.taskDeadline}>Deadline: {formatDate(task.deadline)}</div>
              )}
              {task.priority && (
                <div style={styles.taskDescription}>Priority: {task.priority}</div>
              )}
            </div>
          ))
      ) : (
        <div style={styles.taskItem}>
          <div style={styles.taskDescription}>No tasks in progress</div>
        </div>
      )}
    </div>
  </div>
);

console.log("User Tasks:", userTasks);
userTasks.forEach((task, i) => {
  console.log(`Task ${i + 1}:`, task.title, "| Status:", task.status);
});


// Add these helper functions to your component

const getFileIcon = (fileType) => {
  if (!fileType) return '📄';
  
  if (fileType.includes('image')) return '🖼️';
  if (fileType.includes('pdf')) return '📕';
  if (fileType.includes('word')) return '📝';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
  if (fileType.includes('zip') || fileType.includes('compressed')) return '🗜️';
  if (fileType.includes('video')) return '🎬';
  if (fileType.includes('audio')) return '🎵';
  
  return '📄';
};

const formatFileSize = (base64String) => {
  if (!base64String) return '0 KB';
  const bytes = Math.ceil(base64String.length * 3 / 4);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const renderFileViewerModal = () => {
  const fileExtension = selectedFile.fileName.split('.').pop().toLowerCase();
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
            {selectedFile.fileName}
            <span style={{ fontSize: '14px', color: '#666', marginLeft: '10px' }}>
              ({formatFileSize(selectedFile.fileData)})
            </span>
          </h3>
          <button 
            onClick={handleCloseFile}
            style={{
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 10px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
        
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {renderFileContent(selectedFile, fileExtension)}
        </div>
        
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <a 
            href={`data:${selectedFile.fileType};base64,${selectedFile.fileData}`} 
            download={selectedFile.fileName}
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#4285f4',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Download File
          </a>
        </div>
      </div>
    </div>
  );
};

const renderFileContent = (file, extension) => {
  const base64Data = file.fileData;
  const dataUrl = `data:${file.fileType};base64,${base64Data}`;
  
  // Image files
  if (file.fileType.startsWith('image/')) {
    return <img src={dataUrl} alt={file.fileName} style={{ maxWidth: '100%', maxHeight: '60vh' }} />;
  }
  
  // PDF files
  if (file.fileType === 'application/pdf') {
    return (
      <embed 
        src={dataUrl}
        type="application/pdf"
        width="100%"
        height="500px"
      />
    );
  }
  
  // Text-based files
  const textExtensions = ['txt', 'csv', 'json', 'xml', 'html', 'css', 'js'];
  if (textExtensions.includes(extension)) {
    return (
      <pre style={{ 
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '4px',
        maxHeight: '60vh',
        overflow: 'auto',
        width: '100%'
      }}>
        {atob(base64Data)}
      </pre>
    );
  }
  
  // Video files
  if (file.fileType.startsWith('video/')) {
    return (
      <video controls style={{ maxWidth: '100%', maxHeight: '60vh' }}>
        <source src={dataUrl} type={file.fileType} />
        Your browser does not support the video tag.
      </video>
    );
  }
  
  // Audio files
  if (file.fileType.startsWith('audio/')) {
    return (
      <audio controls>
        <source src={dataUrl} type={file.fileType} />
        Your browser does not support the audio element.
      </audio>
    );
  }
  
  // Default fallback
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>
        {getFileIcon(file.fileType)}
      </div>
      <p>Preview not available for this file type</p>
      <p style={{ fontSize: '12px', color: '#666' }}>{file.fileType}</p>
    </div>
  );
};
const renderEmployeeDashboard = () => (
  <div style={styles.tasksSection}>
    {/* To Do Section */}
    <div style={styles.taskColumn}>
      <div style={styles.taskColumnTitle}>To Do</div>

      {userTasks.length > 0 ? (
        userTasks
          .filter((task) => {
            const normalizedStatus = task.status?.toLowerCase().trim();
            return normalizedStatus &&
              ![
                'submitted and waiting for review',
                'review',
                'in progress',
                'done',
                'completed',
              ].includes(normalizedStatus);
          })
          .map((task, idx) => (
            <div
              key={task._id || idx}
              style={{ ...styles.taskItem, cursor: 'pointer' }}
              onClick={() => handleTaskClick(task, usernamevalue)}
            >
              <div style={styles.taskTitle}>{task.title}</div>
              <div style={styles.taskDescription}>{task.description}</div>
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy?.username}</div>
              {task.deadline && (
                <div style={styles.taskDeadline}>Deadline: {formatDate(task.deadline)}</div>
              )}
              {task.priority && (
                <div style={styles.taskDescription}>Priority: {task.priority}</div>
              )}
            </div>
          ))
      ) : (
        <div style={styles.taskItem}>
          <div style={styles.taskDescription}>No tasks in To Do</div>
        </div>
      )}
    </div>

    {/* In Progress Section */}
    <div style={styles.taskColumn}>
      <div style={styles.taskColumnTitle}>In Progress</div>

      {userTasks.some(task => {
        const status = task.status?.trim().toLowerCase();
        return status === 'submitted and waiting for review';
      }) ? (
        userTasks
          .filter(task => {
            const status = task.status?.trim().toLowerCase();
            return status === 'submitted and waiting for review';
          })
          .map((task, idx) => (
            <div
              key={task._id || idx}
              style={{ ...styles.taskItem, cursor: 'pointer' }}
              onClick={() => handleTaskClick(task, usernamevalue)}
            >
              <div style={styles.taskTitle}>{task.title}</div>
              <div style={styles.taskDescription}>{task.description}</div>
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy?.username}</div>
              {task.deadline && (
                <div style={styles.taskDeadline}>Deadline: {formatDate(task.deadline)}</div>
              )}
              {task.priority && (
                <div style={styles.taskDescription}>Priority: {task.priority}</div>
              )}
            </div>
          ))
      ) : (
        <div style={styles.taskItem}>
          <div style={styles.taskDescription}>No tasks in progress</div>
        </div>
      )}
    </div>

    {/* Completed Section */}
    <div style={styles.taskColumn}>
      <div style={styles.taskColumnTitle}>Completed</div>

      {userTasks.some(task => {
        const status = task.status?.trim().toLowerCase();
        return status === 'done' || status === 'completed';
      }) ? (
        userTasks
          .filter(task => {
            const status = task.status?.trim().toLowerCase();
            return status === 'done' || status === 'completed';
          })
          .map((task, idx) => (
            <div
              key={task._id || idx}
              style={{ ...styles.taskItem, cursor: 'pointer' }}
              onClick={() => handleTaskClick(task, usernamevalue)}
            >
              <div style={styles.taskTitle}>{task.title}</div>
              <div style={styles.taskDescription}>{task.description}</div>
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy?.username}</div>
              {task.deadline && (
                <div style={styles.taskDeadline}>Deadline: {formatDate(task.deadline)}</div>
              )}
              {task.priority && (
                <div style={styles.taskDescription}>Priority: {task.priority}</div>
              )}
            </div>
          ))
      ) : (
        <div style={styles.taskItem}>
          <div style={styles.taskDescription}>No completed tasks</div>
        </div>
      )}
    </div>
  </div>
);

const handleCloseTask = async (taskTitle, taskId) => {
  try {
    const username = localStorage.getItem('name');
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!username || !userId) throw new Error('User not authenticated');

    const confirmed = window.confirm(
      `Close task "${taskTitle}"? This will delete all associated files.`
    );
    if (!confirmed) return;

    const response = await fetch(
      `http://localhost:5000/api/team/task/close/title/${encodeURIComponent(taskTitle)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: username,
          userId: userId  // Add userId to match backend expectation
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to close task');
    }

    console.log('Server response:', data);

    // Optimistic UI update
    setAuditorFiles(prev => prev.filter(file => 
      file.id !== taskId && file.taskTitle !== taskTitle
    ));

    alert(`Task "${taskTitle}" closed successfully. ${data.message}`);

  } catch (err) {
    console.error('Close task error:', err);
    alert(`Error: ${err.message}`);
  } finally {
    fetchAuditorFiles();
  }
};

// Add this function to handle file download
const handleDownloadFile = (file) => {
  const link = document.createElement('a');
  link.href = `data:${file.fileType};base64,${file.fileData}`;
  link.download = file.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
 useEffect(() => {
    if (userRole === 'Auditor') {
      fetchAuditorFiles();
    }
  }, [userRole]);

const renderAuditorView = () => {
  const auditorStyles = {
    auditorContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '20px',
      marginBottom: '30px',
    },
    auditorHeader: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    taskItem: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '15px',
      borderLeft: '4px solid #4285f4',
      border: '1px solid #e0e0e0',
    },
    taskTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '10px',
    },
    taskDescription: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '12px',
      lineHeight: '1.4',
    },
    taskMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '12px',
      color: '#888',
      marginBottom: '15px',
      padding: '8px 0',
      borderTop: '1px solid #e0e0e0',
      borderBottom: '1px solid #e0e0e0',
    },
    fileInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: '#555',
      marginBottom: '15px',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
    },
    viewButton: {
      backgroundColor: '#4285f4',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    downloadButton: {
      backgroundColor: '#34a853',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    closeButton: {
      backgroundColor: '#ea4335',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    fileModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    fileModalContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '80%',
      maxWidth: '800px',
      maxHeight: '80vh',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    fileModalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      borderBottom: '1px solid #eee',
      paddingBottom: '15px',
    },
    modalCloseButton: {
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '5px 10px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={auditorStyles.auditorContainer}>
      <div style={auditorStyles.auditorHeader}>
        <span>📋 Assigned Tasks</span>
        <span style={{ fontSize: '14px', color: '#666' }}>
          {auditorFiles.length} task{auditorFiles.length !== 1 ? 's' : ''} assigned
        </span>
      </div>

      {auditorFiles.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #ddd'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <p style={{ color: '#666', fontSize: '16px', margin: '0' }}>
            No tasks have been allocated to you yet.
          </p>
        </div>
      ) : (
        <div>
          {auditorFiles.map((file) => (
            <div key={file.id} style={auditorStyles.taskItem}>
              <div style={auditorStyles.taskTitle}>
                {file.taskTitle || 'Untitled Task'}
              </div>
              
              <div style={auditorStyles.taskDescription}>
                {file.taskDescription || 'No description available'}
              </div>

              <div style={auditorStyles.fileInfo}>
                <span>{getFileIcon(file.fileType)}</span>
                <span><strong>File:</strong> {file.fileName}</span>
                <span style={{ marginLeft: '10px' }}>
                  ({formatFileSize(file.fileData)})
                </span>
              </div>
              
              <div style={auditorStyles.taskMeta}>
                <span><strong>Assigned by:</strong> {file.assignedByName || 'Unknown'}</span>
                <span><strong>Date:</strong> {
                  file.uploadedAt 
                    ? new Date(file.uploadedAt).toLocaleDateString() 
                    : 'Unknown date'
                }</span>
              </div>

              <div style={auditorStyles.actionButtons}>
                <button 
                  style={auditorStyles.viewButton}
                  onClick={() => handleViewFile(file)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#3367d6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#4285f4'}
                >
                  👁️ View File
                </button>
                
                <button 
                  style={auditorStyles.downloadButton}
                  onClick={() => handleDownloadFile(file)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2d8f3f'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#34a853'}
                >
                  ⬇️ Download
                </button>
                
<button 
  style={auditorStyles.closeButton}
  onClick={() => {
    if (window.confirm('Are you sure you want to close this task? This action cannot be undone.')) {
      handleCloseTask(file.taskTitle || 'Untitled Task', file.id);
    }
  }}
>
  ✕ Close Task
</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Viewer Modal */}
      {selectedFile && (
        <div style={auditorStyles.fileModal}>
          <div style={auditorStyles.fileModalContent}>
            <div style={auditorStyles.fileModalHeader}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0' }}>
                {selectedFile.fileName}
                <span style={{ fontSize: '14px', color: '#666', marginLeft: '10px' }}>
                  ({formatFileSize(selectedFile.fileData)})
                </span>
              </h3>
              <button 
                onClick={handleCloseFile}
                style={auditorStyles.modalCloseButton}
              >
                ✕ Close
              </button>
            </div>
            
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {renderFileContent(selectedFile, selectedFile.fileName.split('.').pop().toLowerCase())}
            </div>
            
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button
                onClick={() => handleDownloadFile(selectedFile)}
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                ⬇️ Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.leftHeader}>
          <div style={styles.welcomeText}>
            Welcome back, <span style={styles.welcomeName}>{usernamevalue}</span>
          </div>
          <h1 style={styles.title}>Dashboard ({userRole})</h1>
        </div>
        <div style={styles.headerButtons}>
          <button style={{...styles.btn, ...styles.btnOutline}}>
            📤 Export
          </button>
          <button style={{...styles.btn, ...styles.btnPrimary}}>
            Create Task
          </button>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, ...styles.statCardTotal}}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabelWhite}>Total</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.inProgress}</div>
          <div style={styles.statLabel}>In-Progress</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.assigned}</div>
          <div style={styles.statLabel}>Assigned</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.review}</div>
          <div style={styles.statLabel}>Review</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.closed}</div>
          <div style={styles.statLabel}>Closed</div>
        </div>
      </div>

      <div style={styles.kpiSection}>
        <div style={styles.kpiLeft}>
          <div style={styles.kpiTitle}>Task KPIs</div>
          <div style={styles.chartContainer}>
            {chartData.map((item, index) => (
              <div
                key={index}
                style={{
                  ...styles.chartBar,
                  height: `${item.height}px`,
                  ...(item.active ? styles.chartBarActive : {})
                }}
              >
                <div style={styles.chartLabel}>{item.month}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.kpiRight}>
          <div style={{ ...styles.circularProgress, background: `conic-gradient(
            #ff6b6b 0deg ${stats.pending * 3.6}deg,
            #4285f4 ${stats.pending * 3.6}deg ${(stats.pending + stats.assigned) * 3.6}deg,
            #e3f2fd ${(stats.pending + stats.assigned) * 3.6}deg 360deg
          )` }}>
            <div style={styles.circularProgressInner}>
              <div style={styles.progressNumber}>{stats.total}</div>
              <div style={styles.progressLabel}>Total Tasks</div>
            </div>
          </div>
          <div style={styles.progressLegend}>
            <div style={styles.legendItem}>
              <div style={{...styles.legendDot, backgroundColor: '#ff6b6b'}}></div>
              <span>Overdue: {stats.pending}</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendDot, backgroundColor: '#4285f4'}}></div>
              <span>SLA Breaches: {stats.assigned}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.controlsBar}>
        <div style={styles.searchContainer}>
          <div style={styles.searchIcon}>🔍</div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filters}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Status:</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.filterSelect}>
              <option>All</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Types:</span>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={styles.filterSelect}>
              <option>All</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Priorities:</span>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={styles.filterSelect}>
              <option>All</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Departments:</span>
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} style={styles.filterSelect}>
              <option>All</option>
            </select>
          </div>
        </div>
      </div>

      <div style={styles.viewTabs}>
        <div style={{...styles.viewTab, ...(activeView === 'Table' ? styles.viewTabActive : {})}}>
          📊 Table
        </div>
        <div style={{...styles.viewTab, ...(activeView === 'Board' ? styles.viewTabActive : {})}}>
          📋 Board
        </div>
        <div style={{...styles.viewTab, ...(activeView === 'List' ? styles.viewTabActive : {})}}>
          📝 List
        </div>
      </div>

      {/* Conditional rendering based on user role */}
      {['hr', 'HR'].includes(userRole) ? renderHRView()
       : userRole === 'manager' ? renderEmployeeView()
       : userRole === 'employee' ? renderEmployeeDashboard()
       : userRole === 'Auditor' ? renderAuditorView()
       : null}


{userRole.toLowerCase() !== 'auditor' && (
      <div style={styles.teamsSection}>
        <div style={styles.teamsTabs}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Dept:</span>
            <select style={styles.filterSelect}>
              <option>All</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Role:</span>
            <select style={styles.filterSelect}>
              <option>All</option>
            </select>
          </div>
        </div>
        <div style={styles.teamsTabs}>
          <div style={{...styles.teamTab, ...(activeTeamTab === 'Teams' ? styles.teamTabActive : styles.teamTabInactive)}}>
            Teams
          </div>
          <div style={{...styles.teamTab, ...(activeTeamTab === 'Employees' ? styles.teamTabActive : styles.teamTabInactive)}}>
            Employees
          </div>
        </div>
       <div style={styles.teamsGrid}>
  {teams.length === 0 ? (
    <div>No teams found</div>
  ) : (
    teams.map((team, index) => (
      <div key={index} style={styles.teamCard}>
        <div
  style={{ ...styles.teamName, cursor: 'pointer', textDecoration: 'underline' }}
  onClick={() => navigate(`/addmember/${team._id}`)}
>
  {team.title}
</div>


        <div style={styles.teamDesc}>{team.description || 'No description'}</div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          <strong>Status:</strong>{' '}
          <span style={{
            color: team.status === 'completed' ? '#2e7d32' :
                   team.status === 'active' ? '#1976d2' :
                   '#f57c00',
            backgroundColor: team.status === 'completed' ? '#e8f5e8' :
                             team.status === 'active' ? '#e3f2fd' :
                             '#fff3e0',
            padding: '2px 6px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 500,
          }}>
            {team.status || 'pending'}
          </span>
        </div>
        <div style={styles.teamMembers}>
          {team.members.slice(0, 5).map((member, idx) => (
            <div key={idx} style={styles.memberAvatar}>
              {member.name?.charAt(0).toUpperCase()}
            </div>
          ))}
          {team.members.length > 5 && (
            <div style={{ ...styles.memberAvatar, ...styles.moreMembers }}>
              {team.members.length - 5}+
            </div>
          )}
        </div>
      </div>
    ))
  )}
</div>


      </div>
)}
    </div>
  );
};

export default Dashboard;