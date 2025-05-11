import React, { useEffect, useState } from 'react';
import './StaffPayment2.css';

const StaffPayment2 = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Default payment method

  const getEmployeeId = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    try {
      const user = JSON.parse(userData);
      return user?.user_id || null;
    } catch {
      return null;
    }
  };

  const fetchInvoices = () => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('Không tìm thấy thông tin người dùng.');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/staff/invoices?employee_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        setInvoices(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải hóa đơn:', err);
        setLoading(false);
      });
  };

  const fetchInvoiceDetail = (invoiceId) => {
    const employeeId = getEmployeeId();
    if (!employeeId) return;

    setDetailLoading(true);
    fetch(`http://127.0.0.1:8000/staff/invoices/${invoiceId}?employee_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        setSelectedInvoice(data);
        setDetailLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải chi tiết hóa đơn:', err);
        setDetailLoading(false);
      });
  };

  const handleSelectInvoice = (invoiceId) => {
    fetchInvoiceDetail(invoiceId);
  };

  const handleBack = () => {
    setSelectedInvoice(null);
    fetchInvoices();
  };

  const handlePaymentConfirmation = () => {
    const employeeId = getEmployeeId();
    if (!employeeId || !selectedInvoice) return;
  
    const { invoice_id } = selectedInvoice;
  
    fetch(`http://127.0.0.1:8000/staff/invoices/${invoice_id}/confirm-payment?employee_id=${employeeId}&payment_method=${paymentMethod}`, {
      method: 'POST',
    })
      .then(res => {
        if (!res.ok) throw new Error("HTTP status " + res.status);
        return res.json();
      })
      .then(data => {
        if (data.status === 'paid') {
          alert(data.message || 'Thanh toán thành công!');
          setSelectedInvoice(prevState => ({ ...prevState, status: 'paid' }));
        } else {
          alert('Không thể xác nhận thanh toán.');
        }
      })
      .catch(err => {
        console.error('Lỗi khi xác nhận thanh toán:', err);
        alert('Thanh toán thất bại. Vui lòng thử lại.');
      });
  };
  

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading) return <p className="loading">Đang tải danh sách hóa đơn...</p>;

  return (
    <div className="staff-payment-container">
      {selectedInvoice ? (
        detailLoading ? (
          <p className="loading">Đang tải chi tiết hóa đơn...</p>
        ) : (
          <div className="invoice-detail">
            <h3>Chi tiết hóa đơn</h3>
            <p><strong>ID:</strong> {selectedInvoice.invoice_id}</p>
            <p><strong>Mã khách hàng:</strong> {selectedInvoice.household_id}</p>
            <p><strong>Số tiền:</strong> {selectedInvoice.amount} USD</p>
            <p><strong>Ngày tạo:</strong> {selectedInvoice.created_date}</p>
            <p><strong>Trạng thái:</strong> {selectedInvoice.status === 'paid' ? 'Đã thanh toán' : selectedInvoice.status === 'overdue' ? 'Quá hạn' : 'Chờ thanh toán'}</p>
            <p><strong>Chi tiết:</strong> {selectedInvoice.description || 'Không có mô tả.'}</p>
            
            {selectedInvoice.status !== 'paid' && (
              <>
                <label>
                  Phương thức thanh toán:
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="cash">Tiền mặt</option>
                    <option value="bank">Chuyển khoản ngân hàng</option>
                  </select>
                </label>
                <button onClick={handlePaymentConfirmation}>Xác nhận thanh toán</button>
              </>
            )}

            <button onClick={handleBack}>Quay lại danh sách</button>
          </div>
        )
      ) : (
        <>
          <h2>Danh sách hóa đơn</h2>
          {invoices.length === 0 ? (
            <p>Không có hóa đơn nào.</p>
          ) : (
            <div className="invoice-list">
              {invoices.map((invoice) => (
                <div
                  key={invoice.invoice_id}
                  className="invoice-card"
                  onClick={() => handleSelectInvoice(invoice.invoice_id)}
                >
                  <p><strong>ID:</strong> {invoice.invoice_id}</p>
                  <p><strong>Khách hàng:</strong> {invoice.customer_name}</p>
                  <p><strong>Số tiền:</strong> {invoice.amount} USD</p>
                  <p><strong>Ngày tạo:</strong> {invoice.created_at}</p>
                  <p><strong>Trạng thái:</strong> {invoice.status === 'paid' ? 'Đã thanh toán' : invoice.status === 'overdue' ? 'Quá hạn' : 'Chờ thanh toán'}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StaffPayment2;
