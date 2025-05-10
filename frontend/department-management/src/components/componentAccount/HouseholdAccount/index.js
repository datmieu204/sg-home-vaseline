import React from 'react';
import './HouseholdAccount.css';

const HouseholdAccount = ({ profile, onDisable  }) => {
  if (!profile) return null;

  return (
    <div className="household-account-container">
      <div className="household-account-content">
        <h2 className="household-name">{profile.name}</h2>

        <div className="household-info">
          <div className="info-item">
            <label>Mã hộ khẩu:</label>
            <span>{profile.household_id}</span>
          </div>

          <div className="info-item">
            <label>Số thành viên:</label>
            <span>{profile.number_of_members}</span>
          </div>

          <div className="info-item">
            <label>Số phòng:</label>
            <span>{profile.room_number}</span>
          </div>

            <div className="info-item">
                <label>Tên đăng nhập:</label>
                <span>{profile.username}</span>
            </div>

            <div className="info-item">
                <label>Trạng thái:</label>
                <span>{profile.status}</span>
            </div>


        </div>

            {profile.status === "active" && (
                <button className="disable-btn" onClick={onDisable}>
                    🚫 Vô hiệu hóa tài khoản
                </button>
            )}

      </div>
    </div>
  );
};

export default HouseholdAccount;
