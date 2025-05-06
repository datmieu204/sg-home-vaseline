import React, { useState } from 'react';
import './Styles_all_accounts.css';

const ResidentAccount = ({ userData, isEditing, onSave, onCancel }) => {
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
              <label>Tên đại diện</label>
              {isEditing ? (
                <input
                  type="text"
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-value">{userData.representativeName}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Số phòng</label>
              {isEditing ? (
                <input
                  type="text"
                  name="apartmentNumber"
                  value={formData.apartmentNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-value">{userData.apartmentNumber}</div>
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
              <label>Số thành viên</label>
              {isEditing ? (
                <input
                  type="number"
                  name="members"
                  value={formData.members}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="form-value">{userData.members}</div>
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

export default ResidentAccount;