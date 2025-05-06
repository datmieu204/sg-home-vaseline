import React, { useState } from 'react';
import './MyServiceItem.css';
import ServiceDetail from '../ServiceDetail/ServiceDetail';

const MyServiceItem = ({ service }) => {
  const { title, registerDate, endDate, quantity } = service;
  const [showDetail, setShowDetail] = useState(false);
  
  const handleViewDetails = () => {
    setShowDetail(true);
  };
  
  const handleCloseDetail = () => {
    setShowDetail(false);
  };
  
  const handleCancel = () => {
    // In a real app, this would handle service cancellation
    console.log('Cancel service', title);
  };
  
  const handleExtend = () => {
    // In a real app, this would handle service extension
    console.log('Extend service', title);
  };
  
  // Prepare extended service info for detail view
  const extendedService = {
    ...service,
    description: `Chi tiết về dịch vụ ${title} mà bạn đã đăng ký.`,
    status: 'Đang hoạt động',
    registeredUsers: quantity,
    paymentStatus: 'Đã thanh toán',
    paymentMethod: 'Chuyển khoản ngân hàng',
    transactionId: 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
  };
  
  return (
    <>
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
          <button className="detail-btn" onClick={handleViewDetails}>Chi tiết</button>
          <button className="cancel-btn" onClick={handleCancel}>Hủy đăng ký</button>
          <button className="extend-btn" onClick={handleExtend}>Gia hạn</button>
        </div>
      </div>
      
      {showDetail && (
        <ServiceDetail 
          service={extendedService} 
          onClose={handleCloseDetail} 
        />
      )}
    </>
  );
};

export default MyServiceItem;