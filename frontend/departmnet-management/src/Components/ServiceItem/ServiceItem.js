import React from 'react';
import './ServiceItem.css';

const ServiceItem = ({ service }) => {
  const { title, description } = service;
  
  const handleViewDetails = () => {
    // In a real app, this would open a modal with service details
    console.log('View details for', title);
  };
  
  const handleRegister = () => {
    // In a real app, this would handle the service registration
    console.log('Register for', title);
  };
  
  return (
    <div className="service-item">
      <h2 className="service-title">{title}</h2>
      <p className="service-description">{description}</p>
      <div className="service-actions">
        <button className="detail-btn" onClick={handleViewDetails}>Chi tiết</button>
        <button className="register-btn" onClick={handleRegister}>Đăng ký</button>
      </div>
    </div>
  );
};

export default ServiceItem;