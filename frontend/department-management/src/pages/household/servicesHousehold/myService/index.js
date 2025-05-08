import React, { useState, useEffect } from 'react';
import './myService.css';

const MyService = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const household_id = user?.user_id;

    const fetchRegisteredServices = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/household/services/myregister?household_id=${household_id}`);
        if (!response.ok) throw new Error('Failed to fetch registered services');
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

  const handleCancelSubscription = async (serviceRegistrationId) => {
    const confirm = window.confirm('Bạn có chắc chắn muốn hủy đăng ký dịch vụ này không?');
    if (!confirm) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/household/services/myregister/${serviceRegistrationId}`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Không thể hủy đăng ký dịch vụ');

      alert('Hủy đăng ký thành công!');

      setServices(prev =>
        prev.map(s =>
          s.service_registration_id === serviceRegistrationId
            ? { ...s, status: 'cancelled' }
            : s
        )
      );
    } catch (error) {
      console.error('Error canceling service:', error);
      alert('Đã xảy ra lỗi khi hủy đăng ký dịch vụ.');
    }
  };

  const sortByDate = (servicesList) => {
    return servicesList.sort((a, b) => new Date(b.start_date) - new Date(a.start_date)); // Sắp xếp từ mới nhất
  };

  if (isLoading) {
    return <p className="rs-loading-text">Đang tải...</p>;
  }

  if (!services || services.length === 0) {
    return <p className="rs-empty-message">Không có dịch vụ nào đã đăng ký.</p>;
  }

  const formatStatus = (status) => {
    return status === 'in_use' ? 'Đang sử dụng' : 'Đã hủy';
  };

  const sortedServices = sortByDate(services);

  return (
    <div className="rs-main-wrapper">
      {sortedServices.map((service) => (
        <div className="rs-service-box" key={service.service_registration_id}>
          <h3 className="rs-service-name">{service.service_name}</h3>
          <p className="rs-service-detail"><strong>Ngày đăng ký:</strong> {new Date(service.start_date).toLocaleDateString('vi-VN')}</p>
          <p className="rs-service-detail"><strong>Ngày kết thúc:</strong> {new Date(service.end_date).toLocaleDateString('vi-VN')}</p>
          <p className="rs-service-detail"><strong>Số lượt:</strong> {service.quantity}</p>
          <p className="rs-service-detail"><strong>Trạng thái:</strong> {formatStatus(service.status)}</p>
          {service.status === 'in_use' && (
            <div className="rs-button-group">
              <button
                className="rs-cancel-button"
                onClick={() => handleCancelSubscription(service.service_registration_id)}
              >
                Hủy đăng ký
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyService;
