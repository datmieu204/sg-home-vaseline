import React, { useState, useEffect } from 'react';
import './ServiceList.css';
import ServiceItem from '../ServiceItem/ServiceItem';
import MyServiceItem from '../MyServiceItem/MyServiceItem';

const ServiceList = () => {
  const [activeTab, setActiveTab] = useState('register'); // 'register' or 'myServices'
  const [services, setServices] = useState([]);
  const [myServices, setMyServices] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch services from an API
    const mockServices = [
      {
        id: 1,
        title: 'Đăng ký vé tháng bể bơi',
        description: 'Dịch vụ bể bơi tại chung cư mang đến không gian thư giãn, rèn luyện sức khỏe và gắn kết cộng đồng cho cư dân. Bể bơi được thiết kế hiện đại...',
      },
      {
        id: 2,
        title: 'Đăng ký vé tháng tập Gym',
        description: 'Dịch vụ bể bơi tại chung cư mang đến không gian thư giãn, rèn luyện sức khỏe và gắn kết cộng đồng cho cư dân. Bể bơi được thiết kế hiện đại...',
      },
      {
        id: 3,
        title: 'Đăng ký vé tháng sân bóng',
        description: 'Dịch vụ bể bơi tại chung cư mang đến không gian thư giãn, rèn luyện sức khỏe và gắn kết cộng đồng cho cư dân. Bể bơi được thiết kế hiện đại...',
      },
    ];

    const mockMyServices = [
      {
        id: 1,
        title: 'Vé tháng bể bơi',
        registerDate: '01/01/2025',
        endDate: '01/01/2026',
        quantity: 3,
      },
      {
        id: 2,
        title: 'Vé tháng phòng Gym',
        registerDate: '01/01/2025',
        endDate: '01/01/2026',
        quantity: 3,
      },
      {
        id: 3,
        title: 'Vé tháng sân bóng',
        registerDate: '01/01/2025',
        endDate: '01/01/2026',
        quantity: 3,
      },
    ];
    
    setServices(mockServices);
    setMyServices(mockMyServices);
  }, []);

  return (
    <div className="service-page">
      <div className="service-container">
        <div className="service-tabs">
          <button 
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Đăng ký dịch vụ
          </button>
          <button 
            className={`tab-button ${activeTab === 'myServices' ? 'active' : ''}`}
            onClick={() => setActiveTab('myServices')}
          >
            Dịch vụ của tôi
          </button>
        </div>
        
        <div className="service-content">
          {activeTab === 'register' ? (
            <div className="service-list">
              {services.map(service => (
                <ServiceItem 
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          ) : (
            <div className="my-service-list">
              {myServices.map(service => (
                <MyServiceItem 
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;