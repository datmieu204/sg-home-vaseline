import React from 'react';
import './MyServiceItem.css';

const MyServiceItem = ({ service }) => {
  const { title, registerDate, endDate, quantity } = service;
  
  const handleCancel = () => {
    // In a real app, this would handle service cancellation
    console.log('Cancel service', title);
  };
  
  const handleExtend = () => {
    // In a real app, this would handle service extension
    console.log('Extend service', title);
  };
  
  return (
    <div className="my-service-item">
      <h2 className="service-title">{title}</h2>
      <div className="service-details">
        <div className="detail-row">
          <span className="detail-label">Ngày đăng ký:</span>
          <span className="detail-value">{registerDate}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Ngày kết thúc:</span>
          <span className="detail-value">{endDate}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Số lượng:</span>
          <span className="detail-value">{quantity}</span>
        </div>
      </div>
      <div className="service-actions">
        <button className="cancel-btn" onClick={handleCancel}>Hủy đăng ký</button>
        <button className="extend-btn" onClick={handleExtend}>Gia hạn</button>
      </div>
    </div>
  );
};

export default MyServiceItem;