import React from 'react';
import './ServiceDetail.css';

const ServiceDetail = ({ service, onClose }) => {
  const { title, description, cost, duration, availability, requirements, benefits } = service;

  // Extract information from the service description
  const renderFormattedContent = () => {
    return (
      <>
        <div className="service-detail-description">
          <p>{description}</p>
        </div>

        <div className="service-detail-section">
          <h3 className="service-section-title">Thông tin dịch vụ:</h3>
          <ul className="service-details-list">
            <li><strong>Giá:</strong> {cost || '500,000 VND/người/tháng'}</li>
            <li><strong>Thời hạn:</strong> {duration || '30 ngày'}</li>
            <li><strong>Giờ mở cửa:</strong> {availability || '5:30 - 22:00 hàng ngày'}</li>
            <li><strong>Số lượng đăng ký tối đa:</strong> {requirements?.maxRegistrations || '5 người/hộ'}</li>
          </ul>
        </div>

        <div className="service-detail-section">
          <h3 className="service-section-title">Quyền lợi:</h3>
          <ul className="service-benefits-list">
            {benefits ? (
              benefits.map((benefit, index) => <li key={index}>{benefit}</li>)
            ) : (
              <>
                <li>Sử dụng tất cả các trang thiết bị tại khu vực</li>
                <li>Được tham gia các lớp tập theo nhóm theo lịch</li>
                <li>Tư vấn chế độ tập luyện cá nhân</li>
                <li>Giảm 10% khi đăng ký từ 3 tháng trở lên</li>
              </>
            )}
          </ul>
        </div>

        <div className="service-detail-section">
          <h3 className="service-section-title">Điều khoản sử dụng:</h3>
          <ul className="service-terms-list">
            <li>Thẻ không được chuyển nhượng cho người khác</li>
            <li>Tuân thủ nội quy của khu vực dịch vụ</li>
            <li>Hủy đăng ký trước 7 ngày sẽ được hoàn 70% phí</li>
            <li>Vé tháng có hiệu lực kể từ ngày đăng ký thành công</li>
          </ul>
        </div>

        <div className="service-detail-section">
          <h3 className="service-section-title">Cách thức đăng ký:</h3>
          <ol className="service-registration-steps">
            <li>Nhấn nút "Đăng ký" để tiến hành đăng ký dịch vụ</li>
            <li>Chọn số lượng người đăng ký và thời gian sử dụng</li>
            <li>Xác nhận thông tin và thực hiện thanh toán</li>
            <li>Nhận xác nhận đăng ký qua email và thông báo</li>
          </ol>
        </div>

        <p className="service-detail-note">
          <strong>Lưu ý:</strong> Để biết thêm thông tin chi tiết hoặc có thắc mắc, vui lòng liên hệ với chúng tôi qua hotline: 1900-1234 hoặc email: services@schome.com
        </p>
      </>
    );
  };

  return (
    <div className="service-detail-overlay">
      <div className="service-detail-container">
        <div className="service-detail-header">
          <h2 className="service-detail-title">{title}</h2>
        </div>
        <div className="service-detail-content">
          {renderFormattedContent()}
        </div>
        <div className="service-detail-actions">
          <button className="close-btn" onClick={onClose}>Đóng</button>
          <button className="register-btn">Đăng ký</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;