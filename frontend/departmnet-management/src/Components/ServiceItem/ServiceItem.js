import React, { useState } from 'react';
import './ServiceItem.css';
import ServiceDetail from '../ServiceDetail/ServiceDetail';

const ServiceItem = ({ service }) => {
  const { title, description } = service;
  const [showDetail, setShowDetail] = useState(false);
  
  const handleViewDetails = () => {
    setShowDetail(true);
  };
  
  const handleCloseDetail = () => {
    setShowDetail(false);
  };
  
  const handleRegister = () => {
    // In a real app, this would handle the service registration
    console.log('Register for', title);
  };
  
  return (
    <>
      <div className="service-item">
        <h2 className="service-title">{title}</h2>
        <p className="service-description">
          {description.length > 150 
            ? `${description.substring(0, 150)}...` 
            : description}
        </p>
        <div className="service-actions">
          <button className="detail-btn" onClick={handleViewDetails}>Chi tiết</button>
          <button className="register-btn" onClick={handleRegister}>Đăng ký</button>
        </div>
      </div>
      
      {showDetail && (
        <ServiceDetail 
          service={service} 
          onClose={handleCloseDetail} 
        />
      )}
    </>
  );
};

export default ServiceItem;