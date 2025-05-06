import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PaymentList.css';
import ListContainer from '../ListContainer/ListContainer';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false); // State để theo dõi toggle

  useEffect(() => {
    // Mock data for payments
    const mockPayments = [
      {
        id: 1,
        title: 'Phòng 4021 đóng tiền Tháng 4/2025',
        statusText: 'Chưa đóng',
        statusType: 'open',
        deadline: '29/04/2025 lúc 11:20',
      },
      {
        id: 2,
        title: 'Phòng 5020 đóng tiền Tháng 4/2025',
        statusText: 'Chưa đóng',
        statusType: 'open',
        deadline: '29/04/2025 lúc 10:59',
      },
      {
        id: 3,
        title: 'Phòng 4012 đóng tiền Tháng 4/2025',
        statusText: 'Đã đóng',
        statusType: 'closed',
        deadline: '29/04/2025 lúc 10:30',
      },
      {
        id: 4,
        title: 'Phòng 3011 đóng tiền Tháng 4/2025',
        statusText: 'Chưa đóng',
        statusType: 'open',
        deadline: '29/04/2025 lúc 09:30',
      },
    ];

    setPayments(mockPayments);
    setFilteredPayments(mockPayments);
    setLoading(false);
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = payments.filter((payment) =>
      payment.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  const handleFilter = (filterType) => {
    if (filterType === 'all') {
      setFilteredPayments(payments);
    } else if (filterType === 'open') {
      setFilteredPayments(payments.filter((payment) => payment.statusType === 'open'));
    } else if (filterType === 'closed') {
      setFilteredPayments(payments.filter((payment) => payment.statusType === 'closed'));
    }
  };

  const filterOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chưa đóng', value: 'open' },
    { label: 'Đã đóng', value: 'closed' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="payment-page">
      {/* Header với toggle */}
      <div
        className="payment-list-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className={`toggle-icon ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
        <h2>Tất cả Thanh Toán</h2>
      </div>

      {/* Danh sách thanh toán, ẩn/hiện dựa trên toggle */}
      {!isCollapsed && (
        <ListContainer
          title="Danh sách thanh toán"
          items={filteredPayments.map((payment) => ({
            ...payment,
            title: (
              <Link to={`/payment-confirmation/${payment.id}`} className="payment-link">
                {payment.title}
              </Link>
            ), // Tiêu đề thanh toán chuyển thành liên kết
          }))}
          searchPlaceholder="Tìm kiếm theo số phòng..."
          filterOptions={filterOptions}
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
      )}
    </div>
  );
};

export default PaymentList;