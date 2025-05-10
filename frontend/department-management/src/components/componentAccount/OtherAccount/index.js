import React from 'react';
import './OtherAccount.css'; // Reuse CSS của Account component

const OtherAccount = ({ profile, onDisable  }) => {
  return (
    <div className="account-container-no-border">
      <div className="account-left">
        <div className="account-header">
          <div>
            <h2 className="name">{profile.employee_name}</h2>
            <p className="position">{profile.position}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Tên đầy đủ</label>
          <input
            type="text"
            name="employee_name"
            value={profile.employee_name || ''}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Chức vụ</label>
          <input
            type="text"
            name="position"
            value={profile.position || ''}
            disabled
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={profile.phone || ''}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Ngày bắt đầu</label>
            <input
              type="date"
              name="begin_date"
              value={profile.begin_date || ''}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <input
              type="text"
              name="status"
              value={profile.status || ''}
              disabled
            />
          </div>
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={profile.address || ''}
            disabled
          />
        </div>

        {profile.status !== 'inactive' && (
            <div className="form-group">
                <button className="disable-btn" onClick={onDisable}>
                Vô hiệu hóa tài khoản
                </button>
            </div>
            )}

      </div>
    </div>
  );
};

export default OtherAccount;
