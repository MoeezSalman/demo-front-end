import React, { useState, useEffect } from 'react';

const CreateNewTeam = () => {
  const [teamTitle, setTeamTitle] = useState('Q1 Budget Review');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [assignedToId, setAssignedToId] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 1) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/auth/search-users?query=${searchTerm}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      }
    };
    fetchSuggestions();
  }, [searchTerm]);

  const addMemberToTeam = (user) => {
    if (!selectedMembers.find(member => member._id === user._id)) {
      const departmentToAssign = selectedDepartment !== 'All' ? selectedDepartment : 'N/A';

      setSelectedMembers([
        ...selectedMembers,
        { ...user, permission: 'Can View', department: departmentToAssign }
      ]);
    }
    setSearchTerm('');
    setSuggestions([]);
  };



  const handleCreateTeam = async () => {
    console.log("Sending payload:", {
      title: teamTitle,
      assignedToId,
      members: selectedMembers.map(member => ({
        userId: member._id,
        permission: member.permission || 'Can View',
        department: member.department || 'N/A'
      }))
    });

    try {
      const res = await fetch('http://localhost:5000/api/team/create-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: teamTitle,
          assignedToId,
          // ✅ send the selected department
          members: selectedMembers.map(member => ({
            userId: member._id,
            permission: member.permission || 'Can View',
            department: member.department || 'N/A'
          }))

        })
      });
      const data = await res.json();
      alert('Team created successfully!');
      console.log('Team created:', data);
    } catch (err) {
      console.error('Error creating team:', err);
      alert('Error creating team');
    }
  };


  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '32px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <span style={{ color: '#007bff', marginRight: '8px', cursor: 'pointer' }}>←</span>
        <span style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Create New Team</span>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px', display: 'block' }}>Title *</label>
        <input
          type="text"
          value={teamTitle}
          onChange={(e) => setTeamTitle(e.target.value)}
          style={{ width: '100%', padding: '12px', fontSize: '16px', border: '2px solid #e1e5e9', borderRadius: '8px', marginBottom: '4px' }}
          placeholder="Enter team title"
        />
        <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>{teamTitle.length} characters</div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Members</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: '1' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: '14px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #e1e5e9', borderRadius: '6px', fontSize: '14px' }}
            />
            {suggestions.length > 0 && (
              <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', listStyle: 'none', margin: 0, padding: '4px 0', zIndex: 1000 }}>
                {suggestions.map(user => (
                  <li
                    key={user._id}
                    onClick={() => addMemberToTeam(user)}
                    style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  >
                    {user.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e1e5e9', borderRadius: '6px', fontSize: '14px' }}>
            <option value="All">Department: All</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Product">Product</option>
          </select>
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e1e5e9', borderRadius: '6px', fontSize: '14px' }}>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {selectedMembers.map(member => (
            <div key={member._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '500', color: '#666' }}>
                  {member.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '2px' }}>{member.username}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{member.role || 'Member'}</div>
                </div>
              </div>
              <select
                value={member.permission}
                onChange={(e) => {
                  const updated = selectedMembers.map(m => m._id === member._id ? { ...m, permission: e.target.value } : m);
                  setSelectedMembers(updated);
                }}
                style={{ padding: '6px 12px', border: '1px solid #e1e5e9', borderRadius: '6px', fontSize: '12px', backgroundColor: 'white' }}
              >
                <option value="Can View">Can View</option>
                <option value="Can Edit">Can Edit</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '24px', borderTop: '1px solid #e1e5e9' }}>
        <button style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', backgroundColor: 'transparent', color: '#666' }}>
          Cancel
        </button>
        <button style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', backgroundColor: '#007bff', color: 'white' }} onClick={handleCreateTeam}>
          Create Team
        </button>
      </div>
    </div>
  );
};

export default CreateNewTeam;