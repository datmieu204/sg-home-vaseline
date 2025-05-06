import React, { useContext, useState } from 'react';
import './MyServiceItem.css';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { ServicesContext } from '../../contexts/ServicesContext';

const MyServiceItem = ({ service }) => {
  const { id, title, registerDate, endDate, quantity, paymentStatus } = service;
  
  // Use local state to track status for immediate UI update
  const [currentStatus, setCurrentStatus] = useState(service.status || 'active');
  
  // Get updateServiceStatus function from context
  const { updateServiceStatus } = useContext(ServicesContext);
  
  const handleCancel = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đăng ký dịch vụ này?')) {
      // Update local state immediately for UI feedback
      setCurrentStatus('cancel');
      
      // Update the context/global state
      updateServiceStatus(id, 'cancel');
      
      console.log("Service canceled:", id);
    }
  };

  return (
    <div className={`my-service-item ${currentStatus}`}>
      <div className="service-status-indicator">
        {currentStatus === 'active' && (
          <span className="status active">
            <FiCheck /> Đang sử dụng
          </span>
        )}
        {currentStatus === 'cancel' && (
          <span className="status cancel">
            <FiX /> Đã hủy
          </span>
        )}
        {paymentStatus === 'Chờ thanh toán' && (
          <span className="status pending">
            <FiAlertCircle /> Chờ thanh toán
          </span>
        )}
      </div>
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
        {paymentStatus && (
          <div className="detail-row">
            <span className="detail-label">Trạng thái thanh toán:</span>
            <span className={`detail-value payment-${paymentStatus === 'Đã thanh toán' ? 'paid' : 'pending'}`}>
              {paymentStatus}
            </span>
          </div>
        )}
      </div>
      
      {/* Only show cancel button for active services */}
      {currentStatus === 'active' && (
        <div className="service-actions">
          <button className="cancel-btn" onClick={handleCancel}>Hủy đăng ký</button>
        </div>
      )}
    </div>
  );
};

export default MyServiceItem;