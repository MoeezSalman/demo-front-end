import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; 

const BudgetReviewPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
 const location = useLocation();
  const {
    title,
    description,
    assignedBy,
    assignee,
    deadline,
    status,
    priority
  } = location.state || {};
  
const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]);
};

  const [pasteLink, setPasteLink] = useState('');
const handleSubmit = async () => {
  if (!selectedFile && !pasteLink) {
    alert("Please upload a file or paste a link.");
    return;
  }

  const formData = new FormData();
  if (selectedFile) formData.append("file", selectedFile);
  if (pasteLink) formData.append("link", pasteLink);
  formData.append("title", title); // title comes from router state
formData.append('email',localStorage.getItem('email'));
formData.append("userId", localStorage.getItem("userId"));
  try {
    const res = await fetch("http://localhost:5000/api/auth/upload-work", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("File submitted successfully!");
    } else {
      alert(data.message || "Upload failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};


  return (
    
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              padding: '4px'
            }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              {title || "Task Detail"}
            </h1>
          </div>
          <button  onClick={handleSubmit} style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Submit for Review
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px'
        }}>
          {/* Left Column */}
          <div>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>
                Description:
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0
              }}>
                {description || "No description provided."}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  width: '80px'
                }}>
                  Status:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" fill="#f59e0b" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span style={{ color: '#d97706', fontSize: '14px', fontWeight: '500' }}>
                    {status || "Unknown"}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  width: '80px'
                }}>
                  Priority:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#ef4444',
                    borderRadius: '2px'
                  }}></div>
                  <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '500' }}>
                    {priority || "Not set"}
                  </span>
                </div>
              </div>

              {/* Assigned to */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span style={{
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Assigned to:
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#92400e'
                    }}>
                      O
                    </span>
                  </div>
                  <span style={{ color: '#1f2937', fontSize: '14px', fontWeight: '500' }}>
                    {typeof assignee === 'object' ? assignee.username : assignee || "Unknown"}

                  </span>
                  
                </div>
                
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span style={{
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Assigned By:
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#92400e'
                    }}>
                      O
                    </span>
                  </div>
                  <span style={{ color: '#1f2937', fontSize: '14px', fontWeight: '500' }}>
                    {typeof assignedBy === 'object' ? assignedBy.username : assignedBy || "Unknown"}

                  </span>
                  
                </div>
                
              </div>

              {/* Department */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span style={{
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Department:
                  </span>
                </div>
                <span style={{ color: '#1f2937', fontSize: '14px', fontWeight: '500' }}>
                  IT
                </span>
              </div>

              {/* Deadline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Deadline:
                  </span>
                </div>
                <span style={{ color: '#1f2937', fontSize: '14px', fontWeight: '500' }}>
                  {deadline ? new Date(deadline).toLocaleDateString() : "No deadline"}

                </span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '24px',
              margin: '0 0 24px 0'
            }}>
              Upload File:
            </h2>
            
            {/* Upload Area */}
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '48px 20px',
              textAlign: 'center',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="32" height="32" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '500' }}>
                  Upload File
                </span>

                <input
  type="file"
  onChange={handleFileChange}
  style={{ marginBottom: "16px" }}
/>
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              margin: '24px 0',
              color: '#9ca3af',
              fontSize: '14px'
            }}>
              OR
            </div>

            {/* Paste Link */}
            <div>
              <label style={{
                display: 'block',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Paste Link
              </label>
              <input
                type="text"
                value={pasteLink}
                onChange={(e) => setPasteLink(e.target.value)}
                placeholder="Paste your link here"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#f9fafb',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetReviewPage;