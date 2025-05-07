// Thêm các import cần thiết
import React, { useEffect, useState } from 'react';
import IncidentList from '../../../components/IncidentList';
import './StaffIncidents2.css';

const StaffIncidents2 = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIncidentName, setNewIncidentName] = useState('');
  const [newIncidentDesc, setNewIncidentDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');


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

    fetch(`http://127.0.0.1:8000/staff/incidents?employee_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        setIncidents(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh sách sự cố:', err);
        setLoading(false);
      });
  };


  const handleUpdateStatus = () => {
    const employeeId = getEmployeeId();
    if (!employeeId || !selectedIncidentId) return;
  
    if (!newStatus) {
      alert('Vui lòng chọn trạng thái mới.');
      return;
    }
  
    setUpdatingStatus(true);
  
    fetch(`http://127.0.0.1:8000/staff/incidents/${selectedIncidentId}?employee_id=${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        description: updateDescription
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Cập nhật trạng thái thất bại');
        return res.json();
      })
      .then(data => {
        setSelectedIncident(data);
        fetchIncidents(); // Cập nhật lại danh sách
        alert('Cập nhật trạng thái thành công!');
      })
      .catch(err => alert(err.message))
      .finally(() => setUpdatingStatus(false));
  };
  

  const fetchIncidentDetail = (incidentId) => {
    const employeeId = getEmployeeId();
    if (!employeeId) return;

    setDetailLoading(true);
    fetch(`http://127.0.0.1:8000/staff/incidents/${incidentId}?employee_id=${employeeId}`)
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

  const handleSubmitNewIncident = () => {
    const employeeId = getEmployeeId();
    if (!employeeId) return;

    if (!newIncidentName || !newIncidentDesc) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setSubmitting(true);
    fetch(`http://127.0.0.1:8000/staff/incidents?employee_id=${employeeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        incident_name: newIncidentName,
        description: newIncidentDesc
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Thêm sự cố thất bại');
        return res.json();
      })
      .then(() => {
        setShowAddModal(false);
        setNewIncidentName('');
        setNewIncidentDesc('');
        fetchIncidents();
      })
      .catch(err => alert(err.message))
      .finally(() => setSubmitting(false));
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
            <p><strong>Người phụ trách:</strong> {selectedIncident.responsible_id}</p>
            <p><strong>Trạng thái hiện tại:</strong> {selectedIncident.status}</p>
                <div className="status-update-form">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <option value="">-- Chọn trạng thái mới --</option>
                    <option value="in_progress">Đang xử lý</option>
                    <option value="resolved">Đã xử lý</option>
                </select>
                <textarea
                    placeholder="Mô tả cập nhật (nếu có)"
                    value={updateDescription}
                    onChange={(e) => setUpdateDescription(e.target.value)}
                />
                <button onClick={handleUpdateStatus} disabled={updatingStatus}>
                    {updatingStatus ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
                </button>
                </div>
            <p><strong>Mô tả:</strong> {selectedIncident.description}</p>
            <button onClick={handleBack}>Quay lại danh sách</button>
          </div>
        )
      ) : (
        <>
          <h2>Danh sách sự cố đã báo cáo</h2>
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

            <button onClick={() => setShowAddModal(true)}>+ Thêm sự cố</button>
          </div>

          <IncidentList incidents={filteredIncidents} onIncidentClick={handleSelectIncident} />

          {showAddModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Thêm sự cố mới</h3>
                <input
                  type="text"
                  placeholder="Tên sự cố"
                  value={newIncidentName}
                  onChange={(e) => setNewIncidentName(e.target.value)}
                />
                <textarea
                  placeholder="Mô tả"
                  value={newIncidentDesc}
                  onChange={(e) => setNewIncidentDesc(e.target.value)}
                />
                <div className="modal-actions">
                  <button onClick={handleSubmitNewIncident} disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi'}
                  </button>
                  <button onClick={() => setShowAddModal(false)}>Hủy</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StaffIncidents2;
