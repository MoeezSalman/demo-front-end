import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const FinanceDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [completedStats, setCompletedStats] = useState({ completed: 0, remaining: 0 });
  const { id: teamId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/team/all-teams');
        const data = await response.json();
        const allTeams = data.teams || [];

        // ✅ Filter to the one team based on ID
        const selectedTeam = allTeams.find(team => team._id === teamId);

        if (selectedTeam) {
          setTeams([selectedTeam]); // Only set the matched team
          const totalCompleted = selectedTeam.completedTasks || 0;
          const totalTasks = 100; // Adjust if needed
          const remaining = totalTasks - totalCompleted;

          setCompletedStats({
            completed: totalCompleted,
            remaining: remaining > 0 ? remaining : 0,
          });

          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const totals = months.map((month) => ({
            month,
            value: selectedTeam.monthlyStats?.[month] || 0
          }));

          setMonthlyData(totals);
        } else {
          setTeams([]); // No match
        }

      } catch (error) {
        console.error('Failed to fetch teams:', error);
      } finally {
        setLoadingTeams(false);
      }
    };

    if (teamId) fetchTeams();
  }, [teamId]);


  const handleDeleteTeam = async () => {
    if (!teams[0]?._id) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this team?');

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/team/team/${teams[0]._id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        alert('Team deleted successfully');
        navigate('/dashboard'); // or wherever your list of teams is
      } else {
        alert(result.message || 'Failed to delete team');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Server error');
    }
  };


  const [teamMembers] = useState([
    {
      id: 1,
      name: 'Omar',
      email: 'Omar@email.com',
      department: 'Design',
      role: 'Designer',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      name: 'Aisha',
      email: 'Aisha@email.com',
      department: 'Development',
      role: 'Developer',
      avatar: '👩‍💻'
    },
    {
      id: 3,
      name: 'Liam',
      email: 'Liam@email.com',
      department: 'Product Management',
      role: 'Product Manager',
      avatar: '👨‍💼'
    },
    {
      id: 4,
      name: 'Zara',
      email: 'Zara@email.com',
      department: 'Data',
      role: 'Data Analyst',
      avatar: '👩‍💼'
    },
    {
      id: 5,
      name: 'Noah',
      email: 'Noah@email.com',
      department: 'Marketing',
      role: 'Marketing Specialist',
      avatar: '👨‍💼'
    },
    {
      id: 6,
      name: 'Sophia',
      email: 'Sophia@email.com',
      department: 'Design',
      role: 'User Experience Designer',
      avatar: '👩‍🎨'
    }
  ]);

  const [monthlyData, setMonthlyData] = useState([]);



  const maxValue = Math.max(...monthlyData.map(d => d.value));

  const CircularProgress = ({ percentage }) => {
    const radius = 80;
    const strokeWidth = 10;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg
          height={radius * 2}
          width={radius * 2}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#3b82f6"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6' }}>{percentage}%</span>
        </div>
      </div>
    );
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    maxWidth: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    backArrow: {
      fontSize: '24px',
      color: '#6b7280',
      cursor: 'pointer'
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    deleteButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      color: '#dc2626',
      backgroundColor: 'transparent',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '32px',
      marginBottom: '32px'
    },
    chartContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    chartTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '24px'
    },
    chartArea: {
      height: '300px',
      display: 'flex',
      alignItems: 'end',
      justifyContent: 'space-between',
      gap: '8px',
      padding: '0 8px'
    },
    barContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
      height: '100%'
    },
    bar: {
      width: '24px',
      borderRadius: '4px 4px 0 0',
      transition: 'all 0.3s ease'
    },
    barLabel: {
      marginTop: '8px',
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280'
    },
    barLabelActive: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px'
    },
    progressContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px 24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    progressLabel: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '16px',
      marginBottom: '24px'
    },
    legend: {
      display: 'flex',
      gap: '24px'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    legendDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%'
    },
    legendText: {
      fontSize: '14px',
      color: '#6b7280'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f9fafb'
    },
    tableHeaderCell: {
      textAlign: 'left',
      padding: '16px 24px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      borderBottom: '1px solid #e5e7eb'
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6'
    },
    tableCell: {
      padding: '16px 24px',
      fontSize: '14px',
      color: '#1f2937'
    },
    userCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    avatar: {
      width: '40px',
      height: '40px',
      backgroundColor: '#f3f4f6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    },
    userName: {
      fontWeight: '500',
      color: '#1f2937'
    },
    actionButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    editButton: {
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    viewButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '8px 12px',
      backgroundColor: '#eff6ff',
      color: '#3b82f6',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.backArrow}>←</span>
            <h1 style={styles.title}>{teams[0]?.title || 'Team'}</h1>

          </div>
          <div style={styles.headerRight}>
            <button style={styles.deleteButton} onClick={handleDeleteTeam}>
              <span>🗑️</span>
              Delete Team
            </button>

            <button
              style={styles.addButton}
              onClick={() => {
                if (teams[0]) {
                  navigate(`/add-member/${teams[0]._id}`, {
                    state: { teamName: teams[0].title }
                  });
                }
              }}
            >
              <span>+</span>
              Add Team Member
            </button>

          </div>
        </div>

        {/* Dashboard Content */}
        <div style={styles.dashboardGrid}>
          {/* Task KPIs Chart */}
          <div style={styles.chartContainer}>
            <h2 style={styles.chartTitle}>Task KPIs</h2>
            <div style={styles.chartArea}>
              {monthlyData.map((data, index) => (
                <div key={data.month} style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.bar,
                      height: `${(data.value / maxValue) * 250}px`,
                      backgroundColor: data.month === 'Apr' ? '#3b82f6' : '#bfdbfe'
                    }}
                  />
                  <span style={data.month === 'Apr' ? styles.barLabelActive : { ...styles.barLabel }}>
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Rate */}

          <div style={styles.progressContainer}>
            <CircularProgress
              percentage={Math.round(
                (completedStats.completed /
                  (completedStats.completed + completedStats.remaining || 1)) * 100
              )}
            />
            <p style={styles.progressLabel}>Completion Rate</p>
            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: '#3b82f6' }} />
                <span style={styles.legendText}>Success</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: '#d1d5db' }} />
                <span style={styles.legendText}>Left Behind</span>
              </div>
            </div>
          </div>

        </div>

        {/* Team Members Table */}
        {/* Dynamic Team Members Table from Backend */}
        <div style={{ ...styles.tableContainer, marginTop: '32px' }}>
          <h2 style={{ ...styles.chartTitle, padding: '24px' }}>All Team Members (Fetched)</h2>
          {loadingTeams ? (
            <p style={{ padding: '24px' }}>Loading teams...</p>
          ) : teams.length === 0 ? (
            <p style={{ padding: '24px' }}>No teams found.</p>
          ) : (
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Name</th>
                  <th style={styles.tableHeaderCell}>Email</th>
                  <th style={styles.tableHeaderCell}>Department</th>
                  <th style={styles.tableHeaderCell}>Role</th>
                  <th style={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) =>
                  team.members?.map((member, idx) => {
                    return (
                      <tr key={`${team._id}-${idx}`} style={styles.tableRow}>
                        <td style={styles.tableCell}>
                          <div style={styles.userCell}>
                            <div style={styles.avatar}>👤</div>
                            <span style={styles.userName}>{member.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td style={styles.tableCell}>{member.email || 'N/A'}</td>
                        <td style={styles.tableCell}>{member.department || 'N/A'}</td>
                        <td style={styles.tableCell}>{member.permission || 'N/A'}</td>
                        <td style={styles.tableCell}>
                          <div style={styles.actionButtons}>
  <button 
  style={styles.editButton}
  onClick={() => {
    // Convert ObjectId to string if needed
    const userId = typeof member.user === 'object' && member.user !== null ? member.user._id : member.user;

    console.log('Navigating with user ID:', userId);
    navigate(`/userProfile/${userId}`);
  }}
>
  ✏️
</button>

                            <button style={styles.viewButton}>👁️ View</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default FinanceDashboard;