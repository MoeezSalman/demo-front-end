import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuditorTaskDetail = () => {
  const location = useLocation();
  const {
    title,
    description,
    assignedBy,
    assignee,
    deadline,
    status,
    priority,
    fileData,
    fileName,
    fileType,
    fullTask
  } = location.state || {};
  
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Define styles object
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px'
    },
    backButton: {
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '20px',
      color: '#6b7280'
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '24px'
    },
    description: {
      color: '#4b5563',
      lineHeight: '1.6',
      marginBottom: '32px'
    },
    metadataRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    },
    metadataLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '120px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280'
    },
    metadataValue: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827'
    },
    fileSection: {
      marginTop: '32px',
      padding: '24px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      border: '1px dashed #d1d5db'
    },
    fileActions: {
      display: 'flex',
      gap: '16px',
      marginTop: '16px'
    },
    fileButton: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    historyItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      marginBottom: '24px',
      paddingBottom: '24px',
      borderBottom: '1px solid #e5e7eb'
    },
    historyDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#10b981',
      marginTop: '4px',
      flexShrink: 0
    },
    historyContent: {
      flex: 1
    },
    historyAction: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#111827',
      marginBottom: '8px'
    },
    historyDate: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '12px'
    },
    historyUser: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    avatar: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      fontWeight: '500'
    },
    historyStatus: {
      fontSize: '14px',
      color: '#6b7280',
      fontStyle: 'italic'
    }
  };

  // Fetch complete assignment history using the /history/:username endpoint
  const fetchAssignmentHistory = async () => {
    try {
      // First get the full chain of users involved in this task's assignment
      const assignmentChain = await getAssignmentChain(assignedBy?.username || assignee);
      
      // Then fetch history for each user in the chain
      const allHistory = [];
      for (const username of assignmentChain) {
        const res = await fetch(`http://localhost:5000/api/team/history/${username}?title=${encodeURIComponent(title)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          allHistory.push(...data);
        }
      }
      
      // Process and merge all history items
      const processedHistory = allHistory.map(item => ({
        id: item.id,
        action: item.action,
        user: item.user,
        date: item.date,
        type: item.type,
        status: item.status,
        hasFile: item.hasFile
      }));

      // Sort by date (newest first)
      processedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setHistoryItems(processedHistory);
    } catch (err) {
      console.error('Error fetching assignment history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get the chain of users involved in assignments
  const getAssignmentChain = async (initialUsername) => {
    const chain = [initialUsername];
    try {
      let currentUsername = initialUsername;
      let keepLooking = true;
      
      while (keepLooking) {
        const res = await fetch(`http://localhost:5000/api/team/history/${currentUsername}?title=${encodeURIComponent(title)}`);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          // Find who assigned the task to the current user
          const assignment = data.find(item => 
            item.action.includes(`Assigned to ${currentUsername}`)
          );
          
          if (assignment && assignment.user && !chain.includes(assignment.user)) {
            chain.push(assignment.user);
            currentUsername = assignment.user;
          } else {
            keepLooking = false;
          }
        } else {
          keepLooking = false;
        }
      }
    } catch (err) {
      console.error('Error building assignment chain:', err);
    }
    
    return chain;
  };

  useEffect(() => {
    fetchAssignmentHistory();
  }, []);

  const getUserAvatar = (username) => {
    if (!username || typeof username !== 'string') return '#9ca3af';
    const hash = username.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#c084fc'];
    return colors[hash % colors.length];
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
          <h1 style={styles.title}>{title}</h1>
        </div>

        {/* Task Details */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Task Details</h2>
          <p style={styles.description}>{description}</p>

          <div style={styles.metadataRow}>
            <span style={styles.metadataLabel}>Status:</span>
            <span style={styles.metadataValue}>{status || 'Not specified'}</span>
          </div>
          <div style={styles.metadataRow}>
            <span style={styles.metadataLabel}>Priority:</span>
            <span style={styles.metadataValue}>{priority || 'Not specified'}</span>
          </div>
          <div style={styles.metadataRow}>
            <span style={styles.metadataLabel}>Assigned To:</span>
            <span style={styles.metadataValue}>{assignee || 'Not assigned'}</span>
          </div>
          <div style={styles.metadataRow}>
            <span style={styles.metadataLabel}>Deadline:</span>
            <span style={styles.metadataValue}>
              {deadline ? new Date(deadline).toLocaleDateString() : 'Not set'}
            </span>
          </div>

          {/* File Section */}
          {fileData && fileName && (
            <div style={styles.fileSection}>
              <h3 style={{ marginBottom: '16px' }}>Attached File</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>📄 {fileName}</span>
              </div>
              <div style={styles.fileActions}>
                <button 
                  style={styles.fileButton}
                  onClick={() => window.open(`data:${fileType};base64,${fileData}`, '_blank')}
                >
                  👁️ View File
                </button>
                <a
                  href={`data:${fileType};base64,${fileData}`}
                  download={fileName}
                  style={{ ...styles.fileButton, textDecoration: 'none' }}
                >
                  ⬇️ Download
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Assignment History */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Assignment History</h2>
          
          {loading ? (
            <p>Loading history...</p>
          ) : historyItems.length > 0 ? (
            historyItems.map((item, index) => (
              <div key={index} style={styles.historyItem}>
                <div style={styles.historyDot}></div>
                <div style={styles.historyContent}>
                  <div style={styles.historyAction}>{item.action}</div>
                  <div style={styles.historyDate}>
                    {item.date ? new Date(item.date).toLocaleString() : 'Unknown date'}
                  </div>
                  <div style={styles.historyUser}>
                    <div
                      style={{
                        ...styles.avatar,
                        backgroundColor: getUserAvatar(item.user)
                      }}
                    >
                      {item.user?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span>Assigned by: {item.user || 'Unknown'}</span>
                  </div>
                  {item.status && (
                    <div style={styles.historyStatus}>
                      Status at assignment: {item.status}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No assignment history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditorTaskDetail;