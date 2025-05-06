import React, { useState } from 'react';
import './ServiceItem.css';
import ServiceDetail from '../ServiceDetail/ServiceDetail';
import ServiceRegistrationForm from '../ServiceRegistrationForm/ServiceRegistrationForm';

const ServiceItem = ({ service }) => {
  const { title, description } = service;
  const [showDetail, setShowDetail] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  // Mock user account for demo
  const mockUserAccount = {
    fullName: 'Nguyễn Thị Thanh Lam',
    phoneNumber: '+84 868109250',
    apartmentNumber: '666',
  };
  
  const handleViewDetails = () => {
    setShowDetail(true);
  };
  
  const handleCloseDetail = () => {
    setShowDetail(false);
  };
  
  const handleRegister = () => {
    setShowRegistrationForm(true);
  };
  
  return (
    <>
      <div className="service-item">
        <h2 className="service-title">{title}</h2>
        <p className="service-description">
          {description && description.length > 150 
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
          onRegister={handleRegister}
        />
      )}
      
      {showRegistrationForm && (
        <ServiceRegistrationForm
          service={service}
          onClose={() => setShowRegistrationForm(false)}
          userAccount={mockUserAccount}
        />
      )}
    </>
  );
};

export default ServiceItem;