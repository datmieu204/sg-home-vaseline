import React, { useEffect, useState } from 'react';
import './StaffService2.css';

const StaffService2 = () => {
  const [services, setServices] = useState([]);
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
  const [filterPrice, setFilterPrice] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newServiceData, setNewServiceData] = useState({
    service_name: '',
    price: '',
    status: 'active',
    description: ''
    });



    const handleAddService = () => {
        const employeeId = getEmployeeId();
        if (!employeeId) return;
      
        fetch(`http://127.0.0.1:8000/staff/services?employee_id=${employeeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newServiceData)
        })
          .then(res => {
            if (!res.ok) throw new Error('Lỗi khi thêm dịch vụ');
            return res.json();
          })
          .then(() => {
            alert('Thêm dịch vụ thành công!');
            setIsAdding(false);
            setNewServiceData({
              service_name: '',
              price: '',
              status: 'active',
              description: ''
            });
            fetchServices(); // Reload danh sách
          })
          .catch(err => {
            console.error(err);
            alert('Thêm dịch vụ thất bại!');
          });
      };
      


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
        setServices(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải dịch vụ:', err);
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
          description: data.description
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

    fetch(`http://127.0.0.1:8000/staff/services/${selectedServiceId}?employee_id=${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Lỗi khi cập nhật dịch vụ');
        return res.json();
      })
      .then(() => {
        alert('Cập nhật thành công!');
        setIsEditing(false);
        fetchServiceDetail(selectedServiceId); // Reload
        fetchServices(); // Cập nhật lại danh sách
      })
      .catch(err => {
        console.error(err);
        alert('Cập nhật thất bại!');
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <p className="loading">Đang tải danh sách dịch vụ...</p>;

  return (
    <div className="staff-service-container">
      {selectedService ? (
        detailLoading ? (
          <p className="loading">Đang tải chi tiết dịch vụ...</p>
        ) : (
          <div className="service-detail">
            <h3>Chi tiết dịch vụ</h3>
            {isEditing ? (
              <>
                <label>Tên:</label>
                <input name="service_name" value={editData.service_name} onChange={handleEditChange} />

                <label>Giá:</label>
                <input type="number" name="price" value={editData.price} onChange={handleEditChange} />

                <label>Trạng thái:</label>
                <select name="status" value={editData.status} onChange={handleEditChange}>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>

                <label>Mô tả:</label>
                <textarea name="description" value={editData.description} onChange={handleEditChange} />

                <button onClick={handleSave}>Lưu thay đổi</button>
                <button onClick={() => setIsEditing(false)}>Hủy</button>
              </>
            ) : (
              <>
                <p><strong>ID:</strong> {selectedService.service_id}</p>
                <p><strong>Tên:</strong> {selectedService.service_name}</p>
                <p><strong>Giá:</strong> {selectedService.price} USD</p>
                <p><strong>Trạng thái:</strong> {selectedService.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}</p>
                <p><strong>Mô tả:</strong> {selectedService.description}</p>
                <button onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
              </>
            )}
            <button onClick={handleBack}>Quay lại danh sách</button>
          </div>
        )
      ) : (
        <>
          <h2>Danh sách dịch vụ</h2>
          <div className="filters">
            <label>
                Lọc theo giá tối đa:
                <input
                type="number"
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                placeholder="VD: 20"
                />
            </label>

            <label>
                Trạng thái:
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                </select>
            </label>
            </div>

            <button className="add-service-btn" onClick={() => setIsAdding(true)}>
                + Thêm dịch vụ mới
            </button>


          <div className="service-list">
            {services.length === 0 ? (
              <p>Không có dịch vụ nào.</p>
            ) : (
                services
                .filter(service => {
                  const matchPrice = filterPrice === '' || service.price <= parseFloat(filterPrice);
                  const matchStatus = filterStatus === '' || service.status === filterStatus;
                  return matchPrice && matchStatus;
                })
                .map(service => (
                <div
                  key={service.service_id}
                  className="service-card"
                  onClick={() => handleSelectService(service.service_id)}
                >
                  <h3>{service.service_name}</h3>
                  <p><strong>Giá:</strong> {service.price} USD</p>
                  <p><strong>Trạng thái:</strong> {service.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}</p>
                  <p><strong>Mô tả:</strong> {service.description}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}

        {isAdding && (
        <div className="modal">
            <div className="modal-content">
            <h3>Thêm dịch vụ mới</h3>

            <label>Tên:</label>
            <input
                name="service_name"
                value={newServiceData.service_name}
                onChange={(e) => setNewServiceData(prev => ({ ...prev, service_name: e.target.value }))}
            />

            <label>Giá:</label>
            <input
                type="number"
                name="price"
                value={newServiceData.price}
                onChange={(e) => setNewServiceData(prev => ({ ...prev, price: e.target.value }))}
            />

            <label>Trạng thái:</label>
            <select
                name="status"
                value={newServiceData.status}
                onChange={(e) => setNewServiceData(prev => ({ ...prev, status: e.target.value }))}
            >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
            </select>

            <label>Mô tả:</label>
            <textarea
                name="description"
                value={newServiceData.description}
                onChange={(e) => setNewServiceData(prev => ({ ...prev, description: e.target.value }))}
            />

            <div className="modal-actions">
                <button onClick={handleAddService}>Thêm</button>
                <button onClick={() => setIsAdding(false)}>Hủy</button>
            </div>
            </div>
        </div>
        )}

    </div>
  );
};

export default StaffService2;
