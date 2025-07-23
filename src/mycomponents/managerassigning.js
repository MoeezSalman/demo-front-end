import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const TaskDetailPage = () => {
const location = useLocation();
const {
  title,
  description,
  assignedBy,
  assignee,
  deadline,
  status        // ← grab it here
} = location.state || {};
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
const [showSearch,      setShowSearch]      = useState(false);
const [searchTerm,      setSearchTerm]      = useState('');
const [suggestions,     setSuggestions]     = useState([]);
const [selectedUser,    setSelectedUser]    = useState(null);
const currentUsername = assignee?.username || assignee;

const fetchHistory = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/team/history/${currentUsername}?title=${encodeURIComponent(title)}`);
    const data = await res.json();

    if (Array.isArray(data)) {
      setHistoryItems([...data].sort((a, b) => new Date(b.date) - new Date(a.date)));
    } else if (Array.isArray(data.history)) {
      setHistoryItems([...data.history].sort((a, b) => new Date(b.date) - new Date(a.date)));
    } else {
      setHistoryItems([]);
    }
  } catch (err) {
    console.error('Failed to fetch history:', err);
    setHistoryItems([]);
  }
};


useEffect(() => {
  fetchHistory();
}, [currentUsername]);

useEffect(() => {
  if (searchTerm.trim().length < 1) { setSuggestions([]); return; }
  const ctrl = new AbortController();
  (async () => {
    try {
      const res  = await fetch(
        `http://localhost:5000/api/auth/search-users?query=${encodeURIComponent(searchTerm)}`,
        { signal: ctrl.signal }
      );
      setSuggestions(await res.json());
    } catch (e) { if (e.name !== 'AbortError') console.error(e); }
  })();
  return () => ctrl.abort();
}, [searchTerm]);


