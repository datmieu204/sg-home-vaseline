import React, { useEffect, useState } from 'react';
import './StaffService2.css';
import { FaEdit, FaArrowLeft, FaPlus, FaSave, FaTimesCircle, FaFilter, FaSearch, FaDollarSign, FaInfoCircle, FaToggleOn } from 'react-icons/fa';

const StaffService2 = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    service_name: '',
    price: '',
    status: 'active',
    description: ''
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newServiceData, setNewServiceData] = useState({
    service_name: '',
    price: '',
    status: 'active',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

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

  // Hàm sắp xếp - theo tên
  const sortServicesByName = (servicesToSort) => {
    return [...servicesToSort].sort((a, b) => {
      return a.service_name.localeCompare(b.service_name);
    });
  };

  const fetchServices = () => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('Không tìm thấy thông tin người dùng.');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/staff/services?employee_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        const sortedServices = sortServicesByName(data || []);
        setServices(sortedServices);
        setFilteredServices(sortedServices);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh sách dịch vụ:', err);
        setLoading(false);
      });
  };

  const fetchServiceDetail = (serviceId) => {
    const employeeId = getEmployeeId();
    if (!employeeId) return;

    setDetailLoading(true);
    fetch(`http://127.0.0.1:8000/staff/services/${serviceId}?employee_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        setSelectedService(data);
        setEditData({
          service_name: data.service_name,
          price: data.price,
          status: data.status,
          description: data.description || ''
        });
        setDetailLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải chi tiết dịch vụ:', err);
        setDetailLoading(false);
      });
  };

  const handleSelectService = (serviceId) => {
    setSelectedServiceId(serviceId);
    fetchServiceDetail(serviceId);
  };

  const handleBack = () => {
    setSelectedServiceId(null);
    setSelectedService(null);
    setIsEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const employeeId = getEmployeeId();
    if (!employeeId || !selectedServiceId) return;
    
    if (!editData.service_name || !editData.price) {
      alert('Vui lòng nhập đầy đủ thông tin (Tên và Giá)');
      return;
    }

    fetch(`http://127.0.0.1:8000/staff/services/${selectedServiceId}?employee_id=${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Lỗi cập nhật dịch vụ');
        return res.json();
      })
      .then(() => {
        alert('Cập nhật thành công!');
        setIsEditing(false);
        fetchServiceDetail(selectedServiceId);
        fetchServices();
      })
      .catch(err => {
        console.error(err);
        alert('Cập nhật thất bại!');
      });
  };

  const handleAddService = () => {
    const employeeId = getEmployeeId();
    if (!employeeId) return;
    
    if (!newServiceData.service_name || !newServiceData.price) {
      alert('Vui lòng nhập đầy đủ thông tin (Tên và Giá)');
      return;
    }
    
    setSubmitting(true);
    fetch(`http://127.0.0.1:8000/staff/services?employee_id=${employeeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newServiceData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Lỗi thêm dịch vụ');
        return res.json();
      })
      .then(() => {
        alert('Thêm dịch vụ thành công!');
        setShowAddModal(false);
        setNewServiceData({
          service_name: '',
          price: '',
          status: 'active',
          description: ''
        });
        fetchServices();
      })
      .catch(err => {
        console.error(err);
        alert('Thêm dịch vụ thất bại!');
      })
      .finally(() => setSubmitting(false));
  };
  
  const resetFilters = () => {
    setPriceFilter('');
    setStatusFilter('');
    setSearchTerm('');
  };

  // Lấy nhãn trạng thái
  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      default: return 'Không xác định';
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = [...services];

    if (statusFilter) {
      filtered = filtered.filter(service => service.status === statusFilter);
    }

    if (priceFilter) {
      filtered = filtered.filter(service => 
        service.price <= parseFloat(priceFilter)
      );
    }

    // Áp dụng tìm kiếm
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        (service.service_name && service.service_name.toLowerCase().includes(term)) ||
        (service.description && service.description.toLowerCase().includes(term))
      );
    }

    setFilteredServices(filtered);
  }, [services, statusFilter, priceFilter, searchTerm]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="staff-service-container">
      {selectedService ? (
        detailLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Đang tải chi tiết dịch vụ...</p>
          </div>
        ) : (
          <div className="service-detail-panel">
            <div className="panel-header">
              <button className="back-button" onClick={handleBack}>
                <FaArrowLeft /> Quay lại
              </button>
              <h2>Chi tiết dịch vụ</h2>
            </div>
            
            {isEditing ? (
              <div className="edit-form">
                <div className="form-grid">
                  <div className="form-group-staff">
                    <label>Tên dịch vụ: <span className="required">*</span></label>
                    <input 
                      name="service_name" 
                      value={editData.service_name} 
                      onChange={handleEditChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group-staff">
                    <label>Giá: <span className="required">*</span></label>
                    <div className="price-input-wrapper">
                      <input 
                        type="number" 
                        name="price" 
                        value={editData.price} 
                        onChange={handleEditChange}
                        className="form-control"
                        required
                      />
                      <span className="currency-symbol">đ</span>
                    </div>
                  </div>

                  <div className="form-group-staff">
                    <label>Trạng thái:</label>
                    <select 
                      name="status" 
                      value={editData.status} 
                      onChange={handleEditChange}
                      className="form-control"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-staff full-width">
                  <label>Mô tả:</label>
                  <textarea 
                    name="description" 
                    value={editData.description} 
                    onChange={handleEditChange}
                    className="form-control"
                    rows="5"
                    placeholder="Nhập mô tả chi tiết về dịch vụ này..."
                  />
                </div>

                <div className="button-group">
                  <button className="save-button" onClick={handleSave}>
                    <FaSave /> Lưu thay đổi
                  </button>
                  <button className="cancel-button" onClick={() => setIsEditing(false)}>
                    <FaTimesCircle /> Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="service-info-card">
                <div className="service-header">
                  <h3>{selectedService.service_name}</h3>
                  <span className={`status-badge ${selectedService.status}`}>
                    {getStatusLabel(selectedService.status)}
                  </span>
                </div>
                
                <div className="service-content">
                  <div className="info-columns">
                    <div className="info-column">
                      <div className="info-item">
                        <span className="label"><FaInfoCircle /> ID:</span>
                        <span className="value service-id">{selectedService.service_id}</span>
                      </div>
                      <div className="info-item highlight">
                        <span className="label"><FaDollarSign /> Giá dịch vụ:</span>
                        <span className="value price-value">{selectedService.price.toLocaleString()}đ</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divider"></div>
                  
                  <div className="description-section">
                    <h4>Mô tả dịch vụ</h4>
                    <div className="description-content">
                      {selectedService.description ? (
                        <p>{selectedService.description}</p>
                      ) : (
                        <p className="no-description">Không có mô tả chi tiết.</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="action-footer">
                  <button className="edit-button" onClick={() => setIsEditing(true)}>
                    <FaEdit /> Chỉnh sửa dịch vụ
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="services-list-view">
          <div className="page-header">
            <h1>Quản lý dịch vụ</h1>
          </div>
          
          <div className="actions-row">
            <div className="search-section">
              <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm dịch vụ..."
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="filters-section">
              <div className="filter-group">
                <span className="filter-label">Giá tối đa:</span>
                <input
                  type="number"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  placeholder="VD: 50000"
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <span className="filter-label">Trạng thái:</span>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Tất cả</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>
            <button className="add-service-btn" onClick={() => setShowAddModal(true)}>
              <FaPlus /> Thêm dịch vụ mới
            </button>
          </div>

          <div className="service-grid">
            {filteredServices.length === 0 ? (
              <div className="no-services">
                <p>Không tìm thấy dịch vụ nào phù hợp.</p>
              </div>
            ) : (
              filteredServices.map(service => (
                <div
                  key={service.service_id}
                  className="service-card"
                  onClick={() => handleSelectService(service.service_id)}
                >
                  <div className="card-header-service">
                    <h3>{service.service_name}</h3>
                    <span className={`status-badge ${service.status}`}>
                      {getStatusLabel(service.status)}
                    </span>
                  </div>
                  <div className="card-body">
                    <p className="price">
                      <FaDollarSign className="info-icon" /> {service.price}đ
                    </p>
                    <p className="description">
                      {service.description && service.description.length > 100
                        ? service.description.substring(0, 100) + "..."
                        : service.description || "Không có mô tả"}
                    </p>
                  </div>
                  <div className="service-card-footer">
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Thêm dịch vụ mới</h3>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group-staff">
                <label>Tên dịch vụ: <span className="required">*</span></label>
                <input
                  name="service_name"
                  value={newServiceData.service_name}
                  onChange={(e) => setNewServiceData(prev => ({ ...prev, service_name: e.target.value }))}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group-staff">
                <label>Giá: <span className="required">*</span></label>
                <input
                  type="number"
                  name="price"
                  value={newServiceData.price}
                  onChange={(e) => setNewServiceData(prev => ({ ...prev, price: e.target.value }))}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group-staff">
                <label>Trạng thái:</label>
                <select
                  name="status"
                  value={newServiceData.status}
                  onChange={(e) => setNewServiceData(prev => ({ ...prev, status: e.target.value }))}
                  className="form-control"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              <div className="form-group-staff">
                <label>Mô tả:</label>
                <textarea
                  name="description"
                  value={newServiceData.description}
                  onChange={(e) => setNewServiceData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-control"
                  rows="5"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="submit-button" onClick={handleAddService} disabled={submitting}>
                {submitting ? 'Đang xử lý...' : 'Thêm dịch vụ'}
              </button>
              <button className="cancel-button" onClick={() => setShowAddModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffService2;