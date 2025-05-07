import React, { useState, useEffect } from 'react';
import './myService.css';

const RegisteredServices = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegisteredServices = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/household/services/myregister?household_id=HH001', {
          headers: {
            Accept: 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch registered services');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching registered services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegisteredServices();
  }, []);

  const handleCancelSubscription = (serviceId) => {
    alert(`Hủy đăng ký dịch vụ ${serviceId} - Chức năng đang phát triển.`);
  };

  const handleExtendSubscription = (serviceId) => {
    alert(`Gia hạn dịch vụ ${serviceId} - Chức năng đang phát triển.`);
  };

  if (isLoading) {
    return <p className="rs-loading-text">Đang tải...</p>;
  }

  if (!services || services.length === 0) {
    return <p className="rs-empty-message">Không có dịch vụ nào đã đăng ký.</p>;
  }

  return (
    <div className="rs-main-wrapper">
      {services.map((service) => (
        <div className="rs-service-box" key={service.service_registration_id}>
          <h3 className="rs-service-name">{service.service_name}</h3>
          <p className="rs-service-detail"><strong>Ngày đăng ký:</strong> 01/01/2025</p>
          <p className="rs-service-detail"><strong>Ngày kết thúc:</strong> 01/01/2026</p>
          <p className="rs-service-detail"><strong>Số lượt:</strong> 3</p>
          <div className="rs-button-group">
            <button className="rs-cancel-button" onClick={() => handleCancelSubscription(service.service_id)}>Hủy đăng ký</button>
            <button className="rs-extend-button" onClick={() => handleExtendSubscription(service.service_id)}>Gia hạn</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RegisteredServices;