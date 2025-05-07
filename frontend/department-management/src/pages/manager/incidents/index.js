import React, { useEffect, useState } from 'react';
import IncidentList from '../../../components/IncidentList'; // Giả sử bạn sẽ tạo file này
import './ManagerIncidents1.css';

const ManagerIncidents1 = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [monthFilter, setMonthFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [filteredIncidents, setFilteredIncidents] = useState([]);


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

  const fetchIncidents = () => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('Không tìm thấy thông tin người dùng.');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/manager/incidents/?employee_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        setIncidents(data.incidents || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh sách sự cố:', err);
        setLoading(false);
      });
  };

  const fetchIncidentDetail = (incidentId) => {
    const employeeId = getEmployeeId();
    if (!employeeId) return;

    setDetailLoading(true);
    fetch(`http://127.0.0.1:8000/manager/incidents/${incidentId}?employee_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        setSelectedIncident(data);
        setDetailLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải chi tiết sự cố:', err);
        setDetailLoading(false);
      });
  };

  const handleSelectIncident = (incidentId) => {
    setSelectedIncidentId(incidentId);
    fetchIncidentDetail(incidentId);
  };

  const handleBack = () => {
    setSelectedIncidentId(null);
    setSelectedIncident(null);
  };

  useEffect(() => {
    fetchIncidents();
  }, []);


  useEffect(() => {
    let filtered = [...incidents];
  
    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter);
    }
  
    if (monthFilter) {
      filtered = filtered.filter(i => new Date(i.report_time).getMonth() + 1 === parseInt(monthFilter));
    }
  
    if (yearFilter) {
      filtered = filtered.filter(i => new Date(i.report_time).getFullYear() === parseInt(yearFilter));
    }
  
    setFilteredIncidents(filtered);
  }, [incidents, statusFilter, monthFilter, yearFilter]);
  

  if (loading) return <p className="loading">Đang tải danh sách sự cố...</p>;

  return (
    <div className="manager-incidents-container">
      {selectedIncident ? (
        detailLoading ? (
          <p className="loading">Đang tải chi tiết sự cố...</p>
        ) : (
          <div className="incident-detail">
            <h3>Chi tiết sự cố</h3>
            <p><strong>ID:</strong> {selectedIncident.incident_id}</p>
            <p><strong>Tên:</strong> {selectedIncident.incident_name}</p>
            <p><strong>Thời gian báo cáo:</strong> {new Date(selectedIncident.report_time).toLocaleString()}</p>
            <p><strong>Người báo cáo:</strong> {selectedIncident.reporter_id}</p>
            <p><strong>Trạng thái:</strong> {selectedIncident.status}</p>
            <p><strong>Mô tả:</strong> {selectedIncident.description}</p>
            <button onClick={handleBack}>Quay lại danh sách</button>
          </div>
        )
      ) : (
        <>
          <h2>Danh sách sự cố</h2>
          <div className="filters">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="resolved">Đã xử lý</option>
            </select>

            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                <option value="">Tất cả tháng</option>
                {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>Tháng {i + 1}</option>
                ))}
            </select>

            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                <option value="">Tất cả năm</option>
                {Array.from(new Set(incidents.map(i => new Date(i.report_time).getFullYear()))).map(year => (
                <option key={year} value={year}>{year}</option>
                ))}
            </select>
            </div>

            <IncidentList incidents={filteredIncidents} onIncidentClick={handleSelectIncident} />
        </>
      )}
    </div>
  );
};

export default ManagerIncidents1;
