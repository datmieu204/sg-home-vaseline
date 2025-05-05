import React, { useState } from 'react';
import './PaymentConfirmation.css';

const PaymentConfirmation = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleConfirmationChange = (event) => {
    setIsConfirmed(event.target.checked);
  };

  return (
    <div className="payment-confirmation-page">
      <h1>Phòng 5020 đóng tiền Tháng 4/2025</h1>
      <div className="payment-deadlines">
        <p>
          <span className="deadline-label">Hết hạn:</span> 30/04/2025 lúc 23:59
        </p>
        <p>
          <span className="deadline-label">Đóng vào:</span> 29/04/2025 lúc 11:20
        </p>
      </div>

      <form className="payment-form">
        {/* Số tiền */}
        <div className="form-section box">
          <label className="form-label">Số tiền</label>
          <div className="form-value">1 700 000 VND</div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="form-section box">
          <label className="form-label">Phương thức thanh toán</label>
          <div className="payment-methods">
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="Chuyển khoản"
                checked={paymentMethod === 'Chuyển khoản'}
                onChange={() => handlePaymentMethodChange('Chuyển khoản')}
              />
              Chuyển khoản
            </label>
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="Offline qua lễ tân"
                checked={paymentMethod === 'Offline qua lễ tân'}
                onChange={() => handlePaymentMethodChange('Offline qua lễ tân')}
              />
              Offline qua lễ tân
            </label>
          </div>
        </div>

        {/* Checkbox xác nhận */}
        <div className="checkbox-container">
          <label className="confirmation">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={handleConfirmationChange}
            />
            Xác nhận thanh toán
          </label>
        </div>
      </form>
    </div>
  );
};

export default PaymentConfirmation;