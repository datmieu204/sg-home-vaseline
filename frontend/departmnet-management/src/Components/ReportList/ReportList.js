import React, { useState, useEffect } from 'react';
import './ReportList.css';
import ListContainer from '../ListContainer/ListContainer';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch reports from an API
    const mockReports = [
      {
        title: 'Cháy máy bơm',
        statusText: 'Chưa xử lý',
        statusType: 'open',
        deadline: '04/05/2025 lúc 23:59',
        deadlineLabel: 'Gửi vào'
      },
      {
        title: 'Cháy nhà',
        statusText: 'Đã xử lý',
        statusType: 'closed',
        deadline: '04/05/2025 lúc 23:59',
        deadlineLabel: 'Gửi vào'
      },
      {
        title: 'Hỏng thang máy',
        statusText: 'Đã xử lý',
        statusType: 'closed',
        deadline: '04/05/2025 lúc 23:59',
        deadlineLabel: 'Gửi vào'
      },
      {
        title: 'Hỏng bóng đèn tầng 1',
        statusText: 'Đã xử lý',
        statusType: 'closed',
        deadline: '04/05/2025 lúc 23:59',
        deadlineLabel: 'Gửi vào'
      }
    ];
    
    setReports(mockReports);
    setFilteredReports(mockReports);
    setLoading(false);
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = reports.filter(report => 
      report.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
  };

  const handleFilter = (filterType) => {
    if (filterType === 'all') {
      setFilteredReports(reports);
    } else if (filterType === 'pending') {
      setFilteredReports(reports.filter(report => report.statusType === 'open'));
    } else if (filterType === 'processed') {
      setFilteredReports(reports.filter(report => report.statusType === 'closed'));
    }
  };

  const filterOptions = [
    { label: 'Xem theo Năm', value: 'year' },
    { label: 'Xem chưa xử lý', value: 'pending' }
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="report-page">
      <ListContainer
        title="Tất cả sự cố"
        items={filteredReports}
        searchPlaceholder="Tìm kiếm theo tên báo cáo..."
        filterOptions={filterOptions}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
    </div>
  );
};

export default ReportList;