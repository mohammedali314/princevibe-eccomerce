import React, { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.scss';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Only send firstName, lastName, and phone for update
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      };
      await updateUser(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      {/* Luxury Header */}
      <div className="profile-header-section">
        <div className="container">
          <h1>User Profile</h1>
          <p>Manage your personal information</p>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" />
            ) : (
              <UserCircleIcon className="avatar-icon" />
            )}
          </div>
          <div className="profile-info">
            <h2>{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User Profile'}</h2>
            <p>{user?.email}</p>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <PencilIcon className="icon" />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave} disabled={loading}>
                  <CheckIcon className="icon" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  <XMarkIcon className="icon" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                  />
                ) : (
                  <div className="info-display">
                    <UserCircleIcon className="info-icon" />
                    <span>{formData.firstName || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                  />
                ) : (
                  <div className="info-display">
                    <UserCircleIcon className="info-icon" />
                    <span>{formData.lastName || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="info-display email-verified">
                  <EnvelopeIcon className="info-icon" />
                  <span>{user?.email || 'Not provided'}</span>
                  <div className="verification-badge">
                    <CheckBadgeIcon className="verified-icon" />
                    <span>Verified</span>
                  </div>
                </div>
                <p className="field-note">Email cannot be changed for security reasons</p>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="info-display">
                    <PhoneIcon className="info-icon" />
                    <span>{formData.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 