import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaFlag, FaInfoCircle, FaUserAlt, FaClock } from 'react-icons/fa';
import SearchBar from '../../../components/SearchBar/SearchBar';
import './ManagerIncidents1.css';

const ManagerIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);




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

  // Load incidents
  useEffect(() => {
    const fetchIncidents = async () => {
      const employeeId = getEmployeeId();
      if (!employeeId) {
        alert('Không tìm thấy thông tin người dùng.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/manager/incidents/?employee_id=${employeeId}`);
        const data = await response.json();
        const sortedIncidents = sortIncidentsByDate(data.incidents || []);
        setIncidents(sortedIncidents);
        setFilteredIncidents(sortedIncidents);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải danh sách sự cố:', err);
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // Sorting function - newest to oldest
  const sortIncidentsByDate = (incidentsToSort) => {
    return [...incidentsToSort].sort((a, b) => {
      const dateA = a.report_time ? new Date(a.report_time) : new Date(0);
      const dateB = b.report_time ? new Date(b.report_time) : new Date(0);
      return dateB - dateA; // Newest first
    });
  };

  // Apply filters when filter state changes
  useEffect(() => {
    let filtered = [...incidents];
  
    // Apply filters
    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter);
    }
  
    if (monthFilter) {
      filtered = filtered.filter(i => 
        i.report_time && new Date(i.report_time).getMonth() + 1 === parseInt(monthFilter)
      );
    }
  
    if (yearFilter) {
      filtered = filtered.filter(i => 
        i.report_time && new Date(i.report_time).getFullYear() === parseInt(yearFilter)
      );
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(incident => 
        (incident.incident_name && incident.incident_name.toLowerCase().includes(term)) ||
        (incident.description && incident.description.toLowerCase().includes(term))
      );
    }
  
    setFilteredIncidents(filtered);
  }, [incidents, statusFilter, monthFilter, yearFilter, searchTerm]);


  const handleUpdateStatus = async () => {
    const employeeId = getEmployeeId();
    if (!employeeId || !selectedIncidentId) return;

    if (!newStatus) {
      alert('Vui lòng chọn trạng thái mới.');
      return;
    }

    setUpdatingStatus(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/manager/incidents/${selectedIncidentId}/update_status?employee_id=${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          description: updateDescription,
        }),
      });

      if (!response.ok) throw new Error('Cập nhật trạng thái thất bại');

      const updatedData = await response.json();
      setSelectedIncident(updatedData);
      setNewStatus('');
      setUpdateDescription('');
      alert('Cập nhật trạng thái thành công!');

      // Refresh danh sách sự cố
      const refreshedIncidents = await fetch(`http://127.0.0.1:8000/manager/incidents/?employee_id=${employeeId}`);
      const refreshedData = await refreshedIncidents.json();
      const sorted = sortIncidentsByDate(refreshedData.incidents || []);
      setIncidents(sorted);
      setFilteredIncidents(sorted);
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };



  const handleSelectIncident = (incidentId) => {
    setSelectedIncidentId(incidentId);
    
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

  const handleBack = () => {
    setSelectedIncidentId(null);
    setSelectedIncident(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch(status) {
      case 'resolved': return 'Đã xử lý';
      case 'in_progress': return 'Đang xử lý';
      default: return 'Không xác định';
    }
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'resolved': return 'status-resolved';
      case 'in_progress': return 'status-in-progress';
      default: return 'status-unknown';
    }
  };

  if (loading) return <div className="loading-container"><div className="loader"></div><p>Đang tải dữ liệu...</p></div>;

  return (
    <div className="manager-incidents-container">
      {selectedIncidentId ? (
        detailLoading ? (
          <div className="loading-container"><div className="loader"></div><p>Đang tải chi tiết...</p></div>
        ) : (
          <div className="incident-detail-container">
            <button className="back-button" onClick={handleBack}>
              <FaArrowLeft /> <span>Quay lại danh sách</span>
            </button>
            
            <div className="incident-detail-header">
              <h2>{selectedIncident.incident_name}</h2>
              <div className={`incident-status ${getStatusClass(selectedIncident.status)}`}>
                {getStatusLabel(selectedIncident.status)}
              </div>
            </div>
            
            <div className="incident-detail-content">
              <div className="incident-info-section">
                <div className="info-card">
                  <div className="info-card-header">
                    <FaInfoCircle /> <h3>Thông tin cơ bản</h3>
                  </div>
                  <div className="info-card-content">
                    <div className="info-item">
                      <span className="info-label"><FaFlag /> ID sự cố:</span>
                      <span className="info-value">{selectedIncident.incident_id}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label"><FaClock /> Thời gian báo cáo:</span>
                      <span className="info-value">{formatDate(selectedIncident.report_time)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label"><FaUserAlt /> Người báo cáo:</span>
                      <span className="info-value">{selectedIncident.reporter_id || 'Không xác định'}</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-header">
                    <FaInfoCircle /> <h3>Cập nhật trạng thái</h3>
                  </div>
                  <div className="info-card-content">
                    <div className="status-update-form">
                      <label>
                        Trạng thái mới:
                        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                          <option value="">-- Chọn trạng thái mới --</option>
                          <option value="in_progress">Đang xử lý</option>
                          <option value="resolved">Đã xử lý</option>
                        </select>
                      </label>
                      <label>
                        Ghi chú cập nhật:
                        <textarea
                          placeholder="Mô tả cập nhật (nếu có)"
                          value={updateDescription}
                          onChange={(e) => setUpdateDescription(e.target.value)}
                        />
                      </label>
                      <button 
                        className="update-status-button" 
                        onClick={handleUpdateStatus} 
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
                      </button>
                    </div>
                  </div>
                </div>

                
                <div className="info-card description-card">
                  <div className="info-card-header">
                    <FaInfoCircle /> <h3>Mô tả sự cố</h3>
                  </div>
                  <div className="info-card-content">
                    <p className="incident-description">{selectedIncident.description || 'Không có mô tả chi tiết cho sự cố này.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="incidents-list-container">
          <div className="page-header">
            <h1>Danh sách sự cố</h1>
            <div className="search-filter-container">
              <SearchBar 
                placeholder="Tìm kiếm sự cố..." 
                onSearch={handleSearch} 
              />
              <div className="filters-dropdown">
                <span className="filter-label">Trạng thái:</span>
                <div className="filter-selector">
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="in_progress">Đang xử lý</option>
                    <option value="resolved">Đã xử lý</option>
                  </select>
                </div>
                <span className="filter-label">Tháng:</span>
                <div className="filter-selector">
                  <select 
                    value={monthFilter} 
                    onChange={(e) => setMonthFilter(e.target.value)}
                  >
                    <option value="">Tất cả tháng</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i + 1}>Tháng {i + 1}</option>
                    ))}
                  </select>
                </div>
                <span className="filter-label">Năm:</span>
                <div className="filter-selector">
                  <select 
                    value={yearFilter} 
                    onChange={(e) => setYearFilter(e.target.value)}
                  >
                    <option value="">Tất cả năm</option>
                    {Array.from(
                      new Set(incidents.map(i => 
                        i.report_time ? new Date(i.report_time).getFullYear() : null
                      ).filter(Boolean))
                    ).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="no-incidents">
              <p>Không tìm thấy sự cố nào.</p>
            </div>
          ) : (
            <div className="incidents-grid">
              {filteredIncidents.map(incident => (
                <div 
                  key={incident.incident_id} 
                  className="incident-card" 
                  onClick={() => handleSelectIncident(incident.incident_id)}
                >
                  <div className="incident-card-header">
                    <h3 className="incident-title">{incident.incident_name}</h3>
                    <span className={`incident-status-badge ${getStatusClass(incident.status)}`}>
                      {getStatusLabel(incident.status)}
                    </span>
                  </div>
                  <div className="incident-card-content">
                    <p className="incident-info">
                      <FaCalendarAlt className="info-icon" /> {formatDate(incident.report_time)}
                    </p>
                    <p className="incident-info">
                      <FaUserAlt className="info-icon" /> {incident.reporter_id || 'Không xác định'}
                    </p>
                    <p className="incident-description-preview">
                      {incident.description 
                        ? (incident.description.length > 100 
                            ? incident.description.slice(0, 100) + '...' 
                            : incident.description)
                        : 'Không có mô tả'}
                    </p>
                  </div>
                  <div className="incident-card-footer">
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagerIncidents;