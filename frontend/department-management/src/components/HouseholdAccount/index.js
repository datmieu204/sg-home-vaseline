import React, { useState, useEffect } from 'react';

const HouseholdAccount = ({ profile, onConfirm }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== profile[key]) {
        updatedData[key] = formData[key];
      }
    });

    if (Object.keys(updatedData).length > 0 && onConfirm) {
      onConfirm(updatedData);
    }

    setEditMode(false);
  };

  return (
    <div className="account-container">
      <div className="account-left">
        <div className="account-header">
          <div>
            <h2 className="name">{formData.name}</h2>
            <p className="status">{formData.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</p>
          </div>
          <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
            ✏️ {editMode ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>
        <div className="form-group">
          <label>Tên hộ gia đình</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div className="form-group">
          <label>Số thành viên</label>
          <input
            type="number"
            name="number_of_members"
            value={formData.number_of_members}
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
            <label>Số phòng</label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
        </div>
        {editMode && (
          <button className="confirm-btn" onClick={handleConfirm}>
            ✅ Xác nhận
          </button>
        )}
      </div>
      <div className="account-right">
        <div className="form-group">
          <label>ID Hộ gia đình</label>
          <p className="household-id">{formData.id}</p>
        </div>
      </div>
    </div>
  );
};

export default HouseholdAccount;