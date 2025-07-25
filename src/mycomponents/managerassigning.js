import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TaskDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    title,
    description,
    assignedBy,
    assignee,
    deadline,
    status,
    _id: taskId
  } = location.state || {};

  const [isCompleted, setIsCompleted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [taskFiles, setTaskFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);

  const currentUsername = assignee?.username || assignee;

  // Fetch task history
  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/team/history/${currentUsername}?title=${encodeURIComponent(title)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
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

  // Fetch task files
  const fetchTaskFiles = async () => {
    setIsLoadingFiles(true);
    try {
      let url = `http://localhost:5000/api/team/task/files`;
      const params = new URLSearchParams();
      
      if (taskId) params.append('taskId', taskId);
      else if (title) params.append('title', encodeURIComponent(title));
      else {
        console.error('No taskId or title provided');
        return;
      }

      url += `?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch files');

      if (data.success) {
        console.log(`Found ${data.totalFiles} files in ${data.totalTasks} tasks`);
        setTaskFiles(data.files || []);
      }
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
      setTaskFiles([]);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // Search team members
  // In your TaskDetailPage component
const searchTeamMembers = async (query) => {
  if (!query.trim()) {
    setSuggestions([]);
    return;
  }

  setIsLoadingTeamMembers(true);
  try {
    const currentUserId = localStorage.getItem('userId'); // Get from localStorage
    
    const res = await fetch(
      `http://localhost:5000/api/team/search-team-members?query=${encodeURIComponent(query)}&currentUserId=${currentUserId}`
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    setSuggestions(data);
  } catch (err) {
    console.error('Search failed:', err);
    setSuggestions([]);
  } finally {
    setIsLoadingTeamMembers(false);
  }
};

  useEffect(() => {
    if (title || taskId) {
      fetchHistory();
      fetchTaskFiles();
    }
  }, [title, taskId, currentUsername]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        searchTeamMembers(searchTerm);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleConfirm = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/assign-task/${selectedUser.username}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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

      fetchHistory();
    } catch (err) {
      console.error('❌ Assignment failed:', err);
      alert('Something went wrong while assigning the task');
    }
  };

  const handleMarkAsClosed = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/task/mark-closed", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ assignee })
      });

      if (!res.ok) throw new Error('Failed to update closed count');

      alert('✅ Task marked as done and closed count updated');
      setIsCompleted(true);
    } catch (err) {
      console.error('❌ Failed to mark as done:', err);
      alert('Something went wrong');
    }
  };

  const handleViewFile = (file) => {
    if (!file) {
      console.error('No file provided to view');
      alert('No file selected');
      return;
    }
    
    if (!file.fileData) {
      console.error('File data is missing:', file);
      alert('File content is not available');
      return;
    }

    const fileToView = {
      _id: file._id,
      fileName: file.fileName || 'Unnamed File',
      fileType: file.fileType || 'application/octet-stream',
      fileData: file.fileData,
      fileSize: file.fileSize,
      uploadedBy: file.uploadedBy,
      uploadedByName: file.uploadedByName
    };

    setSelectedFile(fileToView);
  };

  const handleCloseFile = () => {
    setSelectedFile(null);
  };

  const renderFileContent = () => {
    if (!selectedFile) return null;
    
    try {
      // For images
      if (selectedFile.fileType.startsWith('image/')) {
        return (
          <img 
            src={`data:${selectedFile.fileType};base64,${selectedFile.fileData}`} 
            alt={selectedFile.fileName}
            style={{ maxWidth: '100%', maxHeight: '80vh' }}
          />
        );
      }
      
      // For PDFs
      if (selectedFile.fileType === 'application/pdf') {
        return (
          <embed
            src={`data:${selectedFile.fileType};base64,${selectedFile.fileData}`}
            type="application/pdf"
            width="100%"
            height="500px"
          />
        );
      }
      
      // For text files
      if (selectedFile.fileType.startsWith('text/')) {
        const textContent = atob(selectedFile.fileData);
        return (
          <pre style={{ 
            whiteSpace: 'pre-wrap',
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '8px',
            maxHeight: '500px',
            overflow: 'auto'
          }}>
            {textContent}
          </pre>
        );
      }
    } catch (err) {
      console.error('Error rendering file:', err);
    }
    
    // Default view for unsupported types
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
        <p>Preview not available for this file type</p>
        <p style={{ color: '#666', marginTop: '8px' }}>{selectedFile.fileName}</p>
        <p style={{ color: '#999', fontSize: '12px' }}>Type: {selectedFile.fileType}</p>
      </div>
    );
  };

  const getUserAvatar = (username) => {
    if (!username || typeof username !== 'string') return '#9ca3af';
    const hash = username.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#c084fc'];
    return colors[hash % colors.length];
  };

  const taskData = {
    title: title || "Task Title",
    description: description || "No description provided",
    status: status || "In-Progress",
    priority: location.state?.priority || 'Medium',
    assignedBy: assignedBy?.username || 'Unknown',
    assignedTo: selectedUser?.username || assignee?.username || assignee || 'Not Assigned',
    department: location.state?.department || 'N/A',
    deadline: deadline || 'Not set'
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
      fontWeight: '500',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0
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
    },
    fileViewerModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    fileViewerContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative'
    },
    closeFileButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'
    },
    downloadFileButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      marginTop: '16px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block'
    },
    fileItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      marginBottom: '12px'
    },
    fileIcon: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e5e7eb',
      borderRadius: '6px',
      fontSize: '20px'
    },
    fileInfo: {
      flex: 1,
      marginLeft: '12px'
    },
    fileName: {
      fontWeight: '500'
    },
    fileMeta: {
      fontSize: '12px',
      color: '#6b7280'
    },
    viewButton: {
      padding: '8px 16px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    searchContainer: {
      position: 'relative',
      flex: 1
    },
    searchInput: {
      width: '100%',
      padding: '8px 32px 8px 32px',
      border: '1px solid #e1e5e9',
      borderRadius: '6px'
    },
    searchIcon: {
      position: 'absolute',
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)'
    },
    suggestionsList: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: '4px',
      listStyle: 'none',
      margin: 0,
      padding: '4px 0',
      zIndex: 1000,
      maxHeight: '160px',
      overflowY: 'auto'
    },
    suggestionItem: {
      padding: '8px 12px',
      cursor: 'pointer',
      borderBottom: '1px solid #eee'
    },
    selectedSuggestion: {
      backgroundColor: '#dbeafe'
    },
    actionButtons: {
      marginTop: '8px',
      display: 'flex',
      gap: '8px'
    },
    confirmButton: {
      flex: 1,
      background: '#10b981',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px'
    },
    cancelButton: {
      flex: 1,
      background: '#f3f4f6',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px'
    },
    loadingIndicator: {
      textAlign: 'center',
      padding: '8px',
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backButton} onClick={() => navigate(-1)}>←</button>
          <h1 style={styles.title}>{taskData.title}</h1>
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
          <p style={styles.description}>{taskData.description}</p>

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
            <div style={styles.metadataLabel}>
              <span>👤</span>
              <span style={styles.labelText}>Assign Task:</span>
            </div>

            {showSearch ? (
              <div style={styles.searchContainer}>
                <input
                  autoFocus
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search team members…"
                  style={styles.searchInput}
                />
                <span style={styles.searchIcon}>🔍</span>

                {isLoadingTeamMembers ? (
                  <div style={styles.loadingIndicator}>Searching...</div>
                ) : suggestions.length > 0 ? (
                  <ul style={styles.suggestionsList}>
                    {suggestions.map(u => (
                      <li 
                        key={u._id}
                        onClick={() => setSelectedUser(u)}
                        style={{
                          ...styles.suggestionItem,
                          ...(selectedUser?._id === u._id ? styles.selectedSuggestion : {})
                        }}
                      >
                        {u.username} <small style={{color: '#666'}}>({u.email})</small>
                      </li>
                    ))}
                  </ul>
                ) : searchTerm.trim() ? (
                  <div style={styles.loadingIndicator}>No team members found</div>
                ) : null}

                {selectedUser && (
                  <div style={styles.actionButtons}>
                    <button
                      onClick={handleConfirm}
                      style={styles.confirmButton}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => { 
                        setShowSearch(false); 
                        setSelectedUser(null); 
                        setSearchTerm('');
                      }}
                      style={styles.cancelButton}
                    >
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

          {/* Files Section */}
          <div style={{ marginTop: '32px' }}>
            <h2 style={styles.sectionTitle}>Attached Files:</h2>
            {isLoadingFiles ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Loading files...</div>
            ) : taskFiles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {taskFiles.map((file) => (
                  <div key={file._id} style={styles.fileItem}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={styles.fileIcon}>
                        {file.fileType.startsWith('image/') ? '🖼️' : 
                         file.fileType === 'application/pdf' ? '📄' : '📁'}
                      </div>
                      <div style={styles.fileInfo}>
                        <div style={styles.fileName}>{file.fileName}</div>
                        <div style={styles.fileMeta}>
                          From task: {file.taskTitle} • 
                          Uploaded by {file.uploadedByName} • 
                          {Math.round(file.fileSize / 1024)} KB
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewFile(file)}
                      style={styles.viewButton}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No files attached</div>
            )}
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
                  <button 
                    onClick={() => {
                      const fileToView = taskFiles.find(f => 
                        f.fileName === item.fileName || 
                        f._id === item.fileId ||
                        f.taskId === item.taskId
                      );
                      
                      if (fileToView) {
                        handleViewFile(fileToView);
                      } else {
                        alert('File not found or no longer available');
                      }
                    }}
                    style={styles.viewFileButton}
                  >
                    📎 View File
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Viewer Modal */}
      {selectedFile && (
        <div style={styles.fileViewerModal}>
          <div style={styles.fileViewerContent}>
            <button 
              style={styles.closeFileButton}
              onClick={handleCloseFile}
            >
              ×
            </button>
            <h3>{selectedFile.fileName}</h3>
            {renderFileContent()}
            <a
              href={`data:${selectedFile.fileType};base64,${selectedFile.fileData}`}
              download={selectedFile.fileName}
              style={styles.downloadFileButton}
            >
              Download File
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPage;