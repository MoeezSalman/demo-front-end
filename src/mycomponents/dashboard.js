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


  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
const handleTaskClick = (task, userName) => {
  const isEmployee = userRole === 'employee';

  navigate(`${isEmployee ? `/employee-task/${task._id}` : `/task/${task._id}`}`, {
    state: {
      title: task.title,
      description: task.description,
      assignedBy: task.assignedBy,
      assignee: userName,
      deadline: task.deadline,
      status: task.status,
      priority: task.priority,
    },
  });
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
                'in progress',
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
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy}</div>
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
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy}</div>
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
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy}</div>
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

console.log("User Tasks:", userTasks);
userTasks.forEach((task, i) => {
  console.log(`Task ${i + 1}:`, task.title, "| Status:", task.status);
});
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
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy}</div>
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
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy}</div>
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
              <div style={styles.taskAssignedBy}>Assigned by: {task.assignedBy}</div>
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
 : null}



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
    </div>
  );
};

export default Dashboard;