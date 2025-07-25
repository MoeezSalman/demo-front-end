import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';


const AddMember = () => {
  const location = useLocation();
  const teamName = location.state?.teamName || 'Team';
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    department: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  const [dropdownStates, setDropdownStates] = useState({
    department: false,
    role: false,
    password: false,
    confirmPassword: false
  });



  // Mock team data - in real app this would come from props or params


  const departments = ['Engineering', 'Marketing', 'Sales', 'Finance'];
  const roles = ['HR', 'Employee', 'Auditor', 'Manager'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDropdown = (field) => {
    setDropdownStates(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const selectOption = (field, value) => {
    handleInputChange(field, value);
    setDropdownStates(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.workEmail ||
      !formData.department ||
      !formData.role ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/team/add-member-to-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          workEmail: formData.workEmail,
          department: formData.department,
          role: formData.role,
          password: formData.password,
          teamName: teamName // from location.state
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Member added successfully!');
        // Optionally navigate or reset form
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Server error');
    }
  };


  const handleCancel = () => {
    console.log('Cancel adding member');
    // Handle cancel action
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: '400px' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '14px',
          marginBottom: '20px',
          fontWeight: '500'
        }}>
          Add Team Member
        </div>

        {/* Modal */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          position: 'relative'
        }}>
          {/* Close button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              style={{
                width: '28px',
                height: '28px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6b7280'
              }}
              onClick={handleCancel}
            >
              <X size={14} />
            </button>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            textAlign: 'center',
            marginBottom: '24px',
            margin: '0 0 24px 0'
          }}>
            Add Team Member
          </h2>

          {/* Team info */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '4px'
            }}>
              Adding member to:
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#2563eb'
            }}>
              {teamName}
            </div>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Full Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Work Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Work Email
              </label>
              <input
                type="email"
                value={formData.workEmail}
                onChange={(e) => handleInputChange('workEmail', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Department */}
            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Department
              </label>
              <button
                type="button"
                onClick={() => toggleDropdown('department')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  textAlign: 'left',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: formData.department ? '#111827' : '#9ca3af',
                  boxSizing: 'border-box'
                }}
              >
                <span>{formData.department || 'Select an Option'}</span>
                <ChevronDown size={16} style={{ color: '#9ca3af' }} />
              </button>
              {dropdownStates.department && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  right: '0',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  marginTop: '4px'
                }}>
                  {departments.map((dept, index) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => selectOption('department', dept)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        borderRadius: index === 0 ? '8px 8px 0 0' : index === departments.length - 1 ? '0 0 8px 8px' : '0'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role */}
            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Role
              </label>
              <button
                type="button"
                onClick={() => toggleDropdown('role')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  textAlign: 'left',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: formData.role ? '#111827' : '#9ca3af',
                  boxSizing: 'border-box'
                }}
              >
                <span>{formData.role || 'Select a Role'}</span>
                <ChevronDown size={16} style={{ color: '#9ca3af' }} />
              </button>
              {dropdownStates.role && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  right: '0',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  marginTop: '4px'
                }}>
                  {roles.map((role, index) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => selectOption('role', role)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        borderRadius: index === 0 ? '8px 8px 0 0' : index === roles.length - 1 ? '0 0 8px 8px' : '0'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>


            {/* Confirm Password */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '32px'
          }}>
            <button
              onClick={handleCancel}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMember;