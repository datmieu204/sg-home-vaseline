import React, { useEffect, useState } from 'react';
import Notification from '../../../components/Notification';


const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);

  // tam thoi fixed cung vi khong dang nhap duoc
  const householdId = 'HH001';

  useEffect(() => {
    if (!householdId) {
      alert("Không tìm thấy mã hộ gia đình.");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/household/notifications?household_id=${householdId}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => {
        // Transform API data to match UI
        const transformedNotifications = data.map(item => ({
          notification_id: item.notification_id,
          message: `Thông báo đóng tiền điện tháng ${new Date(item.time).toLocaleString('vi-VN', { month: '2-digit', year: 'numeric' })}`,
          time: item.time,
          isPaid: false // Add logic to determine if paid
        }));
        setNotifications(transformedNotifications);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch notifications:', err);
        setLoading(false);
      });
  }, []);

  const handleDeleteNotification = (notificationId) => {
    // Existing delete logic
  };

  if (loading) return <div className="loading-spinner">Đang tải...</div>;
  if (!notifications || notifications.length === 0) return <p>Không có thông báo nào.</p>;

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#f28500' }}>Danh sách Thông báo</h1>
      <Notification
        householdId={householdId}
        notifications={notifications}
        onDelete={handleDeleteNotification}
      />
    </div>
  );
};

export default NotificationsPage;