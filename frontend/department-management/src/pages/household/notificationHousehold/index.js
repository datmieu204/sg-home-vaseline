import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const household_id = user?.user_id;

    if (!household_id) {
      alert('Không tìm thấy thông tin người dùng.');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/household/notifications?household_id=${household_id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải danh sách thông báo');
        return res.json();
      })
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotifications(sortedData);
        setFilteredNotifications(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        alert('Đã xảy ra lỗi khi tải thông báo.');
        setLoading(false);
      });
  }, []);

  const handleViewDetail = (notification_id) => {
    setDetailLoading(true);
    fetch(`http://127.0.0.1:8000/household/notifications/${notification_id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải chi tiết thông báo');
        return res.json();
      })
      .then((data) => {
        setSelectedNotification({ ...data, id: notification_id });
        setDetailLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải chi tiết thông báo:', err);
        alert('Không thể tải chi tiết thông báo.');
        setDetailLoading(false);
      });
  };

  const handleBack = () => {
    setSelectedNotification(null);
  };

  const handleSearchChange = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
    const filtered = notifications.filter((noti) =>
      noti.message.toLowerCase().includes(keyword)
    );
    setFilteredNotifications(filtered);
  };

  if (loading) return <p>Đang tải thông báo...</p>;

  return (
    <div className="notification-container">
      <h2 className="notification-title">Thông báo của bạn</h2>

      {!selectedNotification && (
        <input
          type="text"
          placeholder="Tìm kiếm theo nội dung..."
          value={searchKeyword}
          onChange={handleSearchChange}
          className="search-input"
        />
      )}

    {selectedNotification ? (
    <div className="notification-detail">
        <button onClick={handleBack} className="back-button">← Quay lại danh sách</button>
        <div className="detail-card">
        <h3 className="detail-title">{selectedNotification.message}</h3>
        <div className="detail-info">
            <p><span>Ngày thanh toán:</span> {new Date(selectedNotification.payment_date).toLocaleString('vi-VN')}</p>
            <p><span>Xác nhận bởi:</span> {selectedNotification.confirmed_by}</p>
        </div>

        <div className="service-section">
            <h4>Dịch vụ liên quan</h4>
            <table className="service-table">
            <thead>
                <tr>
                <th>Tên dịch vụ</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                </tr>
            </thead>
            <tbody>
                {selectedNotification.services.map((s, idx) => (
                <tr key={idx}>
                    <td>{s.service_name}</td>
                    <td>{s.quantity}</td>
                    <td>{s.total} đ</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    </div>
    ) : (

        <ul className="notification-list">
          {filteredNotifications.map((noti) => (
            <li
              key={noti.notification_id}
              className="notification-item"
              onClick={() => handleViewDetail(noti.notification_id)}
            >
              <p className="notification-message">{noti.message}</p>
              <p className="notification-time">
                {new Date(noti.time).toLocaleString('vi-VN')}
              </p>
            </li>
          ))}
        </ul>
      )}

      {detailLoading && <p>Đang tải chi tiết...</p>}
    </div>
  );
};

export default Notification;
