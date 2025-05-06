import React from 'react';
import './NotificationDetail.css';

const NotificationDetail = ({ notification, onClose }) => {
  const { title, message, time } = notification;

  // Enhanced version of renderFormattedContent function
  const renderFormattedContent = () => {
    // For a regular notification, just show the message
    if (!message.includes("Kính gửi")) {
      return <p className="notification-message-full">{message}</p>;
    }

    // Extract information from the structured message
    const contractMatch = message.match(/• Số hợp đồng\/Khách hàng: ([^\n]+)/);
    const periodMatch = message.match(/• Kỳ thanh toán: ([^\n]+)/);
    const amountMatch = message.match(/• Số tiền thanh toán: ([^\n]+)/);
    const dateMatch = message.match(/• Ngày thanh toán: ([^\n]+)/);
    const methodMatch = message.match(/• Phương thức thanh toán: ([^\n]+)/);
    const transactionMatch = message.match(/• Mã giao dịch: ([^\n]+)/);
    const contactMatch = message.match(/hotline ([^\s]+) hoặc email ([^\s.]+)/);

    // For structured notifications like payment confirmations
    return (
      <>
        <p className="notification-greeting">Kính gửi Quý khách hàng,</p>
        <p className="notification-message-main">
          Chúng tôi xin thông báo rằng khoản thanh toán tiền điện của Quý khách đã được thực hiện thành công. Dưới đây là thông tin chi tiết:
        </p>
        <ul className="notification-details-list">
          <li>Số hợp đồng/Khách hàng: {contractMatch ? contractMatch[1] : '[Số hợp đồng hoặc mã khách hàng]'}</li>
          <li>Kỳ thanh toán: {periodMatch ? periodMatch[1] : '[Tháng/Năm]'}</li>
          <li>Số tiền thanh toán: {amountMatch ? amountMatch[1] : '[Số tiền]'} VND</li>
          <li>Ngày thanh toán: {dateMatch ? dateMatch[1] : '[Ngày/Tháng/Năm]'}</li>
          <li>Phương thức thanh toán: {methodMatch ? methodMatch[1] : '[Phương thức]'}</li>
          <li>Mã giao dịch: {transactionMatch ? transactionMatch[1] : '[Mã giao dịch nếu có]'}</li>
        </ul>
        <p className="notification-footer-text">
          Cảm ơn Quý khách đã thanh toán đúng hạn. Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua hotline {contactMatch ? contactMatch[1] : '[Số điện thoại]'} hoặc email {contactMatch ? contactMatch[2] : '[Địa chỉ email]'}.
        </p>
        <p className="notification-sign">Trân trọng,</p>
      </>
    );
  };

  return (
    <div className="notification-detail-overlay">
      <div className="notification-detail-container">
        <div className="notification-detail-header">
          <h2 className="notification-detail-title">{title}</h2>
          <span className="notification-detail-time">Thời gian: {time}</span>
        </div>
        <div className="notification-detail-content">
          {renderFormattedContent()}
        </div>
        <div className="notification-detail-actions">
          <button className="close-btn" onClick={onClose}>Đóng</button>
          <button className="delete-btn">Xóa</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;