import React, { useState, useEffect } from 'react';
import './Account.css';

const Account = ({ profile, onConfirm }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    // Kiểm tra mật khẩu và nhập lại mật khẩu
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    // Tạo đối tượng mới với các trường thay đổi
    const updatedData = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== profile[key]) {  // So sánh giá trị cũ và mới
        updatedData[key] = formData[key];    // Chỉ cập nhật những trường thay đổi
      }
    });

    // Nếu có trường nào thay đổi, gọi hàm onConfirm để cập nhật
    if (Object.keys(updatedData).length > 0 && onConfirm) {
      onConfirm(updatedData);
    }

    setEditMode(false);  // Đóng chế độ chỉnh sửa sau khi xác nhận
  };

  return (
    <div className="account-container">
      <div className="account-left">
        <div className="account-header">
          <div>
            <h2 className="name">{formData.employee_name}</h2>
            <p className="position">{formData.position}</p>
          </div>
          <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
            ✏️ {editMode ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>
        <div className="form-group">
          <label>Tên đầy đủ</label>
          <input
            type="text"
            name="employee_name"
            value={formData.employee_name}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div className="form-group">
          <label>Chức vụ</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>Ngày bắt đầu</label>
            <input
              type="date"
              name="begin_date"
              value={formData.begin_date}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        {editMode && (
          <button className="confirm-btn" onClick={handleConfirm}>
            ✅ Xác nhận
          </button>
        )}
      </div>
      <div className="account-right">
        <div className="form-group">
          <label>Tên người dùng</label>
          <p className="username">{formData.username}</p>
        </div>
        {editMode && (
          <>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Nhập lại mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
