import React from 'react';
import './HouseholdServiceButtons.css';

const HouseholdServiceButtons = ({
  handleRegisterService,
  handleMyService,
}) => {
  return (
    <div className="button-container">
      <button className="service-button registerService" onClick={handleRegisterService}>
        Đăng ký dịch vụ
      </button>
      <button className="service-button myService" onClick={handleMyService}>
        Dịch vụ của tôi
      </button>
    </div>
  );
};

export default HouseholdServiceButtons;
