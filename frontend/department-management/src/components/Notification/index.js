import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ householdId }) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/household/notifications?household_id=${householdId}`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        const transformedNotifications = data.map(item => ({
          notification_id: item.notification_id,
          title: `Thông báo đóng tiền điện tháng ${new Date(item.time).toLocaleString('vi-VN', { month: '2-digit', year: 'numeric' })}`,
          subtext: item.message,
          time: item.time,
          isPaid: false // Add logic to determine if paid based on API data
        }));
        setNotifications(transformedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [householdId]);

  const fetchNotificationDetails = async (notificationId) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/household/notifications/${notificationId}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch notification details');
      }
      const data = await response.json();
      setSelectedNotification(data);
    } catch (error) {
      console.error('Error fetching notification details:', error);
      alert('Không thể tải chi tiết thông báo.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDetails = (notificationId) => {
    fetchNotificationDetails(notificationId);
  };

  const handleBack = () => {
    setSelectedNotification(null);
  };

  const handleSelect = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSortNewest = () => {
    const sorted = [...notifications].sort((a, b) => new Date(b.time) - new Date(a.time));
    setNotifications(sorted);
  };

  const handleSortOldest = () => {
    const sorted = [...notifications].sort((a, b) => new Date(a.time) - new Date(b.time));
    setNotifications(sorted);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="notifications-container">
      {selectedNotification ? (
        <div className="notification-details">
          <h2 className="notification-details-title">Chi tiết Thông báo</h2>
          <p><strong>Nội dung:</strong> {selectedNotification.message}</p>
          <p><strong>Ngày thanh toán:</strong> {new Date(selectedNotification.payment_date).toLocaleString('vi-VN')}</p>
          <p><strong>Xác nhận bởi:</strong> {selectedNotification.confirmed_by}</p>
          <h3>Dịch vụ</h3>
          <ul>
            {selectedNotification.services.map((service, index) => (
              <li key={index}>
                <p><strong>Dịch vụ:</strong> {service.service_name}</p>
                <p><strong>Số lượng:</strong> {service.quantity}</p>
                <p><strong>Tổng:</strong> {service.total} triệu đồng</p>
              </li>
            ))}
          </ul>
          <button className="back-btn" onClick={handleBack}>Quay lại</button>
        </div>
      ) : (
        <>
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div className={`notification-item ${!notification.isPaid ? 'unpaid' : ''}`} key={notification.notification_id}>
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-subtext">{notification.subtext}</p>
                  <p className="notification-time">Thời gian: {new Date(notification.time).toLocaleString('vi-VN')}</p>
                </div>
                <div className="notification-actions">
                  <button className="detail-btn" onClick={() => handleDetails(notification.notification_id)}>Chi tiết</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {loadingDetails && <div className="loading-overlay">Đang tải chi tiết...</div>}
    </div>
  );
};

export default Notification;