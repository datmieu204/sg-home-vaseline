import React, { useState } from 'react';
import './Styles_all_accounts.css';

const EmployeeAccount = ({ userData, isEditing, onSave, onCancel }) => {
  const [formData, setFormData] = useState({...userData});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="account-form-container">
      <div className="account-section">
        <div className="account-form">
          <div className="form-left">
            <div className="form-group">
              <label>Tên đầy đủ</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-value">{userData.fullName}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Chức vụ</label>
              {isEditing ? (
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-value">{userData.position}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Số điện thoại</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-value">{userData.phoneNumber}</div>
              )}
            </div>
          </div>
          
          <div className="form-right">
            <div className="form-group">
              <label>Bộ phận</label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-value">{userData.department}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Ngày bắt đầu</label>
              {isEditing ? (
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-value">{userData.startDate}</div>
              )}
            </div>
            
            <div className="form-group full-width">
              <label>Địa chỉ</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-value">{userData.address}</div>
              )}
            </div>
            
            {isEditing && (
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onCancel}>
                  Hủy
                </button>
                <button type="button" className="save-btn" onClick={handleSubmit}>
                  Lưu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="login-section">
        <h3>Thông tin đăng nhập</h3>
        <div className="form-group">
          <label>Tên người dùng</label>
          <div className="form-value">{userData.username}</div>
        </div>
        
        <div className="form-group">
          <label>Mật khẩu</label>
          <div className="form-value">••••••••</div>
        </div>
        
        <div className="form-group">
          <label>Nhập lại mật khẩu</label>
          <div className="form-value">••••••••</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAccount;