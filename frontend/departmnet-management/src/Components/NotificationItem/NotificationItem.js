import React, { useState } from 'react';
import './NotificationItem.css';
import NotificationDetail from '../NotificationDetail/NotificationDetail';

const NotificationItem = ({ notification, isSelected, onSelect, onRead, onDelete }) => {
  const { id, title, message, time, isRead } = notification;
  const [showDetail, setShowDetail] = useState(false);
  
  const handleDetail = () => {
    // Mark as read
    if (!isRead) {
      onRead();
    }
    // Show detail view
    setShowDetail(true);
  };
  
  const handleCloseDetail = () => {
    setShowDetail(false);
  };
  
  return (
    <>
      <div className={`notification-item ${isRead ? '' : 'unread'}`}>
        <div className="notification-select">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={onSelect}
          />
        </div>
        
        <div className="notification-content">
          <h3 className="notification-title">{title}</h3>
          <p className="notification-message">{message}</p>
          <div className="notification-footer">
            <span className="notification-time">Thời gian: {time}</span>
            <div className="notification-actions">
              <button className="detail-btn" onClick={handleDetail}>Chi tiết</button>
              <button className="delete-btn" onClick={onDelete}>Xóa</button>
            </div>
          </div>
        </div>
      </div>
      
      {showDetail && (
        <NotificationDetail 
          notification={notification} 
          onClose={handleCloseDetail} 
        />
      )}
    </>
  );
};

export default NotificationItem;