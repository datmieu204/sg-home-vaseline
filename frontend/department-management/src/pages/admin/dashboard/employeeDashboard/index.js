import React, { useState, useEffect } from 'react';
import { fetchEmployeeData } from './api';
import EmployeeChart from './EmployeeChart';
import './employeeDashboard.css';

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchEmployeeData();
        setData(response);
      } catch (err) {
        setFetchError(`Không thể lấy dữ liệu từ server sau nhiều lần thử. Lỗi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="text-center p-4">Đang tải dữ liệu...</div>;
  if (fetchError) return <div className="text-center text-red-500">{fetchError}</div>;
  if (!data) return <div className="text-center text-red-500">Không có dữ liệu.</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-7xl px-8 space-y-12">
        <h1 className="text-3xl font-bold text-center">Trực quan hóa dữ liệu nhân viên</h1>
        <EmployeeChart data={data} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
