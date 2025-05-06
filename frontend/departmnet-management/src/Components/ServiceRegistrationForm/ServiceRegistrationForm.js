import React, { useState, useContext } from 'react';
import './ServiceRegistrationForm.css';
import { FiX, FiCalendar, FiUsers, FiCreditCard } from 'react-icons/fi';
import { ServicesContext } from '../../contexts/ServicesContext';

const ServiceRegistrationForm = ({ service, onClose, userAccount }) => {
  const { addUserService } = useContext(ServicesContext);
  
  // Format current date for display
  const formattedToday = new Date().toLocaleDateString('vi-VN');
  
  // Calculate the last day of current month for the end date
  const calculateLastDayOfMonth = () => {
    const today = new Date();
    // Create a date for the first day of next month, then subtract one day
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.toLocaleDateString('vi-VN');
  };
  
  // Initialize form data
  const [formData, setFormData] = useState({
    memberCount: 1,
    fullName: userAccount?.fullName || '',
    phoneNumber: userAccount?.phoneNumber || '',
    apartmentNumber: userAccount?.apartmentNumber || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Extract price from service cost string or use default
  const extractPrice = () => {
    if (!service.cost) return 500000; // Default price if not specified
    
    // Try to extract the price from strings like "600,000 VND/người/tháng"
    const priceMatch = service.cost.match(/(\d+)[,\.]?(\d*)/);
    if (priceMatch) {
      const priceString = priceMatch[0].replace(/,/g, '');
      return parseInt(priceString, 10);
    }
    
    return 500000; // Fallback to default
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const servicePricePerPerson = extractPrice();
    
    // Create a new service entry
    const newServiceEntry = {
      id: Date.now(),
      title: service.title || service.name,
      registerDate: formattedToday,
      endDate: calculateLastDayOfMonth(),
      quantity: formData.memberCount,
      status: 'active',
      paymentStatus: 'Chờ thanh toán',
      details: {
        ...formData,
        serviceName: service.title || service.name,
        pricePerPerson: servicePricePerPerson
      }
    };
    
    // Add the service to context
    addUserService(newServiceEntry);
    
    // Close the form
    onClose();
    
    // Show confirmation
    alert(`Đăng ký dịch vụ ${service.title || service.name} thành công! Vui lòng thanh toán trong vòng 48 giờ để hoàn tất đăng ký.`);
  };

  // Calculate total payment using the service's actual price
  const calculateTotalPayment = () => {
    const pricePerPerson = extractPrice();
    return formData.memberCount * pricePerPerson;
  };

  return (
    <div className="registration-modal-overlay">
      <div className="registration-modal">
        <div className="registration-modal-header">
          <h2>Đăng ký dịch vụ: {service.title || service.name}</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <h3>Thông tin người đăng ký</h3>
            <p className="form-note">Thông tin được điền tự động từ tài khoản của bạn.</p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Tên đầy đủ</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  readOnly
                  className="auto-filled"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Số điện thoại</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  readOnly
                  className="auto-filled"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="apartmentNumber">Số phòng</label>
              <input
                type="text"
                id="apartmentNumber"
                name="apartmentNumber"
                value={formData.apartmentNumber}
                onChange={handleInputChange}
                required
                readOnly
                className="auto-filled"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Chi tiết dịch vụ</h3>
            <div className="form-group">
              <label htmlFor="memberCount"><FiUsers /> Số lượng người sử dụng</label>
              <input
                type="number"
                id="memberCount"
                name="memberCount"
                min="1"
                value={formData.memberCount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate"><FiCalendar /> Ngày bắt đầu</label>
                <input
                  type="text"
                  id="startDate"
                  value={formattedToday}
                  readOnly
                  className="auto-filled"
                />
                <small className="form-helper">Ngày bắt đầu là ngày đăng ký.</small>
              </div>
              <div className="form-group">
                <label htmlFor="endDate"><FiCalendar /> Ngày kết thúc</label>
                <input
                  type="text"
                  id="endDate"
                  value={calculateLastDayOfMonth()}
                  readOnly
                  className="auto-filled"
                />
                <small className="form-helper">Dịch vụ có hiệu lực đến cuối tháng hiện tại.</small>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3><FiCreditCard /> Phương thức thanh toán</h3>
            <div className="payment-method">
              <div className="payment-method-item active">
                <input 
                  type="radio" 
                  id="offlinePayment" 
                  name="paymentMethod" 
                  checked 
                  readOnly 
                />
                <label htmlFor="offlinePayment">Thanh toán trực tiếp</label>
                <p className="payment-instruction">
                  Vui lòng thanh toán tại văn phòng ban quản lý tòa nhà trong giờ hành chính 
                  (8:00 - 17:00, từ Thứ 2 đến Thứ 6).
                </p>
              </div>
            </div>
            
            <div className="payment-summary">
              <div className="summary-row">
                <span>Giá dịch vụ:</span>
                <span>{service.cost || '500,000 VND/người/tháng'}</span>
              </div>
              <div className="summary-row">
                <span>Số người:</span>
                <span>{formData.memberCount} người</span>
              </div>
              <div className="summary-row">
                <span>Thời gian:</span>
                <span>Đến hết tháng hiện tại</span>
              </div>
              <div className="summary-row total">
                <span>Tổng thanh toán:</span>
                <span>{calculateTotalPayment().toLocaleString('vi-VN')} VND</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-form-btn" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="submit-form-btn">
              Xác nhận đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRegistrationForm;