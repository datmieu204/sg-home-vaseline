import React, { useState, useEffect } from 'react';
import './NotificationList.css';
import NotificationItem from '../NotificationItem/NotificationItem';
import { FaFilter } from 'react-icons/fa';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'newest', 'oldest', 'unprocessed'
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch notifications from an API
    const mockNotifications = [
      {
        id: 1,
        title: 'Thông báo đóng tiền điện thành công tháng 04/2025',
        message: `Kính gửi Quý khách hàng,
        Chúng tôi xin thông báo rằng khoản thanh toán tiền điện của Quý khách đã được thực hiện thành công. Dưới đây là thông tin chi tiết:
        • Số hợp đồng/Khách hàng: HD2025-1234
        • Kỳ thanh toán: 04/2025
        • Số tiền thanh toán: 1,250,000 VND
        • Ngày thanh toán: 25/04/2025
        • Phương thức thanh toán: Chuyển khoản
        • Mã giao dịch: GD-123456789
        Cảm ơn Quý khách đã thanh toán đúng hạn. Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua hotline 1900-1234 hoặc email support@schome.com.
        Trân trọng,`,
        time: '25/04/2025 lúc 08:00',
        isRead: false,
        type: 'billing'
      },
      {
        id: 2,
        title: 'Thông báo đóng tiền nước thành công tháng 04/2025',
        message: `Kính gửi Quý khách hàng,
        Chúng tôi xin thông báo rằng khoản thanh toán tiền nước của Quý khách đã được thực hiện thành công. Dưới đây là thông tin chi tiết:
        • Số hợp đồng/Khách hàng: HDN2025-5678
        • Kỳ thanh toán: 04/2025
        • Số tiền thanh toán: 450,000 VND
        • Ngày thanh toán: 25/04/2025
        • Phương thức thanh toán: Tiền mặt
        • Mã giao dịch: GD-98765432
        Cảm ơn Quý khách đã thanh toán đúng hạn. Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua hotline 1900-1234 hoặc email support@schome.com.
        Trân trọng,`,
        time: '25/04/2025 lúc 08:00',
        isRead: false,
        type: 'billing'
      },
      {
        id: 3,
        title: 'Thông báo đóng tiền điện thành công tháng 03/2025',
        message: `Kính gửi Quý khách hàng,
        Chúng tôi xin thông báo rằng khoản thanh toán tiền điện của Quý khách đã được thực hiện thành công. Dưới đây là thông tin chi tiết:
        • Số hợp đồng/Khách hàng: HD2025-1234
        • Kỳ thanh toán: 03/2025
        • Số tiền thanh toán: 1,180,000 VND
        • Ngày thanh toán: 25/03/2025
        • Phương thức thanh toán: Ví điện tử
        • Mã giao dịch: GD-345678912
        Cảm ơn Quý khách đã thanh toán đúng hạn. Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua hotline 1900-1234 hoặc email support@schome.com.
        Trân trọng,`,
        time: '25/03/2025 lúc 08:00',
        isRead: true,
        type: 'billing'
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const handleReadNotification = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    setSelectedNotifications(selectedNotifications.filter(selectedId => selectedId !== id));
  };

  const handleSelectNotification = (id) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(selectedId => selectedId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedNotifications(notifications.map(notification => notification.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleDeleteSelected = () => {
    setNotifications(notifications.filter(notification => !selectedNotifications.includes(notification.id)));
    setSelectedNotifications([]);
  };

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setShowFilterOptions(false);
  };

  // Apply filters
  const filteredNotifications = [...notifications].sort((a, b) => {
    switch(filterType) {
      case 'newest':
        return new Date(b.time) - new Date(a.time);
      case 'oldest':
        return new Date(a.time) - new Date(b.time);
      default:
        return 0;
    }
  });

  return (
    <div className="notification-page">
      <div className="notification-container">
        <div className="notification-header">
          <div className="notification-controls">
            <div className="select-all">
              <input 
                type="checkbox" 
                id="select-all" 
                checked={selectedNotifications.length === notifications.length && notifications.length > 0}
                onChange={handleSelectAll}
              />
              <label htmlFor="select-all">Tất cả</label>
            </div>
            
            {selectedNotifications.length > 0 && (
              <button 
                className="delete-selected-btn"
                onClick={handleDeleteSelected}
              >
                Xóa các mục đã chọn
              </button>
            )}
          </div>
          
          <div className="notification-filters">
            <div className="filter-dropdown">
              <button className="filter-button" onClick={toggleFilterOptions}>
                <FaFilter />
                <span>Lọc theo ngày</span>
              </button>
              
              {showFilterOptions && (
                <div className="filter-options">
                  <button onClick={() => handleFilterChange('all')}>Tất cả</button>
                  <button 
                    onClick={() => handleFilterChange('newest')} 
                    className={filterType === 'newest' ? 'active' : ''}
                  >
                    Mới nhất
                  </button>
                  <button 
                    onClick={() => handleFilterChange('oldest')} 
                    className={filterType === 'oldest' ? 'active' : ''}
                  >
                    Cũ nhất
                  </button>
                </div>
              )}
            </div>
            
            {/* Additional filter buttons as shown in the image */}
            <button 
              className={`filter-button ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              Lọc theo ngày
            </button>
            <button 
              className={`filter-button ${filterType === 'newest' ? 'active' : ''}`}
              onClick={() => handleFilterChange('newest')}
            >
              Mới nhất
            </button>
            <button 
              className={`filter-button ${filterType === 'oldest' ? 'active' : ''}`}
              onClick={() => handleFilterChange('oldest')}
            >
              Cũ nhất
            </button>
          </div>
        </div>
        
        <div className="notification-list">
          {filteredNotifications.map(notification => (
            <NotificationItem 
              key={notification.id}
              notification={notification}
              isSelected={selectedNotifications.includes(notification.id)}
              onSelect={() => handleSelectNotification(notification.id)}
              onRead={() => handleReadNotification(notification.id)}
              onDelete={() => handleDeleteNotification(notification.id)}
            />
          ))}
          
          {filteredNotifications.length === 0 && (
            <div className="no-notifications">
              <p>Không có thông báo nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;