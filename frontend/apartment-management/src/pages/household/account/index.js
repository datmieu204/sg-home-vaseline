import React, { useState, useEffect } from 'react';
import './HouseholdAccount1.css';
import {FiUser, FiEdit2} from 'react-icons/fi';

const HouseholdAccount1 = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const household_id = user?.user_id;

    if (!household_id) {
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/household/profile?household_id=${household_id}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setLoading(false);
      });
  }, []);

  const handleConfirm = (updatedData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const household_id = user?.user_id;

    fetch(`http://127.0.0.1:8000/household/profile?household_id=${household_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Cập nhật thất bại!');
        return res.json();
      })
      .then(data => {
        alert('Cập nhật thành công!');
        setProfile(data);
      })
      .catch(err => {
        console.error('Lỗi khi cập nhật:', err);
        alert('Cập nhật thất bại!');
      });
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!profile) return <div>Không tìm thấy thông tin hộ dân</div>;

  return <HouseholdAccountContent profile={profile} onConfirm={handleConfirm} />;
};

const HouseholdAccountContent = ({ profile, onConfirm }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    phone: profile.phone || '',
    room_number: profile.room_number || '',
    status: profile.status || 'active',
    username: profile.username || '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setFormData({
      name: profile.name || '',
      phone: profile.phone || '',
      room_number: profile.room_number || '',
      status: profile.status || 'active',
      username: profile.username || '',
      password: '',
      confirmPassword: '',
    });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
  
    const updated = {};
  
    if (formData.name !== profile.name) updated.name = formData.name;
    if (formData.phone !== profile.phone) updated.phone = formData.phone;
    if (formData.room_number !== profile.room_number) updated.room_number = formData.room_number;
    if (formData.status !== profile.status) updated.status = formData.status;
    if (formData.username !== profile.username) updated.username = formData.username;
    if (formData.password) updated.password = formData.password;
  
    onConfirm(updated);
    setEditMode(false);
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: '',
    }));
  };

  return (
    <div className="account-container">
      <div className="account-header">
        <div className="user-avatar-section">
          <div className="user-avatar">
            <FiUser className="avatar-icon" />
          </div>
          <div>
            <h2 className="name">{formData.name}</h2>
            <p className="position">Mã hộ dân: {profile.id}</p>
          </div>
        </div>
        <button 
          className="edit-btn" 
          onClick={() => {
            if (editMode) {
              setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                room_number: profile.room_number || '',
                status: profile.status || 'active',
                username: profile.username || '',
                password: '',
                confirmPassword: '',
              });
            }
            setEditMode(!editMode);
          }}
        >
          <FiEdit2 /> {editMode ? 'Hủy' : 'Chỉnh sửa'}
        </button>
      </div>

      <div className="information-container">
        <div className="account-left">
          <div className="form-group">
            <label>Tên hộ dân</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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

          <div className="form-group">
            <label>Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={!editMode}
            >
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>

          {editMode && (
            <button className="confirm-btn" onClick={handleConfirm}>
              Xác nhận
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
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Nhập lại mật khẩu</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseholdAccount1;