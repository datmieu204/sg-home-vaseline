import React, { useState, useEffect } from 'react';
import './AccountPage.css';
import { FiEdit2, FiUser, FiLock, FiX, FiChevronDown } from 'react-icons/fi';

const AccountPage = ({ userRole }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [editMode, setEditMode] = useState(null); // 'info' or 'password'
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  useEffect(() => {
    // Fetch user data based on role
    // In a real app, this would come from an API
    const mockUserData = {
      admin: {
        fullName: 'Nguyễn Thị Tlam',
        username: 'Tlam',
        position: 'Trưởng Ban Quản lý',
        phoneNumber: '+84 868109250',
        startDate: '29/04/2025',
        address: 'Yên Hoà, Cầu Giấy, Hà Nội, Việt Nam',
      },
      resident: {
        fullName: 'Nguyễn Thị Thanh Lam',
        username: 'Tlam',
        representativeName: 'Nguyễn Thị Thanh Lam',
        apartmentNumber: '666',
        members: 4,
        phoneNumber: '+84 868109250',
      },
      employee: {
        fullName: 'Nguyễn Thị Thanh Lam',
        username: 'Tlam',
        position: 'Nhân viên',
        department: 'Bảo vệ',
        phoneNumber: '+84 868109250',
        startDate: '29/04/2025',
        address: 'Yên Hoà, Cầu Giấy, Hà Nội, Việt Nam',
      },
      leader: {
        fullName: 'Nguyễn Thị Tlam',
        username: 'Tlam',
        position: 'Trưởng Ban Quản lý',
        phoneNumber: '+84 868109250',
        startDate: '29/04/2025',
        address: 'Yên Hoà, Cầu Giấy, Hà Nội, Việt Nam',
      }
    };
    
    setUserData(mockUserData[userRole] || mockUserData.employee);
  }, [userRole]);

  const handleEdit = () => {
    setShowOptions(!showOptions);
  };

  const handleEditOption = (mode) => {
    setEditMode(mode);
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    setEditMode(null);
    // In a real app, save to backend
    console.log('Saving user data:', userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditMode(null);
    setPasswords({
      current: '',
      new: '',
      confirm: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
  };

  if (!userData) return <div className="loading">Loading...</div>;

  const renderUserInfoForm = () => {
    // Admin/Leader View
    if (userRole === 'admin' || userRole === 'leader') {
      return (
        <div className="info-container">
          <div className="form-row">
            <div className="form-group">
              <label>Tên đầy đủ</label>
              {isEditing && editMode === 'info' ? (
                <input
                  name="fullName"
                  type="text"
                  value={userData.fullName}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{userData.fullName}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Chức vụ</label>
              {isEditing && editMode === 'info' ? (
                <input
                  name="position"
                  type="text"
                  value={userData.position}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{userData.position}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Số điện thoại</label>
              {isEditing && editMode === 'info' ? (
                <input
                  name="phoneNumber"
                  type="text"
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{userData.phoneNumber}</div>
              )}
            </div>
            <div className="form-group">
              <label>Ngày bắt đầu</label>
              {isEditing && editMode === 'info' ? (
                <input
                  name="startDate"
                  type="text"
                  value={userData.startDate}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{userData.startDate}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Địa chỉ</label>
              {isEditing && editMode === 'info' ? (
                <input
                  name="address"
                  type="text"
                  value={userData.address}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{userData.address}</div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    // Resident View
    if (userRole === 'resident') {
      return (
        <div className="info-container">
          <div className="form-row">
            <div className="form-group">
              <label>Tên đại diện</label>
              {isEditing && editMode === 'info' ? (
                <input
                  name="representativeName"
                  type="text"
                  value={userData.representativeName}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{userData.representativeName}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Số phòng</label>
              {isEditing && editMode === 'info' ? (
                <input
                  name="apartmentNumber"
                  type="text"
                  value={userData.apartmentNumber}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{userData.apartmentNumber}</div>
              )}
            </div>
            <div className="form-group">
              <label>Số thành viên</label>
              {isEditing && editMode === 'info' ? (
                <input
                  name="members"
                  type="number"
                  value={userData.members}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{userData.members}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Số điện thoại</label>
              {isEditing && editMode === 'info' ? (
                <input
                  name="phoneNumber"
                  type="text"
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{userData.phoneNumber}</div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    // Employee View
    return (
      <div className="info-container">
        <div className="form-row">
          <div className="form-group">
            <label>Tên đầy đủ</label>
            {isEditing && editMode === 'info' ? (
              <input
                name="fullName"
                type="text"
                value={userData.fullName}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              <div className="form-value">{userData.fullName}</div>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Chức vụ</label>
            {isEditing && editMode === 'info' ? (
              <input
                name="position"
                type="text"
                value={userData.position}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              <div className="form-value">{userData.position}</div>
            )}
          </div>
          <div className="form-group">
            <label>Bộ phận</label>
            {isEditing && editMode === 'info' ? (
              <input
                name="department"
                type="text"
                value={userData.department}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              <div className="form-value">{userData.department}</div>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Số điện thoại</label>
            {isEditing && editMode === 'info' ? (
              <input
                name="phoneNumber"
                type="text"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              <div className="form-value">{userData.phoneNumber}</div>
            )}
          </div>
          <div className="form-group">
            <label>Ngày bắt đầu</label>
            {isEditing && editMode === 'info' ? (
              <input
                name="startDate"
                type="text"
                value={userData.startDate}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              <div className="form-value">{userData.startDate}</div>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Địa chỉ</label>
            {isEditing && editMode === 'info' ? (
              <input
                name="address"
                type="text"
                value={userData.address}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              <div className="form-value">{userData.address}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPasswordForm = () => {
    return (
      <div className="password-form">
        <div className="form-group">
          <label>Tên người dùng</label>
          <div className="form-value">{userData.username}</div>
        </div>
        
        {isEditing && editMode === 'password' ? (
          <>
            <div className="form-group">
              <label>Mật khẩu hiện tại</label>
              <input
                type="password"
                name="current"
                value={passwords.current}
                onChange={handlePasswordChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                name="new"
                value={passwords.new}
                onChange={handlePasswordChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Nhập lại mật khẩu mới</label>
              <input
                type="password"
                name="confirm"
                value={passwords.confirm}
                onChange={handlePasswordChange}
                className="form-control"
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="form-value">••••••••</div>
            </div>
            <div className="form-group">
              <label>Nhập lại mật khẩu</label>
              <div className="form-value">••••••••</div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="account-page">
      <div className="account-header">
        <div className="user-avatar-section">
          <div className="user-avatar">
            <FiUser className="avatar-icon" />
          </div>
          <div className="user-info">
            <h2 className="user-name">
              {(userRole === 'admin' || userRole === 'leader') ? userData.fullName : 
                userData.fullName || userData.representativeName}
            </h2>
            <p className="user-role">
              {userRole === 'resident' ? '' : 
                (userRole === 'admin' || userRole === 'leader') ? 'Trưởng Ban Quản lý' : 
                  'Nhân viên Bảo vệ'}
            </p>
          </div>
        </div>
        
        <div className="edit-options-container">
          <button className="edit-profile-btn" onClick={handleEdit}>
            <FiEdit2 /> Chỉnh sửa
          </button>
          
          {showOptions && (
            <div className="edit-dropdown">
              <button className="close-dropdown" onClick={() => setShowOptions(false)}>
                <FiX />
              </button>
              <button className="edit-option" onClick={() => handleEditOption('info')}>
                <FiUser /> Chỉnh sửa thông tin
              </button>
              <button className="edit-option" onClick={() => handleEditOption('password')}>
                <FiLock /> Đổi mật khẩu
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="account-content">
        <div className="account-column">
          <div className="column-header">
            <FiUser className="column-icon" />
            <h2>Thông tin cá nhân</h2>
          </div>
          <div className="column-content">
            {renderUserInfoForm()}
            
            {isEditing && editMode === 'info' && (
              <div className="form-actions">
                <button onClick={handleCancel} className="cancel-btn">Hủy</button>
                <button onClick={handleSave} className="save-btn">Lưu</button>
              </div>
            )}
          </div>
        </div>
        
        <div className="account-column">
          <div className="column-header">
            <FiLock className="column-icon" />
            <h2>Thông tin đăng nhập</h2>
          </div>
          <div className="column-content">
            {renderPasswordForm()}
            
            {isEditing && editMode === 'password' && (
              <div className="form-actions">
                <button onClick={handleCancel} className="cancel-btn">Hủy</button>
                <button onClick={handleSave} className="save-btn">Lưu</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;