const handleConfirm = async () => {
  if (!selectedUser) return;

  try {
    const response = await fetch(`http://localhost:5000/api/auth/assign-task/${selectedUser.username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assigner: currentUsername,
        assignee: selectedUser.username,
        title,
        description,
        deadline
      }),
    });

    if (response.status === 409) {
      const { message } = await response.json();
      alert(message);
      return;
    }

    if (!response.ok) throw new Error('Failed to assign task');

    alert('✔ Task assigned successfully');

    setHistoryItems(prev => [
      {
        id: Date.now(),
        action: `Assigned to ${selectedUser.username}`,
        date: new Date().toISOString(),
        user: currentUsername,
        type: 'assigned'
      },
      ...prev
    ]);

    setShowSearch(false);
    setSearchTerm('');
    setSuggestions([]);
    setSelectedUser(null);

    fetchHistory(); // ✅ make sure history updates with new status
  } catch (err) {
    console.error('❌ Assignment failed:', err);
    alert('Something went wrong while assigning the task');
  }
};



  const taskData = {
    title: "Q1 Budget Review",
    description: "The Q1 budget review evaluates allocations and identifies fund usage. Stakeholders analyze spending patterns to ensure resources align with goals, aiding informed decisions for future allocations.",
    status: "In-Progress",
    priority: location.state?.priority || 'Medium',
  assignedBy: assignedBy?.username || 'Unknown',
assignedTo: selectedUser?.username || assignee?.username || assignee || 'Not Assigned',

  department: location.state?.department || 'N/A',
  deadline: deadline || 'Not set'
  };

const [historyItems, setHistoryItems] = useState([]);





const handleMarkAsClosed = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/task/mark-closed", {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ assignee })  // `assignee` from location.state
    });

    if (!res.ok) throw new Error('Failed to update closed count');

    alert('✅ Task marked as done and closed count updated');
    setIsCompleted(true);
  } catch (err) {
    console.error('❌ Failed to mark as done:', err);
    alert('Something went wrong');
  }
};




  const getUserAvatar = (username) => {
  if (!username || typeof username !== 'string') return '#9ca3af'; // default gray
  const hash = username.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#c084fc'];
  return colors[hash % colors.length];
};


  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      display: 'flex',
      gap: '32px'
    },
    leftColumn: {
      flex: '2',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
    rightColumn: {
      flex: '1',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      height: 'fit-content'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      paddingLeft: '24px',
      paddingRight: '24px',
      paddingTop: '24px'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
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
      fontSize: '24px',
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    markButton: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '14px',
      backgroundColor: isCompleted ? '#dcfce7' : '#3b82f6',
      color: isCompleted ? '#166534' : 'white'
    },
    plusButton: {
  fontSize: '24px',
  padding: '8px 16px',
  border: '2px dashed #3b82f6',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  color: '#3b82f6',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
},

    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px'
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
      minWidth: '120px'
    },
    labelText: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280'
    },
    metadataValue: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827'
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#f59e0b'
    },
    priorityValue: {
      color: '#dc2626'
    },
    statusValue: {
      color: '#f59e0b'
    },
    avatar: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      fontWeight: '500'
    },
    historyItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '20px'
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
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
      marginBottom: '4px'
    },
    historyDate: {
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    historyUser: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '4px'
    },
    historyUserText: {
      fontSize: '12px',
      color: '#6b7280'
    },
    historyUserName: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#374151'
    },
    historyStatus: {
      fontSize: '12px',
      color: '#6b7280'
    },
    viewFileButton: {
      fontSize: '12px',
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '500'
    },
    smallAvatar: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '10px',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backButton} onClick={() => navigate(-1)}>←</button>

         <h1 style={styles.title}>{title}</h1>

        </div>
        <button 
          onClick={handleMarkAsClosed}
          style={styles.markButton}
        >
          {isCompleted ? 'Marked as Closed' : 'Mark as Closed'}
        </button>
      </div>

      <div style={styles.content}>
        {/* Left Column - Task Details */}
        <div style={styles.leftColumn}>
          <h2 style={styles.sectionTitle}>Description:</h2>
         <p style={styles.description}>{description}</p>


          {/* Task Metadata */}
          <div style={styles.metadataRow}>
            <div style={styles.metadataLabel}>
              <div style={styles.statusDot}></div>
              <span style={styles.labelText}>Status:</span>
            </div>
            <span style={{...styles.metadataValue, ...styles.statusValue}}>
              {isCompleted ? 'Completed' : taskData.status}
            </span>
          </div>

          <div style={styles.metadataRow}>
            <div style={styles.metadataLabel}>
              <span style={{color: '#dc2626'}}>🚩</span>
              <span style={styles.labelText}>Priority:</span>
            </div>
            <span style={{...styles.metadataValue, ...styles.priorityValue}}>
              {taskData.priority}
            </span>
          </div>

          <div style={styles.metadataRow}>
  {/* --- Assign Task row --- */}
<div style={styles.metadataRow}>
  <div style={styles.metadataLabel}>
    <span>👤</span>
    <span style={styles.labelText}>Assign Task:</span>
  </div>

  {showSearch ? (
    <div style={{ position:'relative', flex:1 }}>
      {/* search input */}
      <input
        autoFocus
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search user…"
        style={{
          width:'100%', padding:'8px 32px 8px 32px',
          border:'1px solid #e1e5e9', borderRadius:6
        }}
      />
      <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}>🔍</span>

      {/* dropdown */}
      {suggestions.length > 0 && (
        <ul style={{
          position:'absolute', top:'100%', left:0, right:0,
          background:'#fff', border:'1px solid #ccc', borderRadius:4,
          listStyle:'none', margin:0, padding:'4px 0', zIndex:1000,
          maxHeight:160, overflowY:'auto'
        }}>
          {suggestions.map(u => (
            <li key={u._id}
                onClick={() => setSelectedUser(u)}
                style={{
                  padding:'8px 12px', cursor:'pointer',
                  background:selectedUser?._id===u._id?'#dbeafe':'#fff',
                  borderBottom:'1px solid #eee'
                }}>
              {u.username} <small style={{color:'#666'}}>({u.email})</small>
            </li>
          ))}
        </ul>
      )}

      {/* confirm & cancel */}
      {selectedUser && (
        <div style={{ marginTop:8, display:'flex', gap:8 }}>
          <button
            onClick={handleConfirm}
            style={{ flex:1, background:'#10b981', color:'#fff',
                     border:'none', borderRadius:6, padding:'6px 12px' }}>
            Confirm
          </button>
          <button
            onClick={()=>{ setShowSearch(false); setSelectedUser(null); }}
            style={{ flex:1, background:'#f3f4f6', border:'none',
                     borderRadius:6, padding:'6px 12px' }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  ) : (
    <button
      style={styles.plusButton}
      onClick={() => setShowSearch(true)}
    >
      +
    </button>
  )}
</div>

</div>

          <div style={styles.metadataRow}>
            <div style={styles.metadataLabel}>
              <span>🏢</span>
              <span style={styles.labelText}>Department:</span>
            </div>
            <span style={styles.metadataValue}>{taskData.department}</span>
          </div>

          <div style={styles.metadataRow}>
            <div style={styles.metadataLabel}>
              <span>📅</span>
              <span style={styles.labelText}>Deadline:</span>
            </div>
            <span style={styles.metadataValue}>{taskData.deadline}</span>
          </div>
        </div>

        {/* Right Column - History */}
        <div style={styles.rightColumn}>
          <h2 style={styles.sectionTitle}>History:</h2>
{historyItems.map((item, index) => (
  <div key={item.id || index} style={styles.historyItem}>
    <div style={styles.historyDot}></div>
    <div style={styles.historyContent}>
      <div style={styles.historyAction}>{item.action}</div>

      <div style={styles.historyDate}>
        {item.date ? new Date(item.date).toLocaleString() : 'Unknown Date'}
      </div>

      <div style={styles.historyUser}>
        <div
          style={{
            ...styles.smallAvatar,
            backgroundColor: getUserAvatar(item.user)
          }}
        >
          {item.user?.charAt(0) || '?'}
        </div>
        <span style={styles.historyUserText}>Assigned by</span>
        <span style={styles.historyUserName}>{item.user || 'Unknown User'}</span>
      </div>

      {item.status && (
        <div style={styles.historyStatus}>Status: {item.status}</div>
      )}

      {item.hasFile && (
        <a href={`http://localhost:5000/api/task/${item.id}/file`} target="_blank" rel="noreferrer" style={styles.viewFileButton}>
          📎 View File
        </a>
      )}
    </div>
  </div>
))}



        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